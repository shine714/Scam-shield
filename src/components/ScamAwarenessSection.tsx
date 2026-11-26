import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Briefcase,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Gift,
  Headset,
  KeyRound,
  Link2,
  MailWarning,
  MessageSquareQuote,
  PhoneCall,
  Search,
  ShieldAlert,
  ShieldCheck,
  Square,
  UserX,
} from 'lucide-react';
import type { Language } from '../types';
import { t, translations } from '../i18n/translations';
import {
  scamAwarenessCategories,
  type ScamGroup,
} from '../data/demoData';

interface ScamAwarenessSectionProps {
  lang: Language;
  compact?: boolean;
  onOpenFullPage?: () => void;
}

export const ScamAwarenessSection: React.FC<ScamAwarenessSectionProps> = ({
  lang,
  compact = false,
  onOpenFullPage,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    scamAwarenessCategories[0].id
  );
  const [expandedIds, setExpandedIds] = useState<string[]>([
    scamAwarenessCategories[0].id,
    scamAwarenessCategories[1].id,
  ]);
  const [visibleExamples, setVisibleExamples] = useState<string[]>([]);
  const [groupFilter, setGroupFilter] = useState<'all' | ScamGroup>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExample = (id: string) => {
    setVisibleExamples((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    otp: <KeyRound className="h-4 w-4" />,
    upi: <CreditCard className="h-4 w-4" />,
    'fake-jobs': <Briefcase className="h-4 w-4" />,
    lottery: <Gift className="h-4 w-4" />,
    'phishing-emails': <MailWarning className="h-4 w-4" />,
    'fake-support': <Headset className="h-4 w-4" />,
    'suspicious-links': <Link2 className="h-4 w-4" />,
    'social-engineering': <UserX className="h-4 w-4" />,
  };

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scamAwarenessCategories.filter((cat) => {
      if (groupFilter !== 'all' && cat.group !== groupFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        cat.title.en,
        cat.title.hi,
        cat.badge.en,
        cat.badge.hi,
        cat.summary.en,
        cat.summary.hi,
        ...cat.warningSigns.en,
        ...cat.warningSigns.hi,
        ...cat.preventionTips.en,
        ...cat.preventionTips.hi,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [groupFilter, searchQuery]);

  const activeCategory =
    scamAwarenessCategories.find((c) => c.id === activeCategoryId) ??
    scamAwarenessCategories[0];

  const allFilteredExpanded =
    filteredCategories.length > 0 &&
    filteredCategories.every((c) => expandedIds.includes(c.id));

  const handleToggleAll = () => {
    if (allFilteredExpanded) {
      setExpandedIds([]);
    } else {
      setExpandedIds(filteredCategories.map((c) => c.id));
    }
  };

  const checkedCount = checkedIds.length;

  const filterPills: { id: 'all' | ScamGroup; label: string }[] = [
    {
      id: 'all',
      label: `${t(translations.awareness.filterAll, lang)} (${scamAwarenessCategories.length})`,
    },
    {
      id: 'financial',
      label: t(translations.awareness.filterFinancial, lang),
    },
    {
      id: 'links',
      label: t(translations.awareness.filterLinks, lang),
    },
    {
      id: 'impersonation',
      label: t(translations.awareness.filterImpersonation, lang),
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-medium text-emerald-300">
            <AlertTriangle className="h-3.5 w-3.5" />
            {t(translations.awareness.badge, lang)}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t(translations.awareness.title, lang)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {t(translations.awareness.subtitle, lang)}
          </p>
        </div>

        {compact && onOpenFullPage && (
          <button
            type="button"
            onClick={onOpenFullPage}
            className="self-start rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20 md:self-auto"
          >
            {t(translations.hero.ctaAwareness, lang)} →
          </button>
        )}
      </div>

      {/* FULL PAGE MODE: Search, Filter & 8 Interactive Expandable Cards */}
      {!compact && (
        <div className="mt-8 space-y-6">
          {/* Controls Bar */}
          <div className="glass-panel flex flex-col gap-4 rounded-2xl p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Group Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {filterPills.map((pill) => {
                const active = groupFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setGroupFilter(pill.id)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'border-emerald-500/50 bg-[#16A34A] text-white'
                        : 'border-slate-700/80 bg-[#0B1220] text-slate-300 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Search & Expand/Collapse All */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <div className="relative sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t(translations.awareness.searchPlaceholder, lang)}
                  className="w-full rounded-xl border border-slate-700/80 bg-[#0B1220] py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500/60 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleToggleAll}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-[#0B1220] px-3.5 py-2 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/40"
              >
                {allFilteredExpanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    {t(translations.awareness.collapseAll, lang)}
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    {t(translations.awareness.expandAll, lang)}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 8 Interactive Expandable Cards Grid */}
          {filteredCategories.length === 0 ? (
            <div className="glass-panel rounded-2xl p-10 text-center">
              <p className="text-sm text-slate-300">
                {t(translations.awareness.noSearchMatches, lang)}
              </p>
              <button
                type="button"
                onClick={() => {
                  setGroupFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 rounded-xl border border-emerald-500/35 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/25"
              >
                {t(translations.awareness.clearFilter, lang)}
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredCategories.map((cat) => {
                const isExpanded = expandedIds.includes(cat.id);
                const showExample = visibleExamples.includes(cat.id);
                return (
                  <div
                    key={cat.id}
                    className={`glass-panel rounded-2xl transition-colors ${
                      isExpanded ? 'border-emerald-500/40' : ''
                    }`}
                  >
                    {/* Card Header Toggle */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(cat.id)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-start justify-between gap-4 p-5 text-left"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
                          {categoryIcons[cat.id] ?? (
                            <ShieldAlert className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-white">
                              {t(cat.title, lang)}
                            </h3>
                            <span className="rounded-full border border-sky-400/30 bg-sky-500/15 px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#38BDF8]">
                              {t(cat.badge, lang)}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                            {t(cat.summary, lang)}
                          </p>
                        </div>
                      </div>

                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700/80 bg-[#0B1220] text-slate-300">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                    </button>

                    {/* Expandable Body */}
                    {isExpanded && (
                      <div className="space-y-4 border-t border-slate-800/90 px-5 pb-5 pt-4">
                        {/* Warning Signs */}
                        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
                          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
                            <ShieldAlert className="h-4 w-4" />
                            {t(translations.awareness.warningSignsHeading, lang)}
                          </h4>
                          <ul className="mt-2.5 space-y-2">
                            {cat.warningSigns[lang].map((sign, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-200"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                                <span>{sign}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Prevention Tips */}
                        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4">
                          <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                            <ShieldCheck className="h-4 w-4" />
                            {t(translations.awareness.preventionTipsHeading, lang)}
                          </h4>
                          <ul className="mt-2.5 space-y-2">
                            {cat.preventionTips[lang].map((tip, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-200"
                              >
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Interactive Example Lure Toggle */}
                        <div>
                          <button
                            type="button"
                            onClick={() => toggleExample(cat.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8] transition hover:text-sky-300"
                          >
                            <MessageSquareQuote className="h-3.5 w-3.5" />
                            {showExample
                              ? t(translations.awareness.hideExample, lang)
                              : t(translations.awareness.showExample, lang)}
                          </button>

                          {showExample && (
                            <div className="mt-2 rounded-xl border border-rose-500/25 bg-[#0B1220] p-3 font-mono text-xs leading-relaxed text-rose-200">
                              {t(cat.exampleLure, lang)}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Interactive Explorer (Compact Mode) + Red-Flag Self-Check */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {compact && (
          <div className="glass-panel rounded-2xl p-6 lg:col-span-7">
            <div className="flex flex-wrap gap-2">
              {scamAwarenessCategories.map((cat) => {
                const selected = cat.id === activeCategory.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                      selected
                        ? 'border-emerald-500/50 bg-[#16A34A] text-white shadow-sm'
                        : 'border-slate-700/70 bg-[#0B1220] text-slate-300 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    <span
                      className={selected ? 'text-white' : 'text-slate-400'}
                    >
                      {categoryIcons[cat.id]}
                    </span>
                    {t(cat.title, lang)}
                  </button>
                );
              })}
            </div>

            {/* Active Category Detail */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0B1220] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-xl font-bold text-white">
                  {t(activeCategory.title, lang)}
                </h3>
                <span className="rounded-full border border-sky-400/30 bg-sky-500/15 px-3 py-0.5 font-mono text-xs text-[#38BDF8]">
                  {t(activeCategory.badge, lang)}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {t(activeCategory.summary, lang)}
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                    {t(translations.awareness.warningSignsHeading, lang)}
                  </p>
                  <ul className="mt-2 space-y-2 text-xs leading-relaxed text-slate-200">
                    {activeCategory.warningSigns[lang].map((sign, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                        <span>{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                    {t(translations.awareness.preventionTipsHeading, lang)}
                  </p>
                  <ul className="mt-2 space-y-2 text-xs leading-relaxed text-slate-200">
                    {activeCategory.preventionTips[lang].map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Red Flag Checklist */}
        <div
          className={`glass-panel flex flex-col justify-between rounded-2xl p-6 ${
            compact ? 'lg:col-span-5' : 'lg:col-span-12'
          }`}
        >
          <div>
            <h3 className="font-display text-xl font-bold text-white">
              {t(translations.awareness.checklistTitle, lang)}
            </h3>
            <p className="mt-1.5 text-sm text-slate-400">
              {t(translations.awareness.checklistSubtitle, lang)}
            </p>

            <div
              className={`mt-4 grid gap-2.5 ${
                compact ? 'grid-cols-1' : 'md:grid-cols-2'
              }`}
            >
              {translations.awareness.checklistItems.map((item) => {
                const isChecked = checkedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleCheck(item.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${
                      isChecked
                        ? 'border-emerald-500/45 bg-emerald-500/12 text-white'
                        : 'border-slate-800 bg-[#0B1220] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0 text-emerald-400">
                      {isChecked ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-500" />
                      )}
                    </span>
                    <span className="leading-snug">{t(item.text, lang)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={`mt-5 rounded-xl border p-4 text-sm leading-relaxed transition ${
              checkedCount === 0
                ? 'border-slate-800 bg-[#0B1220] text-slate-400'
                : checkedCount <= 2
                  ? 'border-amber-500/35 bg-amber-500/10 text-amber-200'
                  : 'border-rose-500/40 bg-rose-500/12 text-rose-200'
            }`}
          >
            {checkedCount === 0
              ? t(translations.awareness.checklistResultSafe, lang)
              : checkedCount <= 2
                ? t(translations.awareness.checklistResultWarn, lang)
                : t(translations.awareness.checklistResultCritical, lang)}
          </div>
        </div>
      </div>

      {/* Emergency Response Banner */}
      {!compact && (
        <div className="mt-8 glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="h-5 w-5 text-emerald-400" />
            <h3 className="font-display text-xl font-bold text-white">
              {t(translations.awareness.emergencyTitle, lang)}
            </h3>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {translations.awareness.emergencySteps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#0B1220] p-4"
              >
                <span className="font-mono text-xs font-semibold text-emerald-400">
                  {t(translations.awareness.stepPrefix, lang)} 0{idx + 1}
                </span>
                <h4 className="mt-1 font-display text-base font-bold text-white">
                  {t(step.title, lang)}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  {t(step.desc, lang)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
