import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Eraser,
  Gift,
  Info,
  KeyRound,
  Link2,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  MessageSquareWarning,
  RefreshCw,
  RotateCcw,
  ScanSearch,
  ServerCrash,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserX,
} from 'lucide-react';
import type {
  AnalyzeMessageErrorResponse,
  AnalyzeMessageSuccessResponse,
  BackendHealthStatus,
  Language,
  MessageChannel,
  MessagePatternIndicators,
} from '../types';
import type { MessageDraft } from '../App';
import { t, translations } from '../i18n/translations';
import { sampleMessageFillers } from '../data/demoData';
import { RiskGauge } from '../components/RiskGauge';
import { apiUrl } from '../utils/api';

interface MessageScannerPageProps {
  lang: Language;
  initialDraft?: MessageDraft | null;
  onConsumeDraft?: () => void;
}

const MAX_MESSAGE_LENGTH = 5000;

export const MessageScannerPage: React.FC<MessageScannerPageProps> = ({
  lang,
  initialDraft,
  onConsumeDraft,
}) => {
  const [channel, setChannel] = useState<MessageChannel>('sms');
  const [messageText, setMessageText] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<AnalyzeMessageErrorResponse | null>(
    null
  );
  const [analysisResponse, setAnalysisResponse] =
    useState<AnalyzeMessageSuccessResponse | null>(null);

  const [health, setHealth] = useState<BackendHealthStatus | null>(null);
  const [checkingHealth, setCheckingHealth] = useState<boolean>(true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const fetchHealth = useCallback(async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch(apiUrl('/api/health'));
      if (!res.ok) {
        setHealth({ ok: false, aiConfigured: false, model: null, unreachable: true });
        return;
      }
      const data = (await res.json()) as BackendHealthStatus;
      setHealth({ ...data, unreachable: false });
    } catch {
      setHealth({ ok: false, aiConfigured: false, model: null, unreachable: true });
    } finally {
      setCheckingHealth(false);
    }
  }, []);

  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  const executeScan = useCallback(
    async (textToScan: string, targetChannel: MessageChannel) => {
      const trimmed = textToScan.trim();
      if (!trimmed) {
        setValidationError(t(translations.messageScanner.emptyInputError, lang));
        return;
      }
      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        setValidationError(t(translations.messageScanner.tooLongError, lang));
        return;
      }

      setValidationError(null);
      setApiError(null);
      setCopied(false);
      setIsScanning(true);

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 50_000);

      try {
        const res = await fetch(apiUrl('/api/analyze-message'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            message: trimmed,
            channel: targetChannel,
            language: lang,
          }),
        });

        const payload = (await res.json()) as
          | AnalyzeMessageSuccessResponse
          | AnalyzeMessageErrorResponse;

        if (!res.ok || !payload.ok) {
          const errPayload: AnalyzeMessageErrorResponse =
            'ok' in payload && payload.ok === false
              ? payload
              : {
                  ok: false,
                  errorCode: 'AI_ANALYSIS_FAILED',
                  error: t(translations.fallbackErrors.messageAnalyze, lang),
                };
          setAnalysisResponse(null);
          setApiError(errPayload);
          if (errPayload.errorCode === 'AI_NOT_CONFIGURED') {
            setHealth((prev) =>
              prev ? { ...prev, aiConfigured: false } : prev
            );
          }
          return;
        }

        setAnalysisResponse(payload);
      } catch (err) {
        setAnalysisResponse(null);
        const isTimeout = err instanceof Error && err.name === 'AbortError';
        setApiError({
          ok: false,
          errorCode: isTimeout ? 'AI_TIMEOUT' : 'NETWORK_ERROR',
          error: isTimeout
            ? t(translations.messageScanner.timeoutError, lang)
            : lang === 'en'
              ? 'Could not reach the ScamShield backend server (/api/analyze-message). Ensure the backend server is running with "npm run dev".'
              : 'ScamShield बैकएंड सर्वर (/api/analyze-message) से संपर्क नहीं हो सका। सुनिश्चित करें कि "npm run dev" के साथ बैकएंड सर्वर चल रहा है।',
        });
      } finally {
        window.clearTimeout(timeoutId);
        setIsScanning(false);
      }
    },
    [lang]
  );

  useEffect(() => {
    if (!initialDraft) return;
    setChannel(initialDraft.channel);
    setMessageText(initialDraft.text);
    onConsumeDraft?.();
    if (initialDraft.autoRun) {
      void executeScan(initialDraft.text, initialDraft.channel);
    }
  }, [initialDraft, onConsumeDraft, executeScan]);

  const handleFillSample = (sampleId: string) => {
    const found = sampleMessageFillers.find((s) => s.id === sampleId);
    if (!found) return;
    setChannel(found.channel);
    setMessageText(found.text);
    setValidationError(null);
    setApiError(null);
  };

  const handleClear = () => {
    setMessageText('');
    setValidationError(null);
    setApiError(null);
    setAnalysisResponse(null);
    setCopied(false);
  };

  const handleScanAgain = () => {
    setAnalysisResponse(null);
    setApiError(null);
    setValidationError(null);
    setCopied(false);
    textareaRef.current?.focus();
  };

  const handleCopyReport = async () => {
    if (!analysisResponse) return;
    const { result } = analysisResponse;
    const reportLines = [
      `ScamShield AI — ${t(translations.messageScanner.resultHeader, lang)}`,
      `${t(translations.messageRiskLevels[result.riskLevel], lang)} — ${result.riskScore}/100`,
      `${t(result.scamCategory, lang)}`,
      ``,
      t(result.explanation, lang),
      ``,
      `${t(translations.messageScanner.redFlagsTitle, lang)}:`,
      ...(result.redFlags.length > 0
        ? result.redFlags.map((f) => `- ${t(f.title, lang)}: ${t(f.detail, lang)}`)
        : [`- ${t(translations.messageScanner.noRedFlags, lang)}`]),
      ``,
      `${t(translations.messageScanner.actionTitle, lang)}:`,
      ...result.safetyRecommendations[lang].map((r) => `- ${r}`),
    ];
    try {
      await navigator.clipboard.writeText(reportLines.join('\n'));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard permission errors cleanly
    }
  };

  const channels: {
    id: MessageChannel;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'sms',
      label: t(translations.channelNames.sms, lang),
      icon: <Smartphone className="h-3.5 w-3.5" />,
    },
    {
      id: 'whatsapp',
      label: t(translations.channelNames.whatsapp, lang),
      icon: <MessageCircle className="h-3.5 w-3.5" />,
    },
    {
      id: 'email',
      label: t(translations.channelNames.email, lang),
      icon: <Mail className="h-3.5 w-3.5" />,
    },
    {
      id: 'other',
      label: t(translations.channelNames.other, lang),
      icon: <MessageSquare className="h-3.5 w-3.5" />,
    },
  ];

  const patternItems: {
    key: keyof MessagePatternIndicators;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'urgency',
      label: t(translations.messageScanner.patterns.urgency, lang),
      icon: <Clock className="h-3.5 w-3.5" />,
    },
    {
      key: 'fakeRewards',
      label: t(translations.messageScanner.patterns.fakeRewards, lang),
      icon: <Gift className="h-3.5 w-3.5" />,
    },
    {
      key: 'impersonation',
      label: t(translations.messageScanner.patterns.impersonation, lang),
      icon: <UserX className="h-3.5 w-3.5" />,
    },
    {
      key: 'otpRequest',
      label: t(translations.messageScanner.patterns.otpRequest, lang),
      icon: <KeyRound className="h-3.5 w-3.5" />,
    },
    {
      key: 'suspiciousPayment',
      label: t(translations.messageScanner.patterns.suspiciousPayment, lang),
      icon: <CreditCard className="h-3.5 w-3.5" />,
    },
    {
      key: 'phishingIndicators',
      label: t(translations.messageScanner.patterns.phishingIndicators, lang),
      icon: <Link2 className="h-3.5 w-3.5" />,
    },
  ];

  const renderStatusPill = () => {
    if (checkingHealth) {
      return (
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-[#111827] px-3.5 py-1.5 text-xs text-slate-300">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#38BDF8]" />
          <span>{t(translations.messageScanner.statusChecking, lang)}</span>
        </div>
      );
    }

    if (health?.unreachable) {
      return (
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/35 bg-rose-500/10 px-3.5 py-1.5 text-xs font-medium text-rose-200">
          <ServerCrash className="h-3.5 w-3.5 text-rose-400" />
          <span>{t(translations.messageScanner.statusOffline, lang)}</span>
        </div>
      );
    }

    if (health?.aiConfigured) {
      return (
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
          <span>
            {t(translations.messageScanner.statusConnected, lang)}
            {health.model ? ` (${health.model})` : ''}
          </span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-500/10 px-3.5 py-1.5 text-xs font-medium text-amber-200">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
        <span>{t(translations.messageScanner.statusNotConfigured, lang)}</span>
      </div>
    );
  };

  const result = analysisResponse?.result ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-medium text-emerald-300">
            <MessageSquareWarning className="h-3.5 w-3.5" />
            {t(translations.messageScanner.badge, lang)}
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t(translations.messageScanner.title, lang)}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
            {t(translations.messageScanner.subtitle, lang)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {renderStatusPill()}
          <button
            type="button"
            onClick={() => void fetchHealth()}
            disabled={checkingHealth}
            title={t(translations.messageScanner.retryStatusButton, lang)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-[#111827] px-3 py-1.5 text-xs text-slate-300 transition hover:border-emerald-400/40 hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${checkingHealth ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Main Two-Column SaaS Workspace */}
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Input Column */}
        <div className="glass-panel flex flex-col justify-between rounded-2xl p-6 lg:col-span-5">
          <div>
            {/* Channel Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t(translations.messageScanner.channelLabel, lang)}
              </span>
              <div className="flex flex-wrap items-center gap-1 rounded-xl border border-slate-800 bg-[#0B1220] p-1">
                {channels.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setChannel(ch.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                      channel === ch.id
                        ? 'bg-[#16A34A] text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ch.icon}
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Message Fillers */}
            <div className="mt-5">
              <p className="text-xs font-medium text-slate-400">
                {t(translations.messageScanner.samplesLabel, lang)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sampleMessageFillers.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleFillSample(sample.id)}
                    className="rounded-xl border border-slate-700/80 bg-[#0B1220] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-emerald-400/50 hover:text-emerald-300"
                  >
                    {t(sample.label, lang)}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="message-scanner-input"
                  className="text-sm font-semibold text-slate-200"
                >
                  {t(translations.messageScanner.textareaLabel, lang)}
                </label>
                <span
                  className={`font-mono text-xs ${
                    messageText.length > MAX_MESSAGE_LENGTH
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {messageText.length} / {MAX_MESSAGE_LENGTH}{' '}
                  {t(translations.messageScanner.charCount, lang)}
                </span>
              </div>
              <textarea
                ref={textareaRef}
                id="message-scanner-input"
                rows={7}
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  setValidationError(null);
                  setApiError(null);
                }}
                placeholder={t(
                  translations.messageScanner.textareaPlaceholder,
                  lang
                )}
                className="mt-2 min-h-[172px] w-full rounded-2xl border border-slate-700/80 bg-[#0B1220] p-4 font-sans text-sm leading-relaxed text-slate-100 placeholder-slate-500 transition focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {validationError && (
              <div
                role="alert"
                className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/35 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-5">
            <button
              type="button"
              onClick={handleClear}
              disabled={isScanning}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-[#0B1220] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50"
            >
              <Eraser className="h-4 w-4" />
              {t(translations.messageScanner.clearButton, lang)}
            </button>

            <button
              type="button"
              onClick={() => void executeScan(messageText, channel)}
              disabled={isScanning}
              className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t(translations.messageScanner.scanningButton, lang)}
                </>
              ) : (
                <>
                  <ScanSearch className="h-4 w-4" />
                  {t(translations.messageScanner.scanButton, lang)}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Dashboard Column */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <h2 className="font-display text-lg font-bold text-white">
              {t(translations.messageScanner.resultHeader, lang)}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {analysisResponse && (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-500/15 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t(translations.messageScanner.liveAiBadge, lang)} •{' '}
                    {analysisResponse.model}
                  </span>
                  <button
                    type="button"
                    onClick={() => void handleCopyReport()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#0B1220] px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:border-sky-400/50 hover:text-[#38BDF8]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        {t(translations.messageScanner.copiedReport, lang)}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        {t(translations.messageScanner.copyReport, lang)}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleScanAgain}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t(translations.messageScanner.scanAgain, lang)}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isScanning && (
            <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-emerald-500/25 bg-[#0B1220]/90 px-6 py-16 text-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/35 bg-emerald-500/15">
                <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
              </div>
              <p className="mt-4 font-display text-lg font-bold text-white">
                {t(translations.messageScanner.scanningButton, lang)}
              </p>
              <p className="mt-1.5 max-w-sm text-xs text-slate-400">
                {lang === 'en'
                  ? 'Evaluating urgency, impersonation, OTP traps, payment lures, and phishing indicators via secure backend AI...'
                  : 'सुरक्षित बैकएंड AI द्वारा तात्कालिकता, नकल, OTP जाल, संदिग्ध भुगतान और फ़िशिंग संकेतों की जाँच की जा रही है...'}
              </p>
            </div>
          )}

          {/* Error State */}
          {!isScanning && apiError && (
            <div
              role="alert"
              className="mt-6 space-y-4 rounded-2xl border border-rose-500/35 bg-rose-500/10 p-6"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-400" />
                <div>
                  <h3 className="font-display text-lg font-bold text-rose-100">
                    {t(translations.messageScanner.errorTitle, lang)}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-rose-200/90">
                    {apiError.errorLocalized
                      ? t(apiError.errorLocalized, lang)
                      : apiError.error}
                  </p>
                </div>
              </div>

              {apiError.errorCode === 'AI_NOT_CONFIGURED' && (
                <div className="rounded-xl border border-amber-400/30 bg-[#0B1220] p-4 text-xs leading-relaxed text-slate-200">
                  <p className="font-semibold text-amber-200">
                    {t(translations.messageScanner.setupGuideTitle, lang)}
                  </p>
                  <p className="mt-1.5 text-slate-300">
                    {t(translations.messageScanner.setupGuideBody, lang)}
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded-lg border border-slate-800 bg-[#111827] p-3 font-mono text-[11px] text-[#38BDF8]">
                    {`GEMINI_API_KEY=your_real_api_key_here\nGEMINI_MODEL=gemini-3.5-flash-lite\nPORT=3001`}
                  </pre>
                  <button
                    type="button"
                    onClick={() => void fetchHealth()}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/35 bg-emerald-500/15 px-3 py-1.5 font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {t(translations.messageScanner.retryStatusButton, lang)}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Idle State */}
          {!isScanning && !apiError && !result && (
            <div className="mt-8 space-y-4">
              {!checkingHealth && (!health?.aiConfigured || health?.unreachable) && (
                <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100">
                  <p className="font-semibold text-amber-200">
                    {t(translations.messageScanner.setupGuideTitle, lang)}
                  </p>
                  <p className="mt-1 text-amber-100/85">
                    {health?.unreachable
                      ? lang === 'en'
                        ? 'Backend API server is not reachable. Start both frontend and backend with "npm run dev".'
                        : 'बैकएंड API सर्वर उपलब्ध नहीं है। फ्रंटएंड और बैकएंड दोनों चलाने के लिए "npm run dev" चलाएँ।'
                      : t(translations.messageScanner.setupGuideBody, lang)}
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/80 bg-[#0B1220]/70 px-6 py-14 text-center">
                <ScanSearch className="h-10 w-10 text-emerald-400/75" />
                <h3 className="mt-4 font-display text-lg font-bold text-white">
                  {t(translations.messageScanner.idleTitle, lang)}
                </h3>
                <p className="mt-2 max-w-md text-sm text-slate-400">
                  {t(translations.messageScanner.idleDesc, lang)}
                </p>
              </div>
            </div>
          )}

          {/* Real AI Result Dashboard */}
          {!isScanning && !apiError && result && analysisResponse && (
            <div className="mt-5 space-y-5">
              {/* Top Banner: Risk Level — XX/100 */}
              <div
                className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-2.5 ${
                  result.riskLevel === 'High'
                    ? 'border-rose-500/35 bg-rose-500/10 text-rose-200'
                    : result.riskLevel === 'Medium'
                      ? 'border-amber-500/35 bg-amber-500/10 text-amber-200'
                      : 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200'
                }`}
              >
                <span className="font-mono text-xs font-bold tracking-wider">
                  {t(translations.messageRiskLevels[result.riskLevel], lang)} —{' '}
                  {result.riskScore}/100
                </span>
                <span className="font-mono text-[11px] opacity-85">
                  {t(translations.channelNames[analysisResponse.channel], lang)}
                </span>
              </div>

              {/* Top Score Gauge & AI Summary */}
              <div className="grid gap-4 sm:grid-cols-12">
                <div className="sm:col-span-4">
                  <RiskGauge
                    score={result.riskScore}
                    riskLevel={result.riskLevel}
                    lang={lang}
                    label={t(translations.messageScanner.riskScoreLabel, lang)}
                  />
                </div>
                <div className="flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-[#111827] p-4 sm:col-span-8">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#38BDF8]">
                      {t(translations.channelNames[analysisResponse.channel], lang)} •{' '}
                      {t(translations.messageRiskLevels[result.riskLevel], lang)}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-bold text-white">
                      {t(result.scamCategory, lang)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      {t(result.explanation, lang)}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {t(translations.messageScanner.phrasesTitle, lang)}
                    </p>
                    {result.flaggedPhrases.length > 0 ? (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {result.flaggedPhrases.map((phrase, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] text-rose-200"
                          >
                            “{phrase}”
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-slate-400">
                        {t(translations.messageScanner.noPhrasesText, lang)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Non-Guarantee Notice */}
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-400/25 bg-amber-500/10 p-3.5 text-xs leading-relaxed text-amber-100">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                <span>{t(translations.messageScanner.aiDisclaimer, lang)}</span>
              </div>

              {/* 6 Threat Pattern Indicators */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t(translations.messageScanner.patternMatrixTitle, lang)}
                </h4>
                <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {patternItems.map((item) => {
                    const detected = result.patternIndicators[item.key];
                    return (
                      <div
                        key={item.key}
                        className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-xs ${
                          detected
                            ? 'border-rose-500/35 bg-rose-500/10 text-rose-100'
                            : 'border-slate-800 bg-[#0B1220] text-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <span
                            className={
                              detected ? 'text-rose-400' : 'text-slate-500'
                            }
                          >
                            {item.icon}
                          </span>
                          {item.label}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold ${
                            detected
                              ? 'bg-rose-500/20 text-rose-200'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {detected
                            ? t(
                                translations.messageScanner.patternDetected,
                                lang
                              )
                            : t(translations.messageScanner.patternClear, lang)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clear Reasons */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t(translations.messageScanner.reasonsTitle, lang)}
                </h4>
                <ul className="mt-2.5 space-y-2">
                  {result.reasons[lang].map((reason, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-[#0B1220] px-3.5 py-2.5 text-sm text-slate-200"
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#38BDF8]" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Detected Red Flags */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t(translations.messageScanner.redFlagsTitle, lang)}
                </h4>
                {result.redFlags.length === 0 ? (
                  <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{t(translations.messageScanner.noRedFlags, lang)}</span>
                  </div>
                ) : (
                  <div className="mt-2.5 space-y-2.5">
                    {result.redFlags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl border border-slate-800 bg-[#0B1220] p-3.5"
                      >
                        <div className="mt-0.5">
                          {flag.severity === 'high' ? (
                            <ShieldAlert className="h-4 w-4 text-rose-400" />
                          ) : flag.severity === 'medium' ? (
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-[#38BDF8]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-white">
                              {t(flag.title, lang)}
                            </p>
                            <span
                              className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                                flag.severity === 'high'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : flag.severity === 'medium'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-sky-500/20 text-[#38BDF8]'
                              }`}
                            >
                              {t(translations.severityLabels[flag.severity], lang)}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            {t(flag.detail, lang)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Practical Safety Recommendations */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2 text-emerald-300">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider">
                    {t(translations.messageScanner.actionTitle, lang)}
                  </h4>
                </div>
                <ul className="mt-2.5 space-y-2">
                  {result.safetyRecommendations[lang].map((rec, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-100"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
