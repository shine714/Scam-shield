import React from 'react';
import {
  CheckCircle2,
  Clock,
  Layers,
  Lock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import type { Language, PageRoute } from '../types';
import { t, translations } from '../i18n/translations';

interface AboutPageProps {
  lang: Language;
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang, onNavigate }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 font-mono text-xs font-medium text-cyan-300">
          <Layers className="h-3.5 w-3.5" />
          {t(translations.about.badge, lang)}
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          {t(translations.about.title, lang)}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
          {t(translations.about.subtitle, lang)}
        </p>
      </div>

      {/* Mission + Privacy */}
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10">
            <ShieldCheck className="h-6 w-6 text-cyan-300" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-white">
            {t(translations.about.missionTitle, lang)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            {t(translations.about.missionBody, lang)}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10">
            <Lock className="h-6 w-6 text-blue-300" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-white">
            {t(translations.about.privacyTitle, lang)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            {t(translations.about.privacyBody, lang)}
          </p>
        </div>
      </div>

      {/* Phase 1 vs Phase 2 Roadmap */}
      <div className="mt-10">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {t(translations.about.roadmapTitle, lang)}
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Phase 1 */}
          <div className="glass-panel rounded-2xl border-emerald-500/25 p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <h3 className="font-display text-xl font-bold text-white">
                {t(translations.about.phase1Title, lang)}
              </h3>
            </div>
            <ul className="mt-5 space-y-3">
              {translations.about.phase1Items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#060D1E] px-4 py-3 text-sm text-slate-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{t(item, lang)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="glass-panel rounded-2xl border-cyan-500/20 p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-cyan-400" />
              <h3 className="font-display text-xl font-bold text-white">
                {t(translations.about.phase2Title, lang)}
              </h3>
            </div>
            <ul className="mt-5 space-y-3">
              {translations.about.phase2Items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#060D1E] px-4 py-3 text-sm text-slate-300"
                >
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <span>{t(item, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-blue-950/70 to-cyan-950/40 p-6">
        <div>
          <h3 className="font-display text-lg font-bold text-white">
            {t(translations.about.ctaTitle, lang)}
          </h3>
          <p className="mt-1 text-sm text-slate-300">
            {t(translations.about.ctaDesc, lang)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('message-scanner')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {t(translations.nav.messageScanner, lang)}
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('url-scanner')}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/35 bg-[#0A1530] px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/15"
          >
            {t(translations.nav.urlScanner, lang)}
          </button>
        </div>
      </div>
    </div>
  );
};

