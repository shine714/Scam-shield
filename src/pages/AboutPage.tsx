import React from 'react';
import {
  CheckCircle2,
  Cpu,
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
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-xs font-medium text-emerald-300">
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-white">
            {t(translations.about.missionTitle, lang)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            {t(translations.about.missionBody, lang)}
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/10">
            <Lock className="h-6 w-6 text-[#38BDF8]" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold text-white">
            {t(translations.about.privacyTitle, lang)}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            {t(translations.about.privacyBody, lang)}
          </p>
        </div>
      </div>

      {/* Platform Capabilities & Protection Layers */}
      <div className="mt-10">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {t(translations.about.roadmapTitle, lang)}
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#0B1220] px-4 py-3 text-sm text-slate-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{t(item, lang)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel rounded-2xl border-sky-400/25 p-6 sm:p-8">
            <div className="flex items-center gap-2.5">
              <Cpu className="h-5 w-5 text-[#38BDF8]" />
              <h3 className="font-display text-xl font-bold text-white">
                {t(translations.about.phase2Title, lang)}
              </h3>
            </div>
            <ul className="mt-5 space-y-3">
              {translations.about.phase2Items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#0B1220] px-4 py-3 text-sm text-slate-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" />
                  <span>{t(item, lang)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-[#111827] via-emerald-950/35 to-[#111827] p-6">
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
            className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            {t(translations.nav.messageScanner, lang)}
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('url-scanner')}
            className="inline-flex items-center gap-2 rounded-xl border border-sky-400/35 bg-[#111827] px-4 py-2.5 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/15"
          >
            {t(translations.nav.urlScanner, lang)}
          </button>
        </div>
      </div>
    </div>
  );
};
