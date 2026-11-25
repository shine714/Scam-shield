import { z } from 'zod';

export const MAX_URL_LENGTH = 2048;

export const AnalyzeUrlRequestSchema = z.object({
  url: z
    .string({ error: 'URL is required.' })
    .transform((v) => v.trim())
    .refine((v) => v.length > 0, {
      message: 'Please enter a URL to inspect.',
    })
    .refine((v) => v.length <= MAX_URL_LENGTH, {
      message: `URL must be ${MAX_URL_LENGTH} characters or fewer.`,
    }),
  language: z.enum(['en', 'hi']).default('en'),
});

export type AnalyzeUrlRequest = z.infer<typeof AnalyzeUrlRequestSchema>;

export interface BilingualText {
  en: string;
  hi: string;
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
  riskLevel: 'Low' | 'Medium' | 'High';
  riskScore: number;
  heuristicScore: number;
  verdictTitle: BilingualText;
  explanation: BilingualText;
  safetyDisclaimer: BilingualText;
  facts: UrlStructuralFacts;
  indicators: UrlIndicator[];
  reputation: UrlReputationResult;
  safetyRecommendations: {
    en: string[];
    hi: string[];
  };
}

