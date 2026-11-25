import React, { useState } from 'react';
import {
  ShieldCheck,
  Menu,
  X,
  Languages,
  Home,
  MessageSquareWarning,
  Link2,
  BookOpenCheck,
  Info,
} from 'lucide-react';
import type { Language, PageRoute } from '../types';
import { t, translations } from '../i18n/translations';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  lang: Language;
  onToggleLang: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  lang,
  onToggleLang,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: {
    id: PageRoute;
    label: string;
    icon: React.ReactNode;
  }[] = [
      {
        id: 'home',
        label: t(translations.nav.home, lang),
        icon: <Home className="h-4 w-4" />,
      },
      {
        id: 'message-scanner',
        label: t(translations.nav.messageScanner, lang),
        icon: <MessageSquareWarning className="h-4 w-4" />,
      },
      {
        id: 'url-scanner',
        label: t(translations.nav.urlScanner, lang),
        icon: <Link2 className="h-4 w-4" />,
      },
      {
        id: 'awareness',
        label: t(translations.nav.awareness, lang),
        icon: <BookOpenCheck className="h-4 w-4" />,
      },
      {
        id: 'about',
        label: t(translations.nav.about, lang),
        icon: <Info className="h-4 w-4" />,
      },
    ];

  const handleNav = (page: PageRoute) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/15 bg-[#040914]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-blue-600/30 to-cyan-500/20 shadow-lg shadow-cyan-500/10 transition-transform duration-200 group-hover:scale-105">
            <ShieldCheck className="h-5 w-5 text-cyan-300" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-[#040914]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-white">
                ScamShield <span className="text-cyan-400">AI</span>
              </span>
              <span className="hidden rounded-full border border-cyan-400/25 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-cyan-300 xl:inline-block">
                {lang === 'en' ? 'AI Defense' : 'AI सुरक्षा'}
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-400 sm:block">
              {t(translations.brand.tagline, lang)}
            </p>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={t(translations.nav.primaryAria, lang)}
        >
          {navItems.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${active
                    ? 'border border-cyan-400/30 bg-cyan-500/15 text-cyan-200 shadow-sm shadow-cyan-500/10'
                    : 'border border-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
              >
                <span className={active ? 'text-cyan-300' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Language Toggle + CTA + Mobile Menu */}
        <div className="flex items-center gap-2.5">
          {/* Bilingual EN / HI Toggle */}
          <div
            className="flex items-center rounded-xl border border-slate-700/80 bg-[#0A1328] p-1"
            role="group"
            aria-label={t(translations.nav.languageAria, lang)}
          >
            <Languages className="ml-1.5 mr-1 hidden h-3.5 w-3.5 text-cyan-400 sm:block" />
            <button
              type="button"
              onClick={() => onToggleLang('en')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${lang === 'en'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onToggleLang('hi')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${lang === 'hi'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              हिन्दी
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleNav('message-scanner')}
            className="hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 transition hover:brightness-110 sm:inline-flex"
          >
            {t(translations.nav.launchScanner, lang)}
          </button>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/80 bg-[#0A1328] text-slate-200 hover:border-cyan-400/40 lg:hidden"
            aria-label={t(translations.nav.menuAria, lang)}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="border-t border-cyan-500/15 bg-[#060E20]/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition ${active
                      ? 'border border-cyan-400/30 bg-cyan-500/15 text-cyan-200'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                >
                  <span className={active ? 'text-cyan-300' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

