import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createApp } from '../server/app.js';

test('Production server serves dist/index.html for SPA routes and 404 JSON for unknown /api routes', async () => {
  const distIndex = path.resolve(process.cwd(), 'dist', 'index.html');
  assert.ok(
    fs.existsSync(distIndex),
    'dist/index.html must exist (run npm run build first)'
  );

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
    const rootRes = await fetch(`${baseUrl}/`);
    assert.equal(rootRes.status, 200);
    const html = await rootRes.text();
    assert.ok(html.includes('<div id="root">'));

    const apiMissingRes = await fetch(`${baseUrl}/api/does-not-exist`);
    assert.equal(apiMissingRes.status, 404);
    const apiMissingJson = (await apiMissingRes.json()) as {
      ok: boolean;
      errorCode: string;
    };
    assert.equal(apiMissingJson.ok, false);
    assert.equal(apiMissingJson.errorCode, 'NOT_FOUND');
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

