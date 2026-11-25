import React from 'react';
import type { Language, MessageRiskLevel, RiskLevel } from '../types';
import { t, translations } from '../i18n/translations';

interface RiskGaugeProps {
  score: number;
  riskLevel: RiskLevel | MessageRiskLevel;
  lang: Language;
  label: string;
  badgeText?: string;
}

function normalizeRiskTier(
  riskLevel: RiskLevel | MessageRiskLevel
): 'high' | 'medium' | 'low' {
  if (riskLevel === 'high' || riskLevel === 'High') return 'high';
  if (riskLevel === 'suspicious' || riskLevel === 'Medium') return 'medium';
  return 'low';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  riskLevel,
  lang,
  label,
  badgeText,
}) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const tier = normalizeRiskTier(riskLevel);

  const palette =
    tier === 'high'
      ? {
          stroke: '#fb7185',
          glow: 'rgba(251, 113, 133, 0.35)',
          badge: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
          text: 'text-rose-400',
        }
      : tier === 'medium'
        ? {
            stroke: '#fbbf24',
            glow: 'rgba(251, 191, 36, 0.3)',
            badge: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
            text: 'text-amber-400',
          }
        : {
            stroke: '#34d399',
            glow: 'rgba(52, 211, 153, 0.3)',
            badge: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
            text: 'text-emerald-400',
          };

  const defaultBadge =
    riskLevel === 'high' || riskLevel === 'suspicious' || riskLevel === 'safe'
      ? t(translations.riskLabels[riskLevel], lang)
      : t(translations.messageRiskLevels[riskLevel], lang);

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800/90 bg-[#060E20]/80 p-5 text-center">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(30, 41, 59, 0.9)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={palette.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 650ms cubic-bezier(0.22, 1, 0.36, 1)',
              filter: `drop-shadow(0 0 8px ${palette.glow})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-3xl font-extrabold ${palette.text}`}>
            {clamped}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
            / 100
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs font-medium text-slate-400">{label}</p>
      <span
        className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] font-semibold ${palette.badge}`}
      >
        {badgeText ?? defaultBadge}
      </span>
    </div>
  );
};
