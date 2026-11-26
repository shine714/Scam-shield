import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

/**
 * Reads an environment variable from process.env, falling back to parsing the
 * local .env file so updates to .env take effect without requiring a server restart.
 */
export function readEnvValue(name: string): string | undefined {
  const fromProcess = process.env[name]?.trim();
  if (fromProcess) {
    return fromProcess;
  }

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      return undefined;
    }
    const parsed = dotenv.parse(fs.readFileSync(envPath, 'utf8'));
    const fromFile = parsed[name]?.trim();
    return fromFile || undefined;
  } catch {
    return undefined;
  }
}

