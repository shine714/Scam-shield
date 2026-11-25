export type Language = 'en' | 'hi';

export type PageRoute =
  | 'home'
  | 'message-scanner'
  | 'url-scanner'
  | 'awareness'
  | 'about';

export type RiskLevel = 'high' | 'suspicious' | 'safe';

export type MessageRiskLevel = 'Low' | 'Medium' | 'High';

export type MessageChannel = 'sms' | 'whatsapp' | 'email' | 'other';

export interface BilingualText {
  en: string;
  hi: string;
}

export interface BilingualList {
  en: string[];
  hi: string[];
}

export interface MessagePatternIndicators {
  urgency: boolean;
  fakeRewards: boolean;
  impersonation: boolean;
  otpRequest: boolean;
  suspiciousPayment: boolean;
  phishingIndicators: boolean;
}

export interface MessageRedFlag {
  title: BilingualText;
  detail: BilingualText;
  severity: 'high' | 'medium' | 'low';
}

export interface MessageAnalysisResult {
  riskLevel: MessageRiskLevel;
  riskScore: number;
  scamCategory: BilingualText;
  explanation: BilingualText;
  reasons: BilingualList;
  patternIndicators: MessagePatternIndicators;
  redFlags: MessageRedFlag[];
  flaggedPhrases: string[];
  safetyRecommendations: BilingualList;
}

export interface AnalyzeMessageSuccessResponse {
  ok: true;
  isRealAi: true;
  analyzedAt: string;
  model: string;
  channel: MessageChannel;
  result: MessageAnalysisResult;
}

export interface AnalyzeMessageErrorResponse {
  ok: false;
  errorCode:
    | 'INVALID_INPUT'
    | 'AI_NOT_CONFIGURED'
    | 'AI_ANALYSIS_FAILED'
    | 'AI_TIMEOUT'
    | 'INTERNAL_ERROR'
    | 'NETWORK_ERROR';
  error: string;
  errorLocalized?: BilingualText;
}

export interface BackendHealthStatus {
  ok: boolean;
  aiConfigured: boolean;
  model: string | null;
  urlReputationConfigured?: boolean;
  urlReputationProvider?: string | null;
  unreachable?: boolean;
}

export interface UrlIndicator {
  id: string;
  category:
    | 'domain'
    | 'subdomain'
    | 'ip_address'
    | 'misleading_pattern'
    | 'structure'
    | 'reputation';
  severity: 'high' | 'medium' | 'low';
  title: BilingualText;
  detail: BilingualText;
}

export interface UrlStructuralFacts {
  normalizedUrl: string;
  protocol: string;
  protocolProvided: boolean;
  hostname: string;
  registrableDomain: string;
  tld: string;
  subdomainCount: number;
  isIpAddress: boolean;
  hasPunycodeOrIdn: boolean;
  hasEmbeddedCredentials: boolean;
  port: string | null;
  path: string;
  urlLength: number;
}

export type ReputationCheckStatus =
  | 'not_configured'
  | 'no_match_found'
  | 'threat_found'
  | 'error';

export interface UrlReputationResult {
  provider: string;
  configured: boolean;
  status: ReputationCheckStatus;
  threatTypes: string[];
  summary: BilingualText;
  errorDetail?: string;
}

export interface UrlAnalysisResult {
  riskLevel: MessageRiskLevel;
  riskScore: number;
  heuristicScore: number;
  verdictTitle: BilingualText;
  explanation: BilingualText;
  safetyDisclaimer: BilingualText;
  facts: UrlStructuralFacts;
  indicators: UrlIndicator[];
  reputation: UrlReputationResult;
  safetyRecommendations: BilingualList;
}

export interface AnalyzeUrlSuccessResponse {
  ok: true;
  analyzedAt: string;
  heuristicOnly: boolean;
  result: UrlAnalysisResult;
}

export interface AnalyzeUrlErrorResponse {
  ok: false;
  errorCode: 'INVALID_URL' | 'INTERNAL_ERROR' | 'NETWORK_ERROR';
  error: string;
  errorLocalized?: BilingualText;
}
