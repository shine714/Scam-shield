import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../server/app.js';
import { AiAnalysisError } from '../server/aiService.js';
import type { AiMessageAnalysis } from '../server/schema.js';

async function withServer(
  app: ReturnType<typeof createApp>,
  fn: (baseUrl: string) => Promise<void>
) {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === 'object');
  const baseUrl = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(baseUrl);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

test('GET /api/health accurately reports unconfigured AI state', async () => {
  const app = createApp({
    checkAiConfigured: () => false,
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      ok: boolean;
      aiConfigured: boolean;
      model: string | null;
    };
    assert.equal(data.ok, true);
    assert.equal(data.aiConfigured, false);
    assert.equal(data.model, null);
  });
});

test('POST /api/analyze-message rejects empty input with 400', async () => {
  const app = createApp({
    checkAiConfigured: () => true,
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '   ', channel: 'sms', language: 'en' }),
    });
    assert.equal(res.status, 400);
    const data = (await res.json()) as { ok: boolean; errorCode: string };
    assert.equal(data.ok, false);
    assert.equal(data.errorCode, 'INVALID_INPUT');
  });
});

test('POST /api/analyze-message returns 503 AI_NOT_CONFIGURED instead of fake results when API key is missing', async () => {
  const app = createApp({
    checkAiConfigured: () => false,
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Your KYC is blocked, send OTP immediately',
        channel: 'sms',
        language: 'en',
      }),
    });
    assert.equal(res.status, 503);
    const data = (await res.json()) as { ok: boolean; errorCode: string };
    assert.equal(data.ok, false);
    assert.equal(data.errorCode, 'AI_NOT_CONFIGURED');
  });
});

test('POST /api/analyze-message returns structured AI assessment when backend analyzer succeeds', async () => {
  const sampleValidOutput: AiMessageAnalysis = {
    riskLevel: 'High',
    riskScore: 91,
    scamCategory: {
      en: 'Banking KYC Phishing',
      hi: 'बैंकिंग KYC फ़िशिंग',
    },
    explanation: {
      en: 'This message uses urgent account suspension threats and requests an OTP via a suspicious link.',
      hi: 'यह संदेश खाता बंद होने की धमकी देता है और संदिग्ध लिंक के ज़रिए OTP माँगता है।',
    },
    reasons: {
      en: ['Creates artificial urgency', 'Asks for OTP on an untrusted link'],
      hi: ['कृत्रिम जल्दबाज़ी पैदा करता है', 'अविश्वसनीय लिंक पर OTP माँगता है'],
    },
    patternIndicators: {
      urgency: true,
      fakeRewards: false,
      impersonation: true,
      otpRequest: true,
      suspiciousPayment: false,
      phishingIndicators: true,
    },
    redFlags: [
      {
        title: { en: 'OTP Harvesting Attempt', hi: 'OTP चोरी करने का प्रयास' },
        detail: {
          en: 'Legitimate banks never ask for OTP via third-party links.',
          hi: 'असली बैंक कभी भी बाहरी लिंक से OTP नहीं माँगते।',
        },
        severity: 'high',
      },
    ],
    flaggedPhrases: ['suspended in 2 hours', 'verify OTP'],
    safetyRecommendations: {
      en: ['Do not click the link or share your OTP.'],
      hi: ['लिंक पर क्लिक न करें और न ही अपना OTP साझा करें।'],
    },
  };

  const app = createApp({
    checkAiConfigured: () => true,
    analyzer: {
      async analyze() {
        return { analysis: sampleValidOutput, model: 'gemini-3.8-flash' };
      },
    },
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Your account will be suspended in 2 hours. Verify OTP now.',
        channel: 'sms',
        language: 'hi',
      }),
    });
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      ok: boolean;
      isRealAi: boolean;
      model: string;
      result: AiMessageAnalysis;
    };
    assert.equal(data.ok, true);
    assert.equal(data.isRealAi, true);
    assert.equal(data.model, 'gemini-3.8-flash');
    assert.equal(data.result.riskLevel, 'High');
    assert.equal(data.result.riskScore, 91);
    assert.equal(data.result.patternIndicators.otpRequest, true);
    assert.ok(data.result.explanation.hi.length > 0);
  });
});

test('POST /api/analyze-message returns 500 error state when unexpected error is thrown', async () => {
  const app = createApp({
    checkAiConfigured: () => true,
    analyzer: {
      async analyze() {
        throw new Error('Unexpected failure');
      },
    },
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Check this message please',
        channel: 'whatsapp',
        language: 'en',
      }),
    });
    assert.equal(res.status, 500);
    const data = (await res.json()) as { ok: boolean; errorCode: string };
    assert.equal(data.ok, false);
  });
});

test('POST /api/analyze-message returns 504 AI_TIMEOUT on model timeout', async () => {
  const app = createApp({
    checkAiConfigured: () => true,
    analyzer: {
      async analyze() {
        throw new AiAnalysisError(
          'AI analysis timed out before the model responded.',
          504
        );
      },
    },
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Urgent KYC update required immediately',
        channel: 'sms',
        language: 'en',
      }),
    });
    assert.equal(res.status, 504);
    const data = (await res.json()) as { ok: boolean; errorCode: string };
    assert.equal(data.ok, false);
    assert.equal(data.errorCode, 'AI_TIMEOUT');
  });
});

test('POST /api/analyze-message returns structured 400 INVALID_INPUT for malformed JSON', async () => {
  const app = createApp({
    checkAiConfigured: () => true,
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"message": "unclosed',
    });
    assert.equal(res.status, 400);
    const data = (await res.json()) as { ok: boolean; errorCode: string };
    assert.equal(data.ok, false);
    assert.equal(data.errorCode, 'INVALID_INPUT');
  });
});

test('API sets security headers and returns 413 JSON for oversized payloads', async () => {
  const app = createApp({
    checkAiConfigured: () => true,
  });

  await withServer(app, async (baseUrl) => {
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.equal(healthRes.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(healthRes.headers.get('x-frame-options'), 'DENY');
    assert.equal(healthRes.headers.get('x-powered-by'), null);

    const huge = 'a'.repeat(70_000);
    const largeRes = await fetch(`${baseUrl}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: huge, channel: 'sms', language: 'en' }),
    });
    assert.equal(largeRes.status, 413);
    const largeData = (await largeRes.json()) as { ok: boolean; errorCode: string };
    assert.equal(largeData.ok, false);
    assert.equal(largeData.errorCode, 'PAYLOAD_TOO_LARGE');
  });
});

