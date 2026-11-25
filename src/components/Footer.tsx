import React from 'react';
import { ShieldCheck, PhoneCall, Globe, Terminal } from 'lucide-react';
import type { Language, PageRoute } from '../types';
import { t, translations } from '../i18n/translations';

interface FooterProps {
  lang: Language;
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-cyan-500/15 bg-[#030711]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
              </div>
              <span className="font-display text-lg font-bold text-white">
                ScamShield <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              {t(translations.footer.desc, lang)}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-300">
              <Terminal className="h-3.5 w-3.5" />
              {t(translations.footer.statusLabel, lang)}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t(translations.footer.quickLinks, lang)}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {(
                [
                  ['home', translations.nav.home],
                  ['message-scanner', translations.nav.messageScanner],
                  ['url-scanner', translations.nav.urlScanner],
                  ['awareness', translations.nav.awareness],
                  ['about', translations.nav.about],
                ] as const
              ).map(([route, labelObj]) => (
                <li key={route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(route)}
                    className="text-slate-400 transition hover:text-cyan-300"
                  >
                    {t(labelObj, lang)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Cyber Helplines */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t(translations.footer.safetyResources, lang)}
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-[#081022] px-3 py-2.5">
                <PhoneCall className="h-4 w-4 shrink-0 text-cyan-400" />
                <span className="font-medium text-slate-200">
                  {t(translations.footer.helplineText, lang)}
                </span>
              </div>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-[#081022] px-3 py-2.5 transition hover:border-cyan-500/35 hover:text-cyan-300"
              >
                <Globe className="h-4 w-4 shrink-0 text-blue-400" />
                <span>{t(translations.footer.portalText, lang)}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-800/80 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>{t(translations.footer.copyright, lang)}</p>
          <p className="font-mono text-[11px] text-slate-500">
            {t(translations.footer.designTag, lang)}
          </p>
        </div>
      </div>
    </footer>
  );
};

