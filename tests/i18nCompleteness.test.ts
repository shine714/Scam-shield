import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { translations } from '../src/i18n/translations.js';
import {
  sampleMessageFillers,
  sampleUrlFillers,
  scamAwarenessCategories,
} from '../src/data/demoData.js';
import { createApp } from '../server/app.js';

function assertAllBilingualEntriesPresent(
  node: unknown,
  path: string[] = []
): void {
  if (Array.isArray(node)) {
    node.forEach((item, idx) =>
      assertAllBilingualEntriesPresent(item, [...path, String(idx)])
    );
    return;
  }

  if (node && typeof node === 'object') {
    const record = node as Record<string, unknown>;
    if ('en' in record && 'hi' in record) {
      const enVal = record.en;
      const hiVal = record.hi;
      assert.equal(
        typeof enVal,
        'string',
        `Expected string en at ${path.join('.')}`
      );
      assert.equal(
        typeof hiVal,
        'string',
        `Expected string hi at ${path.join('.')}`
      );
      assert.ok(
        (enVal as string).trim().length > 0,
        `Empty English string at ${path.join('.')}`
      );
      assert.ok(
        (hiVal as string).trim().length > 0,
        `Empty Hindi string at ${path.join('.')}`
      );
      return;
    }

    for (const [key, value] of Object.entries(record)) {
      assertAllBilingualEntriesPresent(value, [...path, key]);
    }
  }
}

test('Every translation entry and all 8 awareness modules have both English and Hindi strings', () => {
  assertAllBilingualEntriesPresent(translations, ['translations']);
  assertAllBilingualEntriesPresent(sampleMessageFillers, ['sampleMessageFillers']);
  assertAllBilingualEntriesPresent(sampleUrlFillers, ['sampleUrlFillers']);

  const expectedIds = [
    'otp',
    'upi',
    'fake-jobs',
    'lottery',
    'phishing-emails',
    'fake-support',
    'suspicious-links',
    'social-engineering',
  ];
  assert.deepEqual(
    scamAwarenessCategories.map((c) => c.id),
    expectedIds
  );

  for (const cat of scamAwarenessCategories) {
    assert.ok(cat.title.en.trim() && cat.title.hi.trim());
    assert.ok(cat.badge.en.trim() && cat.badge.hi.trim());
    assert.ok(cat.summary.en.trim() && cat.summary.hi.trim());
    assert.ok(cat.exampleLure.en.trim() && cat.exampleLure.hi.trim());
    assert.ok(cat.warningSigns.en.length >= 3);
    assert.equal(cat.warningSigns.en.length, cat.warningSigns.hi.length);
    assert.ok(cat.preventionTips.en.length >= 3);
    assert.equal(cat.preventionTips.en.length, cat.preventionTips.hi.length);
  }
});

test('Backend API returns localized Hindi error messages when language is hi', async () => {
  const app = createApp({
    checkAiConfigured: () => false,
    checkUrlReputationConfigured: () => false,
  });

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const addr = server.address();
  assert.ok(addr && typeof addr === 'object');
  const baseUrl = `http://127.0.0.1:${addr.port}`;

  try {
    // 1. Unconfigured AI error in Hindi
    const msgRes = await fetch(`${baseUrl}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'आपका KYC बंद होने वाला है',
        channel: 'sms',
        language: 'hi',
      }),
    });
    assert.equal(msgRes.status, 503);
    const msgData = (await msgRes.json()) as {
      error: string;
      errorLocalized?: { en: string; hi: string };
    };
    assert.match(msgData.error, /[\u0900-\u097F]/);
    assert.ok(msgData.errorLocalized?.en && msgData.errorLocalized?.hi);

    // 2. Empty message validation error in Hindi
    const emptyRes = await fetch(`${baseUrl}/api/analyze-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '', channel: 'sms', language: 'hi' }),
    });
    assert.equal(emptyRes.status, 400);
    const emptyData = (await emptyRes.json()) as {
      error: string;
      errorLocalized?: { en: string; hi: string };
    };
    assert.match(emptyData.error, /[\u0900-\u097F]/);

    // 3. Invalid URL error in Hindi
    const urlRes = await fetch(`${baseUrl}/api/analyze-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'javascript:alert(1)', language: 'hi' }),
    });
    assert.equal(urlRes.status, 400);
    const urlData = (await urlRes.json()) as {
      error: string;
      errorLocalized?: { en: string; hi: string };
    };
    assert.match(urlData.error, /[\u0900-\u097F]/);
    assert.ok(urlData.errorLocalized?.en && urlData.errorLocalized?.hi);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
