import { z } from 'zod';

export const MAX_MESSAGE_LENGTH = 5000;

export const AnalyzeMessageRequestSchema = z.object({
  message: z
    .string({ error: 'Message text is required.' })
    .transform((v) => v.trim())
    .refine((v) => v.length > 0, {
      message: 'Message cannot be empty.',
    })
    .refine((v) => v.length <= MAX_MESSAGE_LENGTH, {
      message: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
    }),
  channel: z.enum(['sms', 'whatsapp', 'email', 'other']).default('sms'),
  language: z.enum(['en', 'hi']).default('en'),
});

export type AnalyzeMessageRequest = z.infer<typeof AnalyzeMessageRequestSchema>;

const BilingualTextSchema = z.object({
  en: z.string().min(1),
  hi: z.string().min(1),
});

const BilingualListSchema = z.object({
  en: z.array(z.string().min(1)).min(1),
  hi: z.array(z.string().min(1)).min(1),
});

export const AiMessageAnalysisSchema = z.object({
  riskLevel: z.enum(['Low', 'Medium', 'High']),
  riskScore: z.number().min(0).max(100),
  scamCategory: BilingualTextSchema,
  explanation: BilingualTextSchema,
  reasons: BilingualListSchema,
  patternIndicators: z.object({
    urgency: z.boolean(),
    fakeRewards: z.boolean(),
    impersonation: z.boolean(),
    otpRequest: z.boolean(),
    suspiciousPayment: z.boolean(),
    phishingIndicators: z.boolean(),
  }),
  redFlags: z.array(
    z.object({
      title: BilingualTextSchema,
      detail: BilingualTextSchema,
      severity: z.enum(['high', 'medium', 'low']),
    })
  ),
  flaggedPhrases: z.array(z.string()),
  safetyRecommendations: BilingualListSchema,
});

export type AiMessageAnalysis = z.infer<typeof AiMessageAnalysisSchema>;

/**
 * Explicit JSON Schema passed to Gemini Interactions API response_format.
 * Uses only the JSON Schema subset supported by Gemini Structured Outputs.
 */
export const AI_RESPONSE_JSON_SCHEMA: Record<string, unknown> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'riskLevel',
    'riskScore',
    'scamCategory',
    'explanation',
    'reasons',
    'patternIndicators',
    'redFlags',
    'flaggedPhrases',
    'safetyRecommendations',
  ],
  properties: {
    riskLevel: {
      type: 'string',
      enum: ['Low', 'Medium', 'High'],
      description: 'Overall scam risk classification.',
    },
    riskScore: {
      type: 'integer',
      description: 'Risk score from 0 (safe) to 100 (definite scam).',
    },
    scamCategory: {
      type: 'object',
      additionalProperties: false,
      required: ['en', 'hi'],
      properties: {
        en: { type: 'string', description: 'Short scam category label in English.' },
        hi: { type: 'string', description: 'Short scam category label in natural Hindi.' },
      },
    },
    explanation: {
      type: 'object',
      additionalProperties: false,
      required: ['en', 'hi'],
      properties: {
        en: {
          type: 'string',
          description: 'Clear 2-3 sentence explanation in plain English.',
        },
        hi: {
          type: 'string',
          description: 'Clear 2-3 sentence explanation in natural Hindi (Devanagari).',
        },
      },
    },
    reasons: {
      type: 'object',
      additionalProperties: false,
      required: ['en', 'hi'],
      properties: {
        en: {
          type: 'array',
          items: { type: 'string' },
          description: '2 to 5 concise reasons for the risk assessment in English.',
        },
        hi: {
          type: 'array',
          items: { type: 'string' },
          description: 'Matching 2 to 5 concise reasons in Hindi (Devanagari).',
        },
      },
    },
    patternIndicators: {
      type: 'object',
      additionalProperties: false,
      required: [
        'urgency',
        'fakeRewards',
        'impersonation',
        'otpRequest',
        'suspiciousPayment',
        'phishingIndicators',
      ],
      properties: {
        urgency: { type: 'boolean' },
        fakeRewards: { type: 'boolean' },
        impersonation: { type: 'boolean' },
        otpRequest: { type: 'boolean' },
        suspiciousPayment: { type: 'boolean' },
        phishingIndicators: { type: 'boolean' },
      },
    },
    redFlags: {
      type: 'array',
      description: 'Detected red flags in the message (empty array if none).',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'detail', 'severity'],
        properties: {
          title: {
            type: 'object',
            additionalProperties: false,
            required: ['en', 'hi'],
            properties: {
              en: { type: 'string' },
              hi: { type: 'string' },
            },
          },
          detail: {
            type: 'object',
            additionalProperties: false,
            required: ['en', 'hi'],
            properties: {
              en: { type: 'string' },
              hi: { type: 'string' },
            },
          },
          severity: {
            type: 'string',
            enum: ['high', 'medium', 'low'],
          },
        },
      },
    },
    flaggedPhrases: {
      type: 'array',
      items: { type: 'string' },
      description: 'Up to 5 exact short phrases quoted from the message that appear suspicious.',
    },
    safetyRecommendations: {
      type: 'object',
      additionalProperties: false,
      required: ['en', 'hi'],
      properties: {
        en: {
          type: 'array',
          items: { type: 'string' },
          description: '2 to 4 practical safety steps for the user in English.',
        },
        hi: {
          type: 'array',
          items: { type: 'string' },
          description: 'Matching 2 to 4 practical safety steps in Hindi (Devanagari).',
        },
      },
    },
  },
};

