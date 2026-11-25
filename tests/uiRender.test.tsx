import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Navbar } from '../src/components/Navbar.js';
import { Footer } from '../src/components/Footer.js';
import { RiskGauge } from '../src/components/RiskGauge.js';
import { ScamAwarenessSection } from '../src/components/ScamAwarenessSection.js';
import { LandingPage } from '../src/pages/LandingPage.js';
import { MessageScannerPage } from '../src/pages/MessageScannerPage.js';
import { UrlScannerPage } from '../src/pages/UrlScannerPage.js';
import { AboutPage } from '../src/pages/AboutPage.js';

const noopNav = () => {};
const noopLang = () => {};

test('All ScamShield AI pages and components render cleanly in English and Hindi', () => {
  for (const lang of ['en', 'hi'] as const) {
    const navHtml = renderToStaticMarkup(
      React.createElement(Navbar, {
        currentPage: 'home',
        onNavigate: noopNav,
        lang,
        onToggleLang: noopLang,
      })
    );
    assert.ok(navHtml.includes('ScamShield'));
    assert.ok(navHtml.includes('हिन्दी'));

    const footerHtml = renderToStaticMarkup(
      React.createElement(Footer, { lang, onNavigate: noopNav })
    );
    assert.ok(footerHtml.includes('1930'));
    assert.ok(footerHtml.includes('rel="noopener noreferrer"'));

    const landingHtml = renderToStaticMarkup(
      React.createElement(LandingPage, { lang, onNavigate: noopNav })
    );
    assert.ok(landingHtml.length > 500);

    const msgHtml = renderToStaticMarkup(
      React.createElement(MessageScannerPage, { lang })
    );
    assert.ok(msgHtml.includes('message-scanner-input'));

    const urlHtml = renderToStaticMarkup(
      React.createElement(UrlScannerPage, { lang })
    );
    assert.ok(urlHtml.includes('url-scanner-input'));

    const awareHtml = renderToStaticMarkup(
      React.createElement(ScamAwarenessSection, { lang })
    );
    assert.ok(awareHtml.includes('1930'));

    const aboutHtml = renderToStaticMarkup(
      React.createElement(AboutPage, { lang, onNavigate: noopNav })
    );
    assert.ok(aboutHtml.length > 500);

    const gaugeHtml = renderToStaticMarkup(
      React.createElement(RiskGauge, {
        score: 85,
        riskLevel: 'High',
        lang,
        label: 'Risk',
      })
    );
    assert.ok(gaugeHtml.includes('85'));
  }
});

