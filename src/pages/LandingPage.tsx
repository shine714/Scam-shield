import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Cpu,
  Globe,
  Languages,
  Link2,
  Lock,
  MessageSquareWarning,
  Radar,
  ScanSearch,
  ShieldCheck,
  ShieldOff,
  Sparkles,
} from 'lucide-react';
import type { Language, MessageChannel, PageRoute } from '../types';
import { t, translations } from '../i18n/translations';
import { ScamAwarenessSection } from '../components/ScamAwarenessSection';

interface LandingPageProps {
  lang: Language;
  onNavigate: (page: PageRoute) => void;
  onQuickAnalyzeMessage?: (text: string, channel: MessageChannel) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onNavigate,
  onQuickAnalyzeMessage,
}) => {
  const [quickMessage, setQuickMessage] = useState('');
  const [quickError, setQuickError] = useState<string | null>(null);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickMessage.trim();
    if (!trimmed) {
      setQuickError(t(translations.hero.quickBoxEmptyError, lang));
      return;
    }
    setQuickError(null);
    if (onQuickAnalyzeMessage) {
      onQuickAnalyzeMessage(trimmed, 'sms');
    } else {
      onNavigate('message-scanner');
    }
  };

  const stepIcons = [
    <ScanSearch key="s1" className="h-5 w-5 text-emerald-400" />,
    <Cpu key="s2" className="h-5 w-5 text-[#38BDF8]" />,
    <ShieldCheck key="s3" className="h-5 w-5 text-emerald-300" />,
  ];

  const trustIcons = [
    <Lock key="t1" className="h-5 w-5 text-emerald-400" />,
    <Sparkles key="t2" className="h-5 w-5 text-[#38BDF8]" />,
    <ShieldOff key="t3" className="h-5 w-5 text-emerald-300" />,
  ];

  return (
    <div>
      {/* 01 — HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-12 sm:pt-14 lg:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Hero Copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>{t(translations.hero.pill, lang)}</span>
              </div>

              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                {t(translations.hero.titleLead, lang)}{' '}
                <span className="block bg-gradient-to-r from-emerald-400 via-emerald-300 to-[#38BDF8] bg-clip-text text-transparent">
                  {t(translations.hero.titleHighlight, lang)}
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {t(translations.hero.subtitle, lang)}
              </p>

              {/* Hero CTAs */}
              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('message-scanner')}
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500"
                >
                  <MessageSquareWarning className="h-4 w-4" />
                  {t(translations.hero.ctaPrimary, lang)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('url-scanner')}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-400/35 bg-[#111827] px-5 py-3.5 text-sm font-semibold text-sky-200 transition hover:border-sky-300/60 hover:bg-sky-500/10"
                >
                  <Link2 className="h-4 w-4 text-[#38BDF8]" />
                  {t(translations.hero.ctaSecondary, lang)}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('awareness')}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:text-emerald-300"
                >
                  {t(translations.hero.ctaAwareness, lang)} →
                </button>
              </div>

              {/* Compact Security Capabilities Strip */}
              <div className="mt-7 flex flex-wrap items-center gap-2.5 border-t border-slate-800/80 pt-5">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#111827]/90 px-3 py-1.5 text-xs font-medium text-slate-300">
                  <ShieldOff className="h-3.5 w-3.5 text-emerald-400" />
                  {lang === 'en' ? 'Zero-Visit URL Check' : 'बिना लिंक खोले URL जाँच'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#111827]/90 px-3 py-1.5 text-xs font-medium text-slate-300">
                  <Lock className="h-3.5 w-3.5 text-[#38BDF8]" />
                  {lang === 'en' ? 'Server-Side AI Defense' : 'सुरक्षित बैकएंड AI'}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#111827]/90 px-3 py-1.5 text-xs font-medium text-slate-300">
                  <Languages className="h-3.5 w-3.5 text-emerald-300" />
                  {lang === 'en' ? 'Bilingual EN & हिन्दी' : 'अंग्रेज़ी और हिंदी सहायता'}
                </span>
              </div>
            </div>

            {/* Right Glowing AI Shield + Network Animation Visual */}
            <div className="lg:col-span-5">
              <div className="glass-panel animate-float-slow relative overflow-hidden rounded-3xl border border-emerald-500/25 p-6">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/12 to-transparent animate-scan-sweep" />

                {/* Top Header Chrome */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/35 bg-emerald-500/15 text-emerald-400">
                      <Radar className="h-4 w-4" />
                      <span className="absolute inset-0 rounded-lg border border-emerald-400/40 animate-pulse-ring" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {t(translations.hero.shieldTitle, lang)}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">
                        {t(translations.hero.shieldSubtitle, lang)}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    ACTIVE
                  </span>
                </div>

                {/* Central Glowing Shield & Network Orbit Illustration */}
                <div className="relative my-5 flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0B1220]/90">
                  {/* Ambient radial aura */}
                  <div className="pointer-events-none absolute h-40 w-40 rounded-full bg-emerald-500/15 blur-2xl" />
                  <div className="pointer-events-none absolute h-28 w-28 rounded-full bg-sky-400/15 blur-xl" />

                  {/* Rotating cyber network ring SVG */}
                  <svg
                    className="animate-spin-slow absolute h-48 w-48 text-emerald-500/30"
                    viewBox="0 0 200 200"
                    aria-hidden="true"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="84"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="4 6"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="62"
                      fill="none"
                      stroke="#38BDF8"
                      strokeOpacity="0.25"
                      strokeWidth="1"
                    />
                    <circle cx="100" cy="16" r="4" fill="#22C55E" />
                    <circle cx="184" cy="100" r="4" fill="#38BDF8" />
                    <circle cx="100" cy="184" r="4" fill="#22C55E" />
                    <circle cx="16" cy="100" r="4" fill="#38BDF8" />
                  </svg>

                  {/* Center Glowing Shield Core */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-400/50 bg-gradient-to-br from-emerald-600/30 via-[#111827] to-sky-500/20 shadow-[0_0_35px_rgba(22,163,74,0.35)]">
                      <ShieldCheck className="h-10 w-10 text-emerald-400" />
                      <span className="absolute inset-0 rounded-2xl border border-emerald-400/40 animate-pulse-ring" />
                    </div>
                  </div>
                </div>

                {/* Network Signal Nodes */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="rounded-xl border border-slate-800 bg-[#0B1220]/90 px-2.5 py-2.5">
                    <MessageSquareWarning className="mx-auto h-4 w-4 text-emerald-400" />
                    <p className="mt-1 text-[11px] font-semibold text-white">
                      {lang === 'en' ? 'SMS & Chat' : 'SMS और चैट'}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">AI NLP</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#0B1220]/90 px-2.5 py-2.5">
                    <Globe className="mx-auto h-4 w-4 text-[#38BDF8]" />
                    <p className="mt-1 text-[11px] font-semibold text-white">
                      {lang === 'en' ? 'URL Defense' : 'URL सुरक्षा'}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">Zero-Visit</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-[#0B1220]/90 px-2.5 py-2.5">
                    <Languages className="mx-auto h-4 w-4 text-emerald-300" />
                    <p className="mt-1 text-[11px] font-semibold text-white">
                      {lang === 'en' ? 'Bilingual' : 'द्विभाषी'}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">EN / HI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Hero Message Scanning Box (Routes cleanly to real backend AI scanner) */}
          <form
            onSubmit={handleQuickSubmit}
            className="glass-panel mt-10 rounded-3xl border border-emerald-500/25 p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="hero-quick-message-input"
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400"
              >
                <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
                {t(translations.hero.quickBoxLabel, lang)}
              </label>
              <span className="text-xs text-slate-400">
                {lang === 'en'
                  ? 'Live Gemini AI Evaluation'
                  : 'लाइव AI सुरक्षा जाँच'}
              </span>
            </div>

            <textarea
              id="hero-quick-message-input"
              rows={3}
              value={quickMessage}
              onChange={(e) => {
                setQuickMessage(e.target.value);
                setQuickError(null);
              }}
              placeholder={t(translations.hero.quickBoxPlaceholder, lang)}
              className="mt-3 w-full rounded-2xl border border-slate-700/80 bg-[#0B1220] p-4 text-sm text-slate-100 placeholder-slate-500 transition focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />

            {quickError && (
              <div
                role="alert"
                className="mt-2.5 flex items-center gap-2 text-xs text-rose-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{quickError}</span>
              </div>
            )}

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16A34A] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500"
            >
              <ScanSearch className="h-4 w-4" />
              {t(translations.hero.quickBoxButton, lang)}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 02 — QUICK SCAN CARDS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-medium text-emerald-300">
              {t(translations.quickScan.badge, lang)}
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              {t(translations.quickScan.title, lang)}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {translations.quickScan.cards.map((card, idx) => {
            const isMsg = idx === 0;
            return (
              <div
                key={card.route}
                className="glass-panel glass-panel-hover group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
                    isMsg ? 'via-emerald-400/50' : 'via-sky-400/50'
                  } to-transparent`}
                />
                <div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                      isMsg
                        ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                        : 'border-sky-400/30 bg-sky-500/15 text-[#38BDF8]'
                    }`}
                  >
                    {isMsg ? (
                      <MessageSquareWarning className="h-6 w-6" />
                    ) : (
                      <Link2 className="h-6 w-6" />
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-white">
                    {t(card.title, lang)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {t(card.desc, lang)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate(card.route)}
                  className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition ${
                    isMsg
                      ? 'text-emerald-400 hover:text-emerald-300'
                      : 'text-[#38BDF8] hover:text-sky-300'
                  }`}
                >
                  {t(card.cta, lang)}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 03 — HOW IT WORKS (Scan -> AI Analysis -> Protection) */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 font-mono text-xs font-medium text-[#38BDF8]">
              {t(translations.howItWorks.badge, lang)}
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              {t(translations.howItWorks.title, lang)}
            </h2>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              {t(translations.howItWorks.subtitle, lang)}
            </p>
          </div>

          <div className="relative mt-8 grid gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute top-11 right-16 left-16 hidden h-px bg-gradient-to-r from-emerald-500/40 via-[#38BDF8]/40 to-emerald-500/40 md:block" />

            {translations.howItWorks.steps.map((s, idx) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-slate-800/90 bg-[#0B1220] p-5 transition-colors hover:border-emerald-500/35"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-[#111827]">
                    {stepIcons[idx]}
                  </div>
                  <span className="rounded-md border border-slate-800 bg-[#111827] px-2 py-0.5 font-mono text-xs font-bold text-emerald-400">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">
                  {t(s.title, lang)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {t(s.desc, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — SCAM AWARENESS */}
      <ScamAwarenessSection
        lang={lang}
        compact
        onOpenFullPage={() => onNavigate('awareness')}
      />

      {/* 05 — TRUST SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl border border-emerald-500/20 p-6 sm:p-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-medium text-emerald-300">
              {t(translations.trustSection.badge, lang)}
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              {t(translations.trustSection.title, lang)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
              {t(translations.trustSection.subtitle, lang)}
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {translations.trustSection.items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-[#0B1220] p-5 transition-colors hover:border-emerald-500/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-[#111827]">
                  {trustIcons[idx]}
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-white">
                  {t(item.title, lang)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {t(item.desc, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
