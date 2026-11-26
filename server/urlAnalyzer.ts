import net from 'node:net';
import { readEnvValue } from './envHelper.js';
import type {
  BilingualText,
  UrlAnalysisResult,
  UrlIndicator,
  UrlReputationResult,
  UrlStructuralFacts,
} from './urlSchema.js';

const PLACEHOLDER_KEYS = new Set([
  'your_safe_browsing_api_key',
  'your_google_safe_browsing_api_key',
  'replace_me',
  'changeme',
]);

const HIGH_RISK_TLDS = new Set([
  'top',
  'xyz',
  'tk',
  'ml',
  'ga',
  'cf',
  'gq',
  'click',
  'zip',
  'mov',
  'icu',
  'buzz',
  'work',
  'support',
  'cam',
  'rest',
  'cfd',
  'sbs',
  'loan',
  'win',
  'bid',
]);

const URL_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'rebrand.ly',
  'cutt.ly',
  'rb.gy',
  'shorturl.at',
  'tiny.cc',
]);

const MULTI_PART_SUFFIXES = new Set([
  'co.in',
  'org.in',
  'gov.in',
  'nic.in',
  'ac.in',
  'net.in',
  'co.uk',
  'org.uk',
  'gov.uk',
  'com.au',
  'co.jp',
]);

const BRAND_KEYWORDS = [
  'sbi',
  'hdfc',
  'icici',
  'axis',
  'kotak',
  'pnb',
  'canara',
  'bob',
  'paytm',
  'phonepe',
  'gpay',
  'bhim',
  'upi',
  'npci',
  'paypal',
  'amazon',
  'flipkart',
  'microsoft',
  'apple',
  'google',
  'whatsapp',
  'uidai',
  'aadhaar',
  'incometax',
  'epfo',
  'rbi',
  'irctc',
  'bluedart',
  'delhivery',
  'fedex',
  'dhl',
  'airtel',
  'jio',
];

const LURE_KEYWORDS = [
  'kyc',
  'verify',
  'update',
  'login',
  'signin',
  'secure',
  'support',
  'claim',
  'refund',
  'reward',
  'bonus',
  'cashback',
  'block',
  'suspend',
  'unlock',
  'wallet',
  'account',
  'challan',
  'otp',
  'prize',
  'gift',
];

const DANGEROUS_EXTENSIONS = [
  '.apk',
  '.exe',
  '.msi',
  '.bat',
  '.cmd',
  '.scr',
  '.vbs',
  '.ps1',
  '.zip',
  '.rar',
];

export class InvalidUrlError extends Error {
  readonly code = 'INVALID_URL';
  readonly localized: { en: string; hi: string };

  constructor(
    message: string,
    hiMessage = 'कृपया एक सही http:// या https:// वेब पता (URL) दर्ज करें।'
  ) {
    super(message);
    this.name = 'InvalidUrlError';
    this.localized = { en: message, hi: hiMessage };
  }
}

export function getSafeBrowsingApiKey(): string | null {
  const raw =
    readEnvValue('GOOGLE_SAFE_BROWSING_API_KEY') ||
    readEnvValue('SAFE_BROWSING_API_KEY');
  if (!raw) return null;
  if (PLACEHOLDER_KEYS.has(raw.toLowerCase())) return null;
  return raw;
}

export function isUrlReputationConfigured(): boolean {
  return getSafeBrowsingApiKey() !== null;
}

export function parseAndValidateUrl(rawInput: string): {
  parsed: URL;
  rawHostname: string;
  protocolProvided: boolean;
} {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new InvalidUrlError(
      'Please enter a URL to inspect.',
      'जाँचने के लिए कृपया एक URL दर्ज करें।'
    );
  }
  if (/\s|\\/.test(trimmed)) {
    throw new InvalidUrlError(
      'URLs cannot contain spaces or backslashes.',
      'URL में बीच में स्पेस या बैकस्लैश (\\) नहीं हो सकता।'
    );
  }

  const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):(.*)$/);
  let protocolProvided = false;
  let candidate = trimmed;

  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme !== 'http' && scheme !== 'https') {
      throw new InvalidUrlError(
        `Unsupported URL scheme "${scheme}:". Only http:// and https:// web URLs can be inspected.`,
        `"${scheme}:" प्रकार का लिंक समर्थित नहीं है। केवल http:// और https:// वेब लिंक ही जाँचे जा सकते हैं।`
      );
    }
    if (!schemeMatch[2].startsWith('//')) {
      throw new InvalidUrlError(
        'Malformed URL: missing "//" after protocol.',
        'गलत URL प्रारूप: http/https के बाद "//" होना आवश्यक है।'
      );
    }
    protocolProvided = true;
  } else {
    candidate = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new InvalidUrlError(
      'Invalid URL format. Example: https://example.com/login',
      'अमान्य URL प्रारूप। उदाहरण: https://example.com/login'
    );
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!hostname) {
    throw new InvalidUrlError(
      'URL must include a valid domain name or IP address.',
      'URL में एक मान्य डोमेन नाम या IP पता होना चाहिए।'
    );
  }

  const unbracketed = hostname.replace(/^\[|\]$/g, '');
  const isIp = net.isIP(unbracketed) !== 0;

  if (!isIp) {
    if (
      !hostname.includes('.') ||
      hostname.startsWith('.') ||
      hostname.endsWith('.') ||
      hostname.includes('..')
    ) {
      throw new InvalidUrlError(
        'Please enter a valid domain name (e.g., https://example.com).',
        'कृपया एक मान्य डोमेन नाम दर्ज करें (जैसे https://example.com)।'
      );
    }
    const labels = hostname.split('.');
    const tld = labels[labels.length - 1];
    if (!tld || tld.length < 2 || /^\d+$/.test(tld)) {
      throw new InvalidUrlError(
        'URL has an invalid top-level domain.',
        'इस URL का अंतिम डोमेन भाग (.com, .in आदि) अमान्य है।'
      );
    }
  }

  // Extract raw hostname text before punycode normalization for IDN detection
  const afterScheme = candidate.replace(/^https?:\/\//i, '');
  const authority = afterScheme.split(/[/?#]/)[0] ?? '';
  const hostPortPart = authority.includes('@')
    ? authority.split('@').pop() ?? ''
    : authority;
  const rawHostname = hostPortPart.startsWith('[')
    ? hostPortPart
    : hostPortPart.split(':')[0] ?? hostname;

  return { parsed, rawHostname, protocolProvided };
}

function getRegistrableDomain(hostname: string, isIp: boolean): {
  registrableDomain: string;
  tld: string;
  subdomains: string[];
} {
  if (isIp) {
    return { registrableDomain: hostname, tld: 'IP', subdomains: [] };
  }

  const labels = hostname.split('.');
  if (labels.length <= 2) {
    return {
      registrableDomain: hostname,
      tld: labels[labels.length - 1] ?? '',
      subdomains: [],
    };
  }

  const lastTwo = `${labels[labels.length - 2]}.${labels[labels.length - 1]}`;
  const regCount = MULTI_PART_SUFFIXES.has(lastTwo) ? 3 : 2;
  const splitIndex = Math.max(0, labels.length - regCount);
  const registrableLabels = labels.slice(splitIndex);
  const subdomains = labels.slice(0, splitIndex).filter((l) => l !== 'www');

  return {
    registrableDomain: registrableLabels.join('.'),
    tld: labels[labels.length - 1] ?? '',
    subdomains,
  };
}

export function analyzeUrlHeuristics(rawUrl: string): {
  facts: UrlStructuralFacts;
  indicators: UrlIndicator[];
  heuristicScore: number;
} {
  const { parsed, rawHostname, protocolProvided } = parseAndValidateUrl(rawUrl);
  const hostname = parsed.hostname.toLowerCase();
  const unbracketed = hostname.replace(/^\[|\]$/g, '');
  const isIpAddress = net.isIP(unbracketed) !== 0;

  const { registrableDomain, tld, subdomains } = getRegistrableDomain(
    hostname,
    isIpAddress
  );

  const hasNonAsciiHost = /[^\x00-\x7F]/.test(rawHostname);
  const hasPunycodeOrIdn =
    hostname.includes('xn--') || hasNonAsciiHost;
  const hasEmbeddedCredentials = Boolean(parsed.username || parsed.password);
  const port = parsed.port || null;

  const facts: UrlStructuralFacts = {
    normalizedUrl: parsed.href,
    protocol: parsed.protocol.replace(':', ''),
    protocolProvided,
    hostname,
    registrableDomain,
    tld,
    subdomainCount: subdomains.length,
    isIpAddress,
    hasPunycodeOrIdn,
    hasEmbeddedCredentials,
    port,
    path: `${parsed.pathname}${parsed.search}`,
    urlLength: parsed.href.length,
  };

  const indicators: UrlIndicator[] = [];
  let score = 0;

  // 1. IP-address-based URL
  if (isIpAddress) {
    score += 45;
    indicators.push({
      id: 'ip-host',
      category: 'ip_address',
      severity: 'high',
      title: {
        en: 'IP-Address-Based URL',
        hi: 'IP पते पर आधारित URL',
      },
      detail: {
        en: `Uses raw IP address (${hostname}) instead of a registered domain name. Legitimate banks and services rarely ask users to log in via raw IPs.`,
        hi: `पंजीकृत डोमेन के बजाय सीधे IP पते (${hostname}) का उपयोग किया गया है। असली बैंक या सेवाएँ लॉगिन के लिए कच्चे IP का उपयोग नहीं करतीं।`,
      },
    });
  }

  // 2. Punycode / IDN Homograph Check
  if (hasPunycodeOrIdn) {
    score += 35;
    indicators.push({
      id: 'idn-punycode',
      category: 'misleading_pattern',
      severity: 'high',
      title: {
        en: 'Internationalized / Lookalike Domain Encoding',
        hi: 'नकली अक्षर / Punycode डोमेन संकेत',
      },
      detail: {
        en: 'Contains non-ASCII or Punycode (xn--) characters that can visually mimic trusted brand spellings.',
        hi: 'इसमें गैर-ASCII या Punycode (xn--) अक्षर हैं जिनका उपयोग विश्वसनीय ब्रांड की नकल करने के लिए किया जा सकता है।',
      },
    });
  }

  // 3. URL Shortener Check
  if (URL_SHORTENERS.has(hostname) || URL_SHORTENERS.has(registrableDomain)) {
    score += 26;
    indicators.push({
      id: 'url-shortener',
      category: 'domain',
      severity: 'medium',
      title: {
        en: 'URL Shortener Masks Final Destination',
        hi: 'शॉर्ट URL द्वारा अंतिम वेबसाइट छिपाई गई',
      },
      detail: {
        en: `"${registrableDomain}" hides the actual destination domain until clicked. Shortened links are frequently used to disguise phishing pages.`,
        hi: `"${registrableDomain}" असली गंतव्य वेबसाइट को छुपाता है। फ़िशिंग लिंक छिपाने के लिए शॉर्टनर का अक्सर उपयोग होता है।`,
      },
    });
  }

  // 4. High-Risk / Frequently Abused TLD
  if (!isIpAddress && HIGH_RISK_TLDS.has(tld)) {
    score += 22;
    indicators.push({
      id: 'high-risk-tld',
      category: 'domain',
      severity: 'medium',
      title: {
        en: `High-Abuse Top-Level Domain (.${tld})`,
        hi: `संदिग्ध/दुरुपयोग वाला डोमेन एक्सटेंशन (.${tld})`,
      },
      detail: {
        en: `The ".${tld}" extension is low-cost and heavily abused in temporary phishing campaigns.`,
        hi: `".${tld}" एक्सटेंशन का उपयोग अस्थायी फ़िशिंग और नकली अभियानों में बहुत अधिक देखा जाता है।`,
      },
    });
  }

  // 5. Unusual Subdomains
  if (subdomains.length >= 3) {
    score += 20;
    indicators.push({
      id: 'deep-subdomains',
      category: 'subdomain',
      severity: 'medium',
      title: {
        en: `Unusual Subdomain Depth (${subdomains.length} nested levels)`,
        hi: `असामान्य सबडोमेन गहराई (${subdomains.length} स्तर)`,
      },
      detail: {
        en: 'Excessively nested subdomains are often crafted to push the real registrable domain out of view on mobile screens.',
        hi: 'मोबाइल स्क्रीन पर असली डोमेन को छिपाने के लिए अक्सर कई सबडोमेन जोड़े जाते हैं।',
      },
    });
  }

  // 6. Misleading Domain / Brand Impersonation Patterns
  if (!isIpAddress) {
    const tokenize = (s: string) =>
      s.split(/[-._]+/).filter((part) => part.length > 0);
    const matchesBrand = (text: string, tokens: string[], brand: string) =>
      brand.length <= 4 ? tokens.includes(brand) : text.includes(brand);

    const subdomainText = subdomains.join('.');
    const subdomainTokens = tokenize(subdomainText);
    const regNameWithoutTld = registrableDomain.split('.')[0] ?? '';
    const regTokens = tokenize(regNameWithoutTld);
    const hostTokens = tokenize(hostname);
    const regHyphenCount = (regNameWithoutTld.match(/-/g) || []).length;

    const brandInSubdomain = BRAND_KEYWORDS.find((b) =>
      matchesBrand(subdomainText, subdomainTokens, b)
    );
    const brandInRegistrable = BRAND_KEYWORDS.find((b) =>
      matchesBrand(regNameWithoutTld, regTokens, b)
    );
    const lureInHost = LURE_KEYWORDS.filter((l) =>
      l.length <= 3 ? hostTokens.includes(l) : hostname.includes(l)
    );

    if (brandInSubdomain && !regNameWithoutTld.includes(brandInSubdomain)) {
      score += 38;
      indicators.push({
        id: 'brand-subdomain-spoof',
        category: 'misleading_pattern',
        severity: 'high',
        title: {
          en: `Brand Name "${brandInSubdomain.toUpperCase()}" Placed in Subdomain`,
          hi: `सबडोमेन में ब्रांड नाम "${brandInSubdomain.toUpperCase()}" का उपयोग`,
        },
        detail: {
          en: `The trusted keyword "${brandInSubdomain}" appears in a subdomain while the actual owning domain is "${registrableDomain}".`,
          hi: `विश्वसनीय नाम "${brandInSubdomain}" केवल सबडोमेन में है, जबकि असली डोमेन "${registrableDomain}" है।`,
        },
      });
    } else if (
      brandInRegistrable &&
      (lureInHost.length > 0 || regHyphenCount >= 1) &&
      regNameWithoutTld !== brandInRegistrable
    ) {
      score += 36;
      indicators.push({
        id: 'brand-lure-domain',
        category: 'misleading_pattern',
        severity: 'high',
        title: {
          en: 'Misleading Brand + Action Domain Pattern',
          hi: 'नकली ब्रांड और कार्रवाई शब्द वाला डोमेन',
        },
        detail: {
          en: `Combines "${brandInRegistrable}" with deceptive terms or hyphens in "${registrableDomain}"—a classic lookalike phishing pattern.`,
          hi: `"${registrableDomain}" में "${brandInRegistrable}" के साथ भ्रामक शब्द या हाइफ़न जोड़े गए हैं, जो फ़िशिंग की सामान्य पहचान है।`,
        },
      });
    } else if (regHyphenCount >= 2 || (lureInHost.length >= 2 && regHyphenCount >= 1)) {
      score += 22;
      indicators.push({
        id: 'hyphen-lure-domain',
        category: 'misleading_pattern',
        severity: 'medium',
        title: {
          en: 'Multi-Hyphen Lure Domain Structure',
          hi: 'कई हाइफ़न और प्रलोभन शब्दों वाला डोमेन',
        },
        detail: {
          en: `Domain "${registrableDomain}" stacks hyphens and urgency/action keywords (${lureInHost.join(', ') || 'multiple tokens'}).`,
          hi: `डोमेन "${registrableDomain}" में कई हाइफ़न और संदिग्ध शब्द जोड़े गए हैं।`,
        },
      });
    }
  }

  // 7. Embedded @ Credentials / Authority Confusion
  if (hasEmbeddedCredentials) {
    score += 36;
    indicators.push({
      id: 'embedded-credentials',
      category: 'structure',
      severity: 'high',
      title: {
        en: 'Embedded "@" Credentials / Authority Trick',
        hi: 'URL में "@" उपयोगकर्ता-नाम छल',
      },
      detail: {
        en: 'Everything before "@" in a URL authority is treated as a username—attackers use "https://trustedbank.com@evil.top" to deceive readers.',
        hi: 'URL में "@" से पहले का हिस्सा यूज़रनेम माना जाता है—ठग असली वेबसाइट का नाम "@" से पहले लिखकर भ्रमित करते हैं।',
      },
    });
  }

  // 8. Unencrypted HTTP (when explicitly provided)
  if (protocolProvided && parsed.protocol === 'http:' && hostname !== 'localhost') {
    score += 16;
    indicators.push({
      id: 'insecure-http',
      category: 'structure',
      severity: 'medium',
      title: {
        en: 'Unencrypted HTTP Protocol (No HTTPS)',
        hi: 'असुरक्षित HTTP प्रोटोकॉल (HTTPS नहीं)',
      },
      detail: {
        en: 'Data submitted over plain HTTP is unencrypted and inconsistent with modern banking, payment, or login portals.',
        hi: 'साधारण HTTP पर भेजा गया डेटा एन्क्रिप्टेड नहीं होता और आधुनिक बैंकिंग या लॉगिन पोर्टल इसका उपयोग नहीं करते।',
      },
    });
  }

  // 9. Non-standard port
  if (port && port !== '80' && port !== '443') {
    score += 18;
    indicators.push({
      id: 'non-standard-port',
      category: 'structure',
      severity: 'medium',
      title: {
        en: `Non-Standard Port (:${port})`,
        hi: `असामान्य नेटवर्क पोर्ट (:${port})`,
      },
      detail: {
        en: `Targets custom port :${port} rather than standard web ports (80/443), often seen in ad-hoc phishing kits.`,
        hi: `सामान्य वेब पोर्ट (80/443) के बजाय पोर्ट :${port} का उपयोग संदिग्ध होस्टिंग का संकेत हो सकता है।`,
      },
    });
  }

  // 10. Dangerous downloadable payload extension
  const lowerPath = parsed.pathname.toLowerCase();
  const matchedExt = DANGEROUS_EXTENSIONS.find((ext) => lowerPath.endsWith(ext));
  if (matchedExt) {
    score += 32;
    indicators.push({
      id: 'dangerous-extension',
      category: 'structure',
      severity: 'high',
      title: {
        en: `Direct Executable / Archive Download (${matchedExt})`,
        hi: `सीधे ऐप/फ़ाइल डाउनलोड लिंक (${matchedExt})`,
      },
      detail: {
        en: `Points directly to a "${matchedExt}" file. Malicious .apk or archive files distributed via links are a major malware vector.`,
        hi: `यह लिंक सीधे "${matchedExt}" फ़ाइल डाउनलोड करता है। अनजान लिंक से .apk या ज़िप फ़ाइलें मैलवेयर हो सकती हैं।`,
      },
    });
  }

  // 11. Suspicious path/query lures or embedded redirect parameters
  const lowerFullPath = `${parsed.pathname}${parsed.search}`.toLowerCase();
  const hasEmbeddedRedirect =
    /https?:\/\//i.test(parsed.search) ||
    ['redirect', 'next', 'url', 'target', 'dest', 'returnurl'].some((p) =>
      parsed.searchParams.has(p)
    );
  if (hasEmbeddedRedirect) {
    score += 15;
    indicators.push({
      id: 'embedded-redirect',
      category: 'structure',
      severity: 'medium',
      title: {
        en: 'Open-Redirect / Chained URL Parameter',
        hi: 'रीडायरेक्ट URL पैरामीटर मौजूद',
      },
      detail: {
        en: 'Query parameters contain redirect instructions that can bounce visitors to another unverified domain.',
        hi: 'URL पैरामीटर में रीडायरेक्ट निर्देश हैं जो उपयोगकर्ता को किसी अन्य वेबसाइट पर भेज सकते हैं।',
      },
    });
  }

  const pathLures = LURE_KEYWORDS.filter((k) => lowerFullPath.includes(k));
  if (pathLures.length > 0 && !tld.endsWith('gov') && !registrableDomain.endsWith('.gov.in')) {
    score += Math.min(18, pathLures.length * 8);
    indicators.push({
      id: 'lure-path-keywords',
      category: 'structure',
      severity: 'low',
      title: {
        en: 'Sensitive Action Keywords in URL Path',
        hi: 'URL पथ में संवेदनशील/कार्रवाई शब्द',
      },
      detail: {
        en: `Path or query contains sensitive terms (${pathLures.slice(0, 4).join(', ')}). Verify the owning domain carefully before submitting data.`,
        hi: `URL पथ में (${pathLures.slice(0, 4).join(', ')}) जैसे शब्द हैं। कोई भी विवरण भरने से पहले मुख्य डोमेन की पुष्टि करें।`,
      },
    });
  }

  if (parsed.href.length > 130) {
    score += 10;
    indicators.push({
      id: 'excessive-length',
      category: 'structure',
      severity: 'low',
      title: {
        en: `Unusually Long URL (${parsed.href.length} characters)`,
        hi: `असामान्य रूप से लंबा URL (${parsed.href.length} अक्षर)`,
      },
      detail: {
        en: 'Long URLs with dense query parameters are sometimes used to obscure tracking or deceptive payloads.',
        hi: 'बहुत लंबे URL कभी-कभी संदिग्ध पैरामीटर या ट्रैकिंग कोड छिपाने के लिए उपयोग किए जाते हैं।',
      },
    });
  }

  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  return { facts, indicators, heuristicScore: clampedScore };
}

export interface ReputationLookupClient {
  checkUrl: (normalizedUrl: string) => Promise<UrlReputationResult>;
}

/**
 * Checks Google Safe Browsing Lookup API v4 without ever visiting or fetching the target URL.
 */
export function createSafeBrowsingClient(): ReputationLookupClient {
  return {
    async checkUrl(normalizedUrl: string): Promise<UrlReputationResult> {
      const apiKey = getSafeBrowsingApiKey();
      if (!apiKey) {
        return {
          provider: 'Google Safe Browsing v4',
          configured: false,
          status: 'not_configured',
          threatTypes: [],
          summary: {
            en: 'External URL reputation API is not configured. Only local structural heuristics were evaluated.',
            hi: 'बाहरी URL प्रतिष्ठा API कॉन्फ़िगर नहीं है। केवल स्थानीय संरचनात्मक नियम (heuristics) चलाए गए हैं।',
          },
        };
      }

      const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(apiKey)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            client: {
              clientId: 'scamshield-ai',
              clientVersion: '1.0.0',
            },
            threatInfo: {
              threatTypes: [
                'MALWARE',
                'SOCIAL_ENGINEERING',
                'UNWANTED_SOFTWARE',
                'POTENTIALLY_HARMFUL_APPLICATION',
              ],
              platformTypes: ['ANY_PLATFORM'],
              threatEntryTypes: ['URL'],
              threatEntries: [{ url: normalizedUrl }],
            },
          }),
        });

        if (!res.ok) {
          return {
            provider: 'Google Safe Browsing v4',
            configured: true,
            status: 'error',
            threatTypes: [],
            errorDetail: `Safe Browsing API returned HTTP ${res.status}.`,
            summary: {
              en: `Reputation lookup failed (HTTP ${res.status}). Heuristic findings are shown below, but external reputation could not be verified.`,
              hi: `बाहरी प्रतिष्ठा जाँच विफल रही (HTTP ${res.status})। नीचे केवल स्थानीय पैटर्न जाँच दिखाई गई है।`,
            },
          };
        }

        const data = (await res.json()) as {
          matches?: Array<{ threatType?: string }>;
        };

        const threatTypes = Array.from(
          new Set(
            (data.matches ?? [])
              .map((m) => m.threatType)
              .filter((t): t is string => Boolean(t))
          )
        );

        if (threatTypes.length > 0) {
          return {
            provider: 'Google Safe Browsing v4',
            configured: true,
            status: 'threat_found',
            threatTypes,
            summary: {
              en: `External reputation match found: ${threatTypes.join(', ')}. Do not open this link.`,
              hi: `बाहरी थ्रेट डेटाबेस में चेतावनी मिली: ${threatTypes.join(', ')}। इस लिंक को बिल्कुल न खोलें।`,
            },
          };
        }

        return {
          provider: 'Google Safe Browsing v4',
          configured: true,
          status: 'no_match_found',
          threatTypes: [],
          summary: {
            en: 'No threat-list matches found in Google Safe Browsing. Note: brand-new or targeted phishing links may not be indexed yet.',
            hi: 'Google Safe Browsing सूची में कोई ज्ञात थ्रेट नहीं मिला। ध्यान दें: बिल्कुल नए फ़िशिंग लिंक अभी सूचीबद्ध न हुए हों, यह संभव है।',
          },
        };
      } catch (err) {
        const msg =
          err instanceof Error && err.name === 'AbortError'
            ? 'Reputation API request timed out.'
            : 'Network error contacting reputation API.';
        return {
          provider: 'Google Safe Browsing v4',
          configured: true,
          status: 'error',
          threatTypes: [],
          errorDetail: msg,
          summary: {
            en: `${msg} Only local structural heuristics were completed.`,
            hi: `${msg} केवल स्थानीय संरचनात्मक जाँच पूरी हो सकी।`,
          },
        };
      } finally {
        clearTimeout(timeoutId);
      }
    },
  };
}

export async function analyzeUrlSafely(
  rawUrl: string,
  reputationClient: ReputationLookupClient = createSafeBrowsingClient()
): Promise<UrlAnalysisResult> {
  const { facts, indicators, heuristicScore } = analyzeUrlHeuristics(rawUrl);
  const reputation = await reputationClient.checkUrl(facts.normalizedUrl);

  const combinedIndicators = [...indicators];
  let finalScore = heuristicScore;

  if (reputation.status === 'threat_found') {
    finalScore = Math.max(92, heuristicScore);
    combinedIndicators.unshift({
      id: 'reputation-match',
      category: 'reputation',
      severity: 'high',
      title: {
        en: `Reputation Flagged: ${reputation.threatTypes.join(', ')}`,
        hi: `थ्रेट डेटाबेस चेतावनी: ${reputation.threatTypes.join(', ')}`,
      },
      detail: reputation.summary,
    });
  }

  const riskLevel: 'Low' | 'Medium' | 'High' =
    finalScore >= 60 ? 'High' : finalScore >= 25 ? 'Medium' : 'Low';

  let verdictTitle: BilingualText;
  let explanation: BilingualText;

  if (riskLevel === 'High') {
    verdictTitle = {
      en: 'High Risk Indicators Detected',
      hi: 'उच्च जोखिम वाले संकेत मिले',
    };
    explanation = {
      en: 'This URL exhibits strong phishing, spoofing, or threat indicators. Do not visit this address or enter any credentials.',
      hi: 'इस URL में फ़िशिंग, नकल या गंभीर खतरे के स्पष्ट संकेत मिले हैं। इस लिंक को न खोलें और न ही कोई जानकारी दर्ज करें।',
    };
  } else if (riskLevel === 'Medium') {
    verdictTitle = {
      en: 'Suspicious Structural Patterns Detected',
      hi: 'संदिग्ध संरचनात्मक संकेत मिले',
    };
    explanation = {
      en: 'One or more cautionary patterns (such as URL shortening, insecure HTTP, or suspicious domain structure) were found. Verify the source independently before trusting it.',
      hi: 'इस लिंक में कुछ संदिग्ध संकेत (जैसे शॉर्ट URL, असुरक्षित HTTP या असामान्य डोमेन) मिले हैं। भरोसा करने से पहले स्वतंत्र रूप से पुष्टि करें।',
    };
  } else {
    verdictTitle = {
      en: 'No Suspicious Patterns Detected (Not Guaranteed Safe)',
      hi: 'कोई संदिग्ध पैटर्न नहीं मिला (सुरक्षित होने की गारंटी नहीं)',
    };
    explanation = {
      en:
        reputation.status === 'no_match_found'
          ? 'No suspicious structural patterns were detected and no threat-list match was returned. However, newly registered or targeted scam sites can still evade automated checks.'
          : 'No suspicious structural patterns were found by local heuristics. Because external reputation verification is unavailable or incomplete, absence of patterns does not prove this URL is safe.',
      hi:
        reputation.status === 'no_match_found'
          ? 'स्थानीय जाँच में कोई संदिग्ध पैटर्न नहीं मिला और प्रतिष्ठा सूची में भी कोई मैच नहीं मिला। फिर भी, बिल्कुल नई या लक्षित फ़िशिंग साइटें जाँच से बच सकती हैं।'
          : 'स्थानीय नियम-आधारित जाँच में कोई संदिग्ध पैटर्न नहीं मिला। चूँकि बाहरी प्रतिष्ठा जाँच उपलब्ध नहीं है, इसलिए केवल पैटर्न न मिलने से यह URL सुरक्षित साबित नहीं होता।',
    };
  }

  const safetyDisclaimer: BilingualText = {
    en: 'Safety Notice: ScamShield AI inspects URL text structure (and external reputation lists when configured) without ever visiting or loading the target page. Never rely solely on pattern checks for unfamiliar links.',
    hi: 'सुरक्षा सूचना: ScamShield AI बिना लक्ष्य वेबसाइट को खोले या लोड किए केवल URL संरचना (और कॉन्फ़िगर होने पर बाहरी प्रतिष्ठा सूची) की जाँच करता है। अनजान लिंक के लिए केवल पैटर्न जाँच पर निर्भर न रहें।',
  };

  const safetyRecommendations =
    riskLevel === 'High'
      ? {
          en: [
            'Do not click, open, or forward this URL.',
            'If it claims to be from a bank, government office, or courier, open their official app or type their known domain manually.',
            'Never enter OTPs, UPI PINs, passwords, or card details on links received via SMS or chat.',
          ],
          hi: [
            'इस URL पर क्लिक न करें, इसे न खोलें और न ही आगे भेजें।',
            'यदि यह बैंक, सरकारी विभाग या कूरियर का दावा करता है, तो आधिकारिक ऐप खोलें या सही वेबसाइट पता स्वयं टाइप करें।',
            'SMS या चैट पर आए लिंक पर कभी भी OTP, UPI PIN, पासवर्ड या कार्ड विवरण न डालें।',
          ],
        }
      : riskLevel === 'Medium'
        ? {
            en: [
              'Avoid logging in or making payments until you verify the sender through an official channel.',
              'If this is a shortened URL, ask the sender for the full official domain before clicking.',
              'Check the exact spelling of the main domain name carefully.',
            ],
            hi: [
              'आधिकारिक माध्यम से प्रेषक की पुष्टि किए बिना लॉगिन या भुगतान न करें।',
              'यदि यह शॉर्ट URL है, तो क्लिक करने से पहले प्रेषक से पूरा आधिकारिक डोमेन पूछें।',
              'मुख्य डोमेन नाम की सही स्पेलिंग ध्यान से जाँचें।',
            ],
          }
        : {
            en: [
              'Absence of suspicious URL patterns does not guarantee safety—always verify who sent the link and why.',
              'Confirm the exact domain spelling in your browser address bar before entering passwords or OTPs.',
              'Prefer navigating to banking and payment portals via official bookmarks or apps.',
            ],
            hi: [
              'संदिग्ध पैटर्न न मिलने का मतलब सुरक्षित होने की गारंटी नहीं है—हमेशा जाँचें कि लिंक किसने और क्यों भेजा है।',
              'पासवर्ड या OTP डालने से पहले ब्राउज़र एड्रेस बार में डोमेन की सही स्पेलिंग अवश्य देखें।',
              'बैंकिंग और भुगतान सेवाओं के लिए हमेशा आधिकारिक बुकमार्क या ऐप का उपयोग करें।',
            ],
          };

  return {
    riskLevel,
    riskScore: finalScore,
    heuristicScore,
    verdictTitle,
    explanation,
    safetyDisclaimer,
    facts,
    indicators: combinedIndicators,
    reputation,
    safetyRecommendations,
  };
}

