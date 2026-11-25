import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Database,
  Eraser,
  Globe,
  Info,
  Link2,
  Loader2,
  Lock,
  RefreshCw,
  ScanSearch,
  ServerCrash,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react';
import type {
  AnalyzeUrlErrorResponse,
  AnalyzeUrlSuccessResponse,
  BackendHealthStatus,
  Language,
} from '../types';
import { t, translations } from '../i18n/translations';
import { sampleUrlFillers } from '../data/demoData';
import { RiskGauge } from '../components/RiskGauge';

interface UrlScannerPageProps {
  lang: Language;
}

const MAX_URL_LENGTH = 2048;

function validateClientUrl(raw: string): {
  valid: boolean;
  error?: { en: string; hi: string };
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { valid: false, error: translations.urlScanner.emptyUrlError };
  }
  if (trimmed.length > MAX_URL_LENGTH || /\s|\\/.test(trimmed)) {
    return {
      valid: false,
      error: translations.urlScanner.invalidUrlError,
    };
  }
  const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):(.*)$/);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if ((scheme !== 'http' && scheme !== 'https') || !schemeMatch[2].startsWith('//')) {
      return {
        valid: false,
        error: translations.urlScanner.invalidUrlError,
      };
    }
  }
  const candidate = schemeMatch ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (!parsed.hostname) {
      return {
        valid: false,
        error: translations.urlScanner.invalidUrlError,
      };
    }
    const isIpv4OrBracketed =
      /^\d{1,3}(\.\d{1,3}){3}$/.test(parsed.hostname) ||
      parsed.hostname.startsWith('[');
    if (!isIpv4OrBracketed && !parsed.hostname.includes('.')) {
      return {
        valid: false,
        error: translations.urlScanner.invalidUrlError,
      };
    }
    return { valid: true };
  } catch {
    return {
      valid: false,
      error: translations.urlScanner.invalidUrlError,
    };
  }
}

export const UrlScannerPage: React.FC<UrlScannerPageProps> = ({ lang }) => {
  const [urlInput, setUrlInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [validationError, setValidationError] = useState<{
    en: string;
    hi: string;
  } | null>(null);
  const [apiError, setApiError] = useState<AnalyzeUrlErrorResponse | null>(null);
  const [analysisResponse, setAnalysisResponse] =
    useState<AnalyzeUrlSuccessResponse | null>(null);

  const [health, setHealth] = useState<BackendHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState<boolean>(true);

  const fetchHealth = useCallback(async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        setHealth({
          ok: false,
          aiConfigured: false,
          model: null,
          urlReputationConfigured: false,
          unreachable: true,
        });
        return;
      }
      const data = (await res.json()) as BackendHealthStatus;
      setHealth({ ...data, unreachable: false });
    } catch {
      setHealth({
        ok: false,
        aiConfigured: false,
        model: null,
        urlReputationConfigured: false,
        unreachable: true,
      });
    } finally {
      setCheckingHealth(false);
    }
  }, []);

  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  const handleFillSample = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
    setValidationError(null);
    setApiError(null);
  };

  const handleClear = () => {
    setUrlInput('');
    setValidationError(null);
    setApiError(null);
    setAnalysisResponse(null);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateClientUrl(urlInput);
    if (!check.valid) {
      setValidationError(check.error ?? translations.urlScanner.invalidUrlError);
      return;
    }

    setValidationError(null);
    setApiError(null);
    setIsScanning(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const res = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          url: urlInput.trim(),
          language: lang,
        }),
      });

      const payload = (await res.json()) as
        | AnalyzeUrlSuccessResponse
        | AnalyzeUrlErrorResponse;

      if (!res.ok || !payload.ok) {
        const errPayload: AnalyzeUrlErrorResponse =
          'ok' in payload && payload.ok === false
            ? payload
            : {
                ok: false,
                errorCode: 'INTERNAL_ERROR',
                error: t(translations.fallbackErrors.urlInspect, lang),
                errorLocalized: translations.fallbackErrors.urlInspect,
              };
        setAnalysisResponse(null);
        setApiError(errPayload);
        return;
      }

      setAnalysisResponse(payload);
    } catch (err) {
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      const netErrLocalized = isTimeout
        ? {
            en: 'URL inspection timed out. Please try again.',
            hi: 'URL जाँच का समय समाप्त हो गया। कृपया फिर से कोशिश करें।',
          }
        : {
            en: 'Could not reach the ScamShield backend server (/api/analyze-url). Start the backend with "npm run dev".',
            hi: 'ScamShield बैकएंड सर्वर (/api/analyze-url) से संपर्क नहीं हो सका। "npm run dev" के साथ बैकएंड चलाएँ।',
          };
      setAnalysisResponse(null);
      setApiError({
        ok: false,
        errorCode: 'NETWORK_ERROR',
        error: t(netErrLocalized, lang),
        errorLocalized: netErrLocalized,
      });
    } finally {
      window.clearTimeout(timeoutId);
      setIsScanning(false);
    }
  };

  const renderStatusPill = () => {
    if (checkingHealth) {
      return (
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#070F22] px-3.5 py-1.5 text-xs text-slate-300">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
          <span>{t(translations.urlScanner.statusChecking, lang)}</span>
        </div>
      );
    }

    if (health?.unreachable) {
      return (
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/35 bg-rose-500/10 px-3.5 py-1.5 text-xs font-medium text-rose-200">
          <ServerCrash className="h-3.5 w-3.5 text-rose-400" />
          <span>{t(translations.urlScanner.statusOffline, lang)}</span>
        </div>
      );
    }

    if (health?.urlReputationConfigured) {
      return (
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>
            {t(translations.urlScanner.statusReputationReady, lang)}
            {health.urlReputationProvider
              ? ` (${health.urlReputationProvider})`
              : ''}
          </span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium text-amber-200">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
        <span>{t(translations.urlScanner.statusHeuristicsOnly, lang)}</span>
      </div>
    );
  };

  const result = analysisResponse?.result ?? null;
  const yesLabel = lang === 'en' ? 'Yes' : 'हाँ';
  const noLabel = lang === 'en' ? 'No' : 'नहीं';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 font-mono text-xs font-medium text-blue-300">
            <Link2 className="h-3.5 w-3.5" />
            {t(translations.urlScanner.badge, lang)}
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t(translations.urlScanner.title, lang)}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
            {t(translations.urlScanner.subtitle, lang)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {renderStatusPill()}
          <button
            type="button"
            onClick={() => void fetchHealth()}
            disabled={checkingHealth}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-[#081022] px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-white disabled:opacity-50"
            aria-label={
              lang === 'en' ? 'Refresh backend status' : 'बैकएंड स्थिति फिर जाँचें'
            }
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${checkingHealth ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Zero-Visit Safety Banner */}
      <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-2.5 text-xs text-cyan-100">
        <ShieldOff className="h-4 w-4 shrink-0 text-cyan-300" />
        <span>{t(translations.urlScanner.safeInspectionNotice, lang)}</span>
      </div>

      {/* URL Input Card */}
      <form onSubmit={(e) => void handleScan(e)} className="glass-panel mt-5 rounded-2xl p-6">
        <label
          htmlFor="url-scanner-input"
          className="text-sm font-semibold text-slate-200"
        >
          {t(translations.urlScanner.inputLabel, lang)}
        </label>

        <div className="mt-2.5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Globe className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
            <input
              id="url-scanner-input"
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setValidationError(null);
                setApiError(null);
              }}
              placeholder={t(translations.urlScanner.inputPlaceholder, lang)}
              className="w-full rounded-xl border border-slate-700/80 bg-[#050B18] py-3.5 pl-11 pr-4 font-mono text-sm text-slate-100 placeholder-slate-500 transition focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClear}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#081022] px-4 py-3.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50"
            >
              <Eraser className="h-4 w-4" />
              {t(translations.urlScanner.clearButton, lang)}
            </button>

            <button
              type="submit"
              disabled={isScanning}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t(translations.urlScanner.scanningButton, lang)}
                </>
              ) : (
                <>
                  <ScanSearch className="h-4 w-4" />
                  {t(translations.urlScanner.scanButton, lang)}
                </>
              )}
            </button>
          </div>
        </div>

        {validationError && (
          <div
            role="alert"
            className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/35 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{t(validationError, lang)}</span>
          </div>
        )}

        {/* Quick Test URL Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">
            {t(translations.urlScanner.samplesLabel, lang)}
          </span>
          {sampleUrlFillers.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleFillSample(sample.url)}
              className="rounded-xl border border-slate-700/80 bg-[#070F22] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
            >
              {t(sample.label, lang)}
            </button>
          ))}
        </div>
      </form>

      {/* Inspection Result Panel */}
      <div className="glass-panel mt-6 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <h2 className="font-display text-lg font-bold text-white">
            {t(translations.urlScanner.resultHeader, lang)}
          </h2>
          {result && (
            <span className="rounded-lg border border-slate-700 bg-[#060D1E] px-3 py-1 font-mono text-xs text-slate-300">
              {t(translations.urlScanner.heuristicSectionBadge, lang)} •{' '}
              {result.reputation.configured
                ? result.reputation.provider
                : t(translations.urlScanner.reputationNotConfigured, lang)}
            </span>
          )}
        </div>

        {/* Loading State */}
        {isScanning && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-cyan-500/25 bg-[#050B18]/80 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/35 bg-cyan-500/15">
              <Loader2 className="h-7 w-7 animate-spin text-cyan-300" />
            </div>
            <p className="mt-4 font-display text-lg font-bold text-white">
              {t(translations.urlScanner.scanningButton, lang)}
            </p>
            <p className="mt-1.5 max-w-md text-xs text-slate-400">
              {lang === 'en'
                ? 'Running static domain, subdomain, IP-host, and URL structure checks without visiting the target URL...'
                : 'लक्ष्य URL को खोले बिना डोमेन, सबडोमेन, IP-होस्ट और URL संरचना की जाँच की जा रही है...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {!isScanning && apiError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-500/35 bg-rose-500/10 p-6"
          >
            <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-400" />
            <div>
              <h3 className="font-display text-lg font-bold text-rose-100">
                {t(translations.urlScanner.errorTitle, lang)}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-rose-200/90">
                {apiError.errorLocalized
                  ? t(apiError.errorLocalized, lang)
                  : apiError.error}
              </p>
            </div>
          </div>
        )}

        {/* Idle State */}
        {!isScanning && !apiError && !result && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/80 bg-[#050B18]/70 px-6 py-14 text-center">
            <Link2 className="h-10 w-10 text-cyan-400/70" />
            <h3 className="mt-4 font-display text-lg font-bold text-white">
              {t(translations.urlScanner.idleTitle, lang)}
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              {t(translations.urlScanner.idleDesc, lang)}
            </p>
          </div>
        )}

        {/* Result State */}
        {!isScanning && !apiError && result && (
          <div className="mt-6 space-y-6">
            {/* Top Overview: RiskGauge + Verdict + Safety Disclaimer */}
            <div className="grid gap-5 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <RiskGauge
                  score={result.riskScore}
                  riskLevel={result.riskLevel}
                  lang={lang}
                  label={t(translations.urlScanner.riskScoreLabel, lang)}
                />
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#060E20]/80 p-5 lg:col-span-9">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {t(result.verdictTitle, lang)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {t(result.explanation, lang)}
                  </p>

                  {/* Non-clickable inspected URL box */}
                  <div className="mt-4 rounded-xl border border-slate-800 bg-[#040914] px-3.5 py-2.5">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {t(translations.urlScanner.factsLabels.normalized, lang)}
                    </span>
                    <code className="mt-1 block break-all font-mono text-xs text-cyan-200">
                      {result.facts.normalizedUrl}
                    </code>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-100">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  <span>{t(result.safetyDisclaimer, lang)}</span>
                </div>
              </div>
            </div>

            {/* Distinct Two-Column Split: 1. Heuristic Analysis vs 2. External Reputation */}
            <div className="grid gap-5 lg:grid-cols-12">
              {/* 1. Local Heuristic & Structural Facts */}
              <div className="rounded-2xl border border-slate-800 bg-[#060D1E] p-5 lg:col-span-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display text-base font-bold text-white">
                    {t(translations.urlScanner.heuristicSectionTitle, lang)}
                  </h4>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
                    {result.heuristicScore} / 100
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-xl border border-slate-800 bg-[#050B18] p-3">
                    <span className="text-[11px] text-slate-400">
                      {t(translations.urlScanner.factsLabels.domain, lang)}
                    </span>
                    <p className="mt-1 truncate font-mono text-xs font-semibold text-white">
                      {result.facts.registrableDomain}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#050B18] p-3">
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Lock className="h-3 w-3 text-cyan-400" />
                      {t(translations.urlScanner.factsLabels.protocol, lang)}
                    </span>
                    <p className="mt-1 font-mono text-xs font-semibold uppercase text-white">
                      {result.facts.protocol}
                      {!result.facts.protocolProvided
                        ? lang === 'en'
                          ? ' (assumed)'
                          : ' (अनुमानित)'
                        : ''}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#050B18] p-3">
                    <span className="text-[11px] text-slate-400">
                      {t(translations.urlScanner.factsLabels.subdomains, lang)}
                    </span>
                    <p className="mt-1 font-mono text-xs font-semibold text-white">
                      {result.facts.subdomainCount}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#050B18] p-3">
                    <span className="text-[11px] text-slate-400">
                      {t(translations.urlScanner.factsLabels.ipCheck, lang)}
                    </span>
                    <p
                      className={`mt-1 font-mono text-xs font-semibold ${result.facts.isIpAddress ? 'text-rose-300' : 'text-slate-200'
                        }`}
                    >
                      {result.facts.isIpAddress ? yesLabel : noLabel}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#050B18] p-3">
                    <span className="text-[11px] text-slate-400">
                      {t(translations.urlScanner.factsLabels.idnCheck, lang)}
                    </span>
                    <p
                      className={`mt-1 font-mono text-xs font-semibold ${result.facts.hasPunycodeOrIdn
                          ? 'text-rose-300'
                          : 'text-slate-200'
                        }`}
                    >
                      {result.facts.hasPunycodeOrIdn ? yesLabel : noLabel}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#050B18] p-3">
                    <span className="text-[11px] text-slate-400">
                      {t(translations.urlScanner.factsLabels.atTrick, lang)}
                    </span>
                    <p
                      className={`mt-1 font-mono text-xs font-semibold ${result.facts.hasEmbeddedCredentials
                          ? 'text-rose-300'
                          : 'text-slate-200'
                        }`}
                    >
                      {result.facts.hasEmbeddedCredentials ? yesLabel : noLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. External Reputation Lookup Card */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#060D1E] p-5 lg:col-span-5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="flex items-center gap-2 font-display text-base font-bold text-white">
                      <Database className="h-4 w-4 text-cyan-400" />
                      {t(translations.urlScanner.reputationSectionTitle, lang)}
                    </h4>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold ${result.reputation.status === 'threat_found'
                          ? 'border-rose-500/40 bg-rose-500/15 text-rose-200'
                          : result.reputation.status === 'no_match_found'
                            ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'
                            : result.reputation.status === 'error'
                              ? 'border-rose-500/40 bg-rose-500/15 text-rose-200'
                              : 'border-amber-400/40 bg-amber-500/15 text-amber-200'
                        }`}
                    >
                      {result.reputation.status === 'threat_found'
                        ? t(translations.urlScanner.reputationThreat, lang)
                        : result.reputation.status === 'no_match_found'
                          ? t(translations.urlScanner.reputationClean, lang)
                          : result.reputation.status === 'error'
                            ? t(translations.urlScanner.reputationError, lang)
                            : t(
                              translations.urlScanner.reputationNotConfigured,
                              lang
                            )}
                    </span>
                  </div>

                  <p className="mt-2 font-mono text-xs text-slate-400">
                    {result.reputation.provider}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {t(result.reputation.summary, lang)}
                  </p>

                  {result.reputation.threatTypes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {result.reputation.threatTypes.map((tt) => (
                        <span
                          key={tt}
                          className="rounded-lg border border-rose-500/35 bg-rose-500/15 px-2.5 py-1 font-mono text-xs font-semibold text-rose-200"
                        >
                          {tt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {!result.reputation.configured && (
                  <div className="mt-4 rounded-xl border border-slate-800 bg-[#040914] p-3 text-xs leading-relaxed text-slate-400">
                    {t(translations.urlScanner.reputationSetupHint, lang)}
                  </div>
                )}
              </div>
            </div>

            {/* Detected Indicators + Practical Recommendations */}
            <div className="grid gap-5 lg:grid-cols-12">
              <div className="space-y-2.5 lg:col-span-7">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t(translations.urlScanner.indicatorsTitle, lang)}
                </h4>

                {result.indicators.length === 0 ? (
                  <div className="rounded-xl border border-slate-800 bg-[#060D1E] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <Info className="h-4 w-4 text-cyan-400" />
                      <span>
                        {t(translations.urlScanner.noIndicatorsTitle, lang)}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                      {t(translations.urlScanner.noIndicatorsNote, lang)}
                    </p>
                  </div>
                ) : (
                  result.indicators.map((ind) => (
                    <div
                      key={ind.id}
                      className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#060D1E] p-3.5"
                    >
                      <div className="mt-0.5">
                        {ind.severity === 'high' ? (
                          <ShieldAlert className="h-4 w-4 text-rose-400" />
                        ) : ind.severity === 'medium' ? (
                          <AlertCircle className="h-4 w-4 text-amber-400" />
                        ) : (
                          <Info className="h-4 w-4 text-cyan-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-white">
                            {t(ind.title, lang)}
                          </p>
                          <span
                            className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${ind.severity === 'high'
                                ? 'bg-rose-500/20 text-rose-300'
                                : ind.severity === 'medium'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-cyan-500/20 text-cyan-300'
                              }`}
                          >
                            {t(translations.severityLabels[ind.severity], lang)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {t(ind.detail, lang)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-5 lg:col-span-5">
                <div className="flex items-center gap-2 text-cyan-200">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-cyan-300" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider">
                    {t(translations.urlScanner.actionTitle, lang)}
                  </h4>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {result.safetyRecommendations[lang].map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-100"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
