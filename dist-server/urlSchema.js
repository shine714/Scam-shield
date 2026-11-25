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
