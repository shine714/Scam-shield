import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from '../server/app.js';
import type { UrlAnalysisResult } from '../server/urlSchema.js';

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

test('POST /api/analyze-url rejects empty and dangerous schemes like javascript:', async () => {
  const app = createApp({
    checkUrlReputationConfigured: () => false,
  });

  await withServer(app, async (baseUrl) => {
    const emptyRes = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: '   ', language: 'en' }),
    });
    assert.equal(emptyRes.status, 400);

    const jsRes = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'javascript:alert(1)', language: 'en' }),
    });
    assert.equal(jsRes.status, 400);
    const jsData = (await jsRes.json()) as { ok: boolean; errorCode: string };
    assert.equal(jsData.ok, false);
    assert.equal(jsData.errorCode, 'INVALID_URL');
  });
});

test('POST /api/analyze-url detects IP-based host, non-standard port, HTTP, and .apk payload', async () => {
  const app = createApp({
    checkUrlReputationConfigured: () => false,
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'http://192.168.45.12:8080/netbanking/update.apk',
        language: 'en',
      }),
    });
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      ok: boolean;
      heuristicOnly: boolean;
      result: UrlAnalysisResult;
    };
    assert.equal(data.ok, true);
    assert.equal(data.heuristicOnly, true);
    assert.equal(data.result.riskLevel, 'High');
    assert.ok(data.result.riskScore >= 70);
    assert.equal(data.result.facts.isIpAddress, true);
    const ids = data.result.indicators.map((i) => i.id);
    assert.ok(ids.includes('ip-host'));
    assert.ok(ids.includes('non-standard-port'));
    assert.ok(ids.includes('dangerous-extension'));
    assert.ok(ids.includes('insecure-http'));
  });
});

test('POST /api/analyze-url detects lookalike brand domain, high-risk TLD, and embedded @ trick', async () => {
  const app = createApp({
    checkUrlReputationConfigured: () => false,
  });

  await withServer(app, async (baseUrl) => {
    const res1 = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'http://sbi-kyc-update-verify.top/login?otp=verify',
        language: 'en',
      }),
    });
    assert.equal(res1.status, 200);
    const d1 = (await res1.json()) as { result: UrlAnalysisResult };
    assert.equal(d1.result.riskLevel, 'High');
    const ids1 = d1.result.indicators.map((i) => i.id);
    assert.ok(ids1.includes('brand-lure-domain'));
    assert.ok(ids1.includes('high-risk-tld'));

    const res2 = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://sbi.com@a.b.c.example.xn--p1ai/verify',
        language: 'en',
      }),
    });
    assert.equal(res2.status, 200);
    const d2 = (await res2.json()) as { result: UrlAnalysisResult };
    assert.equal(d2.result.riskLevel, 'High');
    assert.equal(d2.result.facts.hasEmbeddedCredentials, true);
    assert.equal(d2.result.facts.hasPunycodeOrIdn, true);
    assert.ok(d2.result.facts.subdomainCount >= 3);
  });
});

test('POST /api/analyze-url distinguishes heuristic-only Low result and never guarantees safety', async () => {
  const app = createApp({
    checkUrlReputationConfigured: () => false,
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://www.npci.org.in',
        language: 'en',
      }),
    });
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      ok: boolean;
      heuristicOnly: boolean;
      result: UrlAnalysisResult;
    };
    assert.equal(data.ok, true);
    assert.equal(data.heuristicOnly, true);
    assert.equal(data.result.riskLevel, 'Low');
    assert.equal(data.result.reputation.status, 'not_configured');
    assert.match(data.result.verdictTitle.en, /Not Guaranteed Safe/i);
    assert.match(data.result.explanation.en, /does not prove/i);
  });
});

test('POST /api/analyze-url avoids brand false positives on substrings (e.g., jupiter, orbit) and rejects backslashes', async () => {
  const app = createApp({
    checkUrlReputationConfigured: () => false,
  });

  await withServer(app, async (baseUrl) => {
    const cleanRes = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://orbit-news.example.com/articles',
        language: 'en',
      }),
    });
    assert.equal(cleanRes.status, 200);
    const cleanData = (await cleanRes.json()) as { result: UrlAnalysisResult };
    assert.equal(cleanData.result.riskLevel, 'Low');
    assert.ok(
      !cleanData.result.indicators.some((i) => i.id === 'brand-lure-domain')
    );

    const slashRes = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://trusted.com\\@evil.top',
        language: 'en',
      }),
    });
    assert.equal(slashRes.status, 400);
    const slashData = (await slashRes.json()) as {
      ok: boolean;
      errorCode: string;
    };
    assert.equal(slashData.ok, false);
    assert.equal(slashData.errorCode, 'INVALID_URL');
  });
});

test('POST /api/analyze-url integrates configured external reputation match without visiting target URL', async () => {
  const app = createApp({
    checkUrlReputationConfigured: () => true,
    urlReputationClient: {
      async checkUrl(normalizedUrl) {
        return {
          provider: 'Google Safe Browsing v4',
          configured: true,
          status: 'threat_found',
          threatTypes: ['SOCIAL_ENGINEERING'],
          summary: {
            en: `External reputation match found for ${normalizedUrl}: SOCIAL_ENGINEERING.`,
            hi: 'बाहरी थ्रेट डेटाबेस में चेतावनी मिली।',
          },
        };
      },
    },
  });

  await withServer(app, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://clean-looking-domain.example/portal',
        language: 'en',
      }),
    });
    assert.equal(res.status, 200);
    const data = (await res.json()) as {
      ok: boolean;
      heuristicOnly: boolean;
      result: UrlAnalysisResult;
    };
    assert.equal(data.ok, true);
    assert.equal(data.heuristicOnly, false);
    assert.equal(data.result.riskLevel, 'High');
    assert.ok(data.result.riskScore >= 90);
    assert.equal(data.result.reputation.status, 'threat_found');
    assert.ok(data.result.indicators.some((i) => i.id === 'reputation-match'));
  });
});

test('POST /api/analyze-url avoids short-brand false positives on domains like jupiter-money.com and rejects backslashes', async () => {
  const app = createApp({
    checkUrlReputationConfigured: () => false,
  });

  await withServer(app, async (baseUrl) => {
    const cleanRes = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://jupiter-money.example.com',
        language: 'en',
      }),
    });
    assert.equal(cleanRes.status, 200);
    const cleanData = (await cleanRes.json()) as { result: UrlAnalysisResult };
    assert.equal(
      cleanData.result.indicators.some(
        (i) => i.id === 'brand-lure-domain' || i.id === 'brand-subdomain-spoof'
      ),
      false
    );

    const slashRes = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'http://trusted.com\\@evil.top',
        language: 'en',
      }),
    });
    assert.equal(slashRes.status, 400);
  });
});
