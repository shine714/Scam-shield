import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { AnalyzeMessageRequestSchema } from './schema.js';
import {
  AiAnalysisError,
  AiNotConfiguredError,
  createGeminiMessageAnalyzer,
  getActiveModel,
  isAiConfigured,
  type MessageAnalyzer,
} from './aiService.js';
import { AnalyzeUrlRequestSchema } from './urlSchema.js';
import {
  InvalidUrlError,
  analyzeUrlSafely,
  createSafeBrowsingClient,
  isUrlReputationConfigured,
  type ReputationLookupClient,
} from './urlAnalyzer.js';

export interface AppDependencies {
  analyzer?: MessageAnalyzer;
  checkAiConfigured?: () => boolean;
  getModel?: () => string;
  urlReputationClient?: ReputationLookupClient;
  checkUrlReputationConfigured?: () => boolean;
  serveStatic?: boolean;
  staticDir?: string;
}

function pickLang(body: unknown): 'en' | 'hi' {
  if (
    typeof body === 'object' &&
    body !== null &&
    'language' in body &&
    (body as { language?: unknown }).language === 'hi'
  ) {
    return 'hi';
  }
  return 'en';
}

function localizedError(
  en: string,
  hi: string,
  lang: 'en' | 'hi'
): { error: string; errorLocalized: { en: string; hi: string } } {
  return {
    error: lang === 'hi' ? hi : en,
    errorLocalized: { en, hi },
  };
}

export function createApp(deps: AppDependencies = {}): Express {
  const app = express();
  app.disable('x-powered-by');
  const allowedOrigins = new Set([
    'https://shine714.github.io',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...(process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
          .map((o) => o.trim())
          .filter(Boolean)
      : []),
  ]);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');

    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }

    if (req.method === 'OPTIONS' && req.path.startsWith('/api')) {
      res.status(204).end();
      return;
    }

    next();
  });
  const analyzer = deps.analyzer ?? createGeminiMessageAnalyzer();
  const checkAiConfigured = deps.checkAiConfigured ?? isAiConfigured;
  const getModel = deps.getModel ?? getActiveModel;
  const urlReputationClient =
    deps.urlReputationClient ?? createSafeBrowsingClient();
  const checkUrlReputationConfigured =
    deps.checkUrlReputationConfigured ?? isUrlReputationConfigured;

  app.use(express.json({ limit: '64kb' }));

  app.use(
    (err: unknown, req: Request, res: Response, next: NextFunction) => {
      if (
        typeof err === 'object' &&
        err !== null &&
        (('type' in err && (err as { type?: unknown }).type === 'entity.too.large') ||
          ('status' in err && (err as { status?: unknown }).status === 413))
      ) {
        const lang = pickLang(req.body);
        res.status(413).json({
          ok: false,
          errorCode: 'PAYLOAD_TOO_LARGE',
          ...localizedError(
            'Request payload is too large (maximum 64 KB).',
            'अनुरोध डेटा बहुत बड़ा है (अधिकतम 64 KB)।',
            lang
          ),
        });
        return;
      }

      if (err instanceof SyntaxError && 'body' in err) {
        const lang = pickLang(req.body);
        res.status(400).json({
          ok: false,
          errorCode: 'INVALID_INPUT',
          ...localizedError(
            'Invalid JSON request body.',
            'अमान्य JSON अनुरोध। कृपया दोबारा प्रयास करें।',
            lang
          ),
        });
        return;
      }
      next(err);
    }
  );

  app.get('/api/health', (_req: Request, res: Response) => {
    const aiConfigured = checkAiConfigured();
    const urlReputationConfigured = checkUrlReputationConfigured();
    res.json({
      ok: true,
      service: 'scamshield-ai-backend',
      aiConfigured,
      model: aiConfigured ? getModel() : null,
      urlReputationConfigured,
      urlReputationProvider: urlReputationConfigured
        ? 'Google Safe Browsing v4'
        : null,
    });
  });

  app.post('/api/analyze-message', async (req: Request, res: Response) => {
    const reqLang = pickLang(req.body);
    const parsed = AnalyzeMessageRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? 'Invalid message input.';
      const hiIssue = firstIssue.includes('empty')
        ? 'संदेश खाली नहीं हो सकता। कृपया कोई संदेश पेस्ट करें।'
        : firstIssue.includes('5000')
          ? 'संदेश 5,000 अक्षरों से छोटा होना चाहिए।'
          : 'कृपया सही संदेश दर्ज करें।';
      res.status(400).json({
        ok: false,
        errorCode: 'INVALID_INPUT',
        ...localizedError(firstIssue, hiIssue, reqLang),
      });
      return;
    }

    if (!checkAiConfigured()) {
      res.status(503).json({
        ok: false,
        errorCode: 'AI_NOT_CONFIGURED',
        ...localizedError(
          'Live AI analysis is not configured on the backend. Set GEMINI_API_KEY in your .env file and restart the server.',
          'बैकएंड पर लाइव AI सेवा सेट नहीं है। अपनी .env फ़ाइल में GEMINI_API_KEY जोड़कर सर्वर को दोबारा शुरू करें।',
          parsed.data.language
        ),
      });
      return;
    }

    try {
      const { analysis, model } = await analyzer.analyze(parsed.data);
      res.json({
        ok: true,
        isRealAi: true,
        analyzedAt: new Date().toISOString(),
        model,
        channel: parsed.data.channel,
        result: analysis,
      });
    } catch (err) {
      if (err instanceof AiNotConfiguredError) {
        res.status(503).json({
          ok: false,
          errorCode: err.code,
          ...localizedError(
            err.message,
            'बैकएंड पर AI कुंजी (GEMINI_API_KEY) सेट नहीं है।',
            parsed.data.language
          ),
        });
        return;
      }

      if (err instanceof AiAnalysisError) {
        const hiMsg =
          err.code === 'AI_TIMEOUT'
            ? 'AI विश्लेषण का समय समाप्त हो गया। कृपया थोड़ी देर बाद फिर से कोशिश करें।'
            : err.statusCode === 429
              ? 'AI सेवा की सीमा पूरी हो गई है। कृपया कुछ देर बाद प्रयास करें।'
              : 'AI विश्लेषण के दौरान त्रुटि हुई। कृपया अपनी API कुंजी या नेटवर्क जाँचकर दोबारा प्रयास करें।';
        res.status(err.statusCode).json({
          ok: false,
          errorCode: err.code,
          ...localizedError(err.message, hiMsg, parsed.data.language),
        });
        return;
      }

      res.status(500).json({
        ok: false,
        errorCode: 'INTERNAL_ERROR',
        ...localizedError(
          'Unexpected server error during message analysis.',
          'संदेश की जाँच के दौरान सर्वर में अचानक त्रुटि आ गई।',
          parsed.data.language
        ),
      });
    }
  });

  app.post('/api/analyze-url', async (req: Request, res: Response) => {
    const reqLang = pickLang(req.body);
    const parsed = AnalyzeUrlRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? 'Invalid URL input.';
      const hiIssue = firstIssue.includes('2048')
        ? 'URL बहुत लंबा है (अधिकतम 2048 अक्षर)।'
        : 'कृपया जाँच के लिए एक सही वेब लिंक (URL) दर्ज करें।';
      res.status(400).json({
        ok: false,
        errorCode: 'INVALID_URL',
        ...localizedError(firstIssue, hiIssue, reqLang),
      });
      return;
    }

    try {
      const result = await analyzeUrlSafely(
        parsed.data.url,
        urlReputationClient
      );
      res.json({
        ok: true,
        analyzedAt: new Date().toISOString(),
        heuristicOnly: !result.reputation.configured,
        result,
      });
    } catch (err) {
      if (err instanceof InvalidUrlError) {
        const hiMsg = err.message.includes('scheme')
          ? 'केवल http:// या https:// वाले वेब लिंक की ही जाँच की जा सकती है।'
          : err.message.includes('spaces')
            ? 'लिंक (URL) में खाली जगह (स्पेस) नहीं होनी चाहिए।'
            : 'कृपया एक सही वेब पता दर्ज करें (उदाहरण: https://example.com)।';
        res.status(400).json({
          ok: false,
          errorCode: err.code,
          ...localizedError(err.message, hiMsg, parsed.data.language),
        });
        return;
      }

      res.status(500).json({
        ok: false,
        errorCode: 'INTERNAL_ERROR',
        ...localizedError(
          'Unexpected server error during URL inspection.',
          'URL की जाँच के दौरान सर्वर में त्रुटि आ गई।',
          parsed.data.language
        ),
      });
    }
  });

  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({
      ok: false,
      errorCode: 'NOT_FOUND',
      error: 'API endpoint not found.',
    });
  });

  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const distDir = deps.staticDir ?? path.resolve(currentDir, '..', 'dist');
  const distIndex = path.join(distDir, 'index.html');
  const shouldServeStatic =
    (deps.serveStatic ?? true) && fs.existsSync(distIndex);

  if (shouldServeStatic) {
    app.use(express.static(distDir));
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET' || req.path.startsWith('/api')) {
        next();
        return;
      }
      res.sendFile(distIndex);
    });
  }

  return app;
}
