const DEFAULT_GITHUB_PAGES_API_BASE = 'https://scam-shield-ipqq.onrender.com';

/**
 * Resolves the API URL for both same-origin deployments (localhost / Render)
 * and cross-origin static hosting (GitHub Pages -> Render backend).
 */
export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const envBase = (
    import.meta as unknown as { env?: Record<string, string | undefined> }
  ).env?.VITE_API_BASE_URL?.trim();

  if (envBase) {
    return `${envBase.replace(/\/+$/, '')}${normalizedPath}`;
  }

  if (
    typeof window !== 'undefined' &&
    window.location.hostname === 'shine714.github.io'
  ) {
    return `${DEFAULT_GITHUB_PAGES_API_BASE}${normalizedPath}`;
  }

  return normalizedPath;
}
