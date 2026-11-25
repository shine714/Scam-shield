import React from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Cpu,
  Link2,
  MessageSquareWarning,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { Language, PageRoute } from '../types';
import { t, translations } from '../i18n/translations';
import { ScamAwarenessSection } from '../components/ScamAwarenessSection';

interface LandingPageProps {
  lang: Language;
  onNavigate: (page: PageRoute) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onNavigate,
}) => {
  const featureIcons = [
    <MessageSquareWarning key="msg" className="h-6 w-6 text-cyan-300" />,
    <Link2 key="url" className="h-6 w-6 text-blue-300" />,
    <BookOpenCheck key="aware" className="h-6 w-6 text-cyan-300" />,
  ];

  const stepIcons = [
    <MessageSquareWarning key="s1" className="h-5 w-5 text-cyan-300" />,
    <Cpu key="s2" className="h-5 w-5 text-blue-300" />,
    <ShieldCheck key="s3" className="h-5 w-5 text-emerald-300" />,
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Hero Copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-medium text-cyan-200 shadow-sm shadow-cyan-500/10">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                <span>{t(translations.hero.pill, lang)}</span>
              </div>

              <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t(translations.hero.titleLead, lang)}{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                  {t(translations.hero.titleHighlight, lang)}
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {t(translations.hero.subtitle, lang)}
              </p>

              {/* Hero CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('message-scanner')}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.01] hover:brightness-110"
                >
                  <MessageSquareWarning className="h-4 w-4" />
                  {t(translations.hero.ctaPrimary, lang)}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('url-scanner')}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/35 bg-[#0A1530] px-5 py-3.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-500/15"
                >
                  <Link2 className="h-4 w-4 text-cyan-300" />
                  {t(translations.hero.ctaSecondary, lang)}
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('awareness')}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:text-cyan-300"
                >
                  {t(translations.hero.ctaAwareness, lang)} →
                </button>
              </div>
            </div>

            {/* Right Interactive Telemetry Preview Card */}
            <div className="lg:col-span-5">
              <div className="glass-panel animate-float-slow relative overflow-hidden rounded-3xl p-6">
                {/* Subtle animated scanner sweep */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-cyan-400/10 to-transparent animate-scan-sweep" />

                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                      <Radar className="h-5 w-5" />
                      <span className="absolute inset-0 rounded-xl border border-cyan-400/40 animate-pulse-ring" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {t(translations.hero.previewCardTitle, lang)}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">
                        {t(translations.brand.phaseBadge, lang)}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-amber-400/35 bg-amber-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-amber-300">
                    {t(translations.hero.previewDemoTag, lang)}
                  </span>
                </div>

                {/* Sample SMS Snippet */}
                <div className="mt-4 rounded-2xl border border-slate-800 bg-[#050B18] p-4">
                  <p className="font-mono text-xs leading-relaxed text-slate-300">
                    {t(translations.hero.previewMessageSnippet, lang)}
                  </p>
                </div>

                {/* Sample Telemetry Bars */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-200">
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-rose-400" />
                      {t(translations.hero.previewSignal1, lang)}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-rose-300">
                      {t(translations.hero.previewTagHigh, lang)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-200">
                    <span className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-rose-400" />
                      {t(translations.hero.previewSignal2, lang)}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-rose-300">
                      .TOP
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-amber-500/25 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-200">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-amber-400" />
                      {t(translations.hero.previewSignal3, lang)}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-amber-300">
                      {t(translations.hero.previewTagSample, lang)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4 text-xs">
                  <span className="text-slate-400">
                    {lang === 'en'
                      ? 'Sample Risk Score: 92/100'
                      : 'सैंपल रिस्क स्कोर: 92/100'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('message-scanner')}
                    className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    {t(translations.nav.launchScanner, lang)} →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Capability Metrics Bar */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {translations.stats.items.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel glass-panel-hover rounded-2xl p-5"
              >
                <div className="font-display text-2xl font-extrabold text-cyan-300">
                  {t(item.value, lang)}
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {t(item.label, lang)}
                </div>
                <div className="mt-0.5 text-xs text-slate-400">
                  {t(item.sub, lang)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Modules Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 font-mono text-xs font-medium text-blue-300">
            {t(translations.features.badge, lang)}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            {t(translations.features.title, lang)}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {translations.features.cards.map((card, idx) => (
            <div
              key={card.route}
              className="glass-panel glass-panel-hover flex flex-col justify-between rounded-2xl p-6"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-blue-600/20 to-cyan-500/15">
                  {featureIcons[idx]}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">
                  {t(card.title, lang)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-300">
                  {t(card.desc, lang)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(card.route)}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                {t(card.cta, lang)}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works 3-Step Pipeline */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-medium text-cyan-300">
              {t(translations.howItWorks.badge, lang)}
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              {t(translations.howItWorks.title, lang)}
            </h2>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              {t(translations.howItWorks.subtitle, lang)}
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {translations.howItWorks.steps.map((s, idx) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-slate-800 bg-[#060D1E] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-[#0B1733]">
                    {stepIcons[idx]}
                  </div>
                  <span className="font-mono text-sm font-bold text-cyan-400/70">
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

      {/* Embedded Scam Awareness Section */}
      <ScamAwarenessSection
        lang={lang}
        compact
        onOpenFullPage={() => onNavigate('awareness')}
      />
    </div>
  );
};

