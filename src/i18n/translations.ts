import type { Language } from '../types.js';

export const translations = {
  brand: {
    name: 'ScamShield AI',
    tagline: {
      en: 'Digital Fraud & Phishing Defense',
      hi: 'डिजिटल फ्रॉड और फ़िशिंग सुरक्षा',
    },
    phaseBadge: {
      en: 'AI Scam & URL Defense',
      hi: 'AI स्कैम और URL सुरक्षा',
    },
  },
  nav: {
    home: { en: 'Home', hi: 'होम' },
    messageScanner: { en: 'Message Scanner', hi: 'मैसेज स्कैनर' },
    urlScanner: { en: 'URL Scanner', hi: 'URL स्कैनर' },
    awareness: { en: 'Scam Awareness', hi: 'स्कैम जागरूकता' },
    about: { en: 'About', hi: 'हमारे बारे में' },
    launchScanner: { en: 'Try Scanner', hi: 'स्कैनर आज़माएँ' },
    primaryAria: { en: 'Primary navigation', hi: 'मुख्य नेविगेशन' },
    languageAria: { en: 'Language switcher', hi: 'भाषा बदलें' },
    menuAria: { en: 'Toggle navigation menu', hi: 'मेनू खोलें या बंद करें' },
  },
  hero: {
    pill: {
      en: 'AI-Powered Scam Defense • Bilingual EN / हिन्दी',
      hi: 'AI-सक्षम स्कैम सुरक्षा • द्विभाषी EN / हिन्दी',
    },
    titleLead: {
      en: 'Detect Scams & Phishing',
      hi: 'स्कैम और फ़िशिंग को पहचानें',
    },
    titleHighlight: {
      en: 'Before You Click or Pay.',
      hi: 'क्लिक या भुगतान करने से पहले।',
    },
    subtitle: {
      en: 'ScamShield AI is a modern cybersecurity workspace designed to inspect suspicious SMS, WhatsApp messages, emails, and deceptive URLs—empowering everyday users with clear threat signals in English and Hindi.',
      hi: 'ScamShield AI एक आधुनिक साइबर सुरक्षा प्लेटफ़ॉर्म है जिसे संदिग्ध SMS, WhatsApp संदेशों, ईमेल और फ़र्ज़ी लिंक की जाँच के लिए बनाया गया है—ताकि हर उपयोगकर्ता हिंदी और अंग्रेज़ी में स्पष्ट चेतावनी पा सके।',
    },
    ctaPrimary: {
      en: 'Scan a Message',
      hi: 'मैसेज स्कैन करें',
    },
    ctaSecondary: {
      en: 'Check a Suspicious URL',
      hi: 'संदिग्ध URL जाँचें',
    },
    ctaAwareness: {
      en: 'Explore Scam Patterns',
      hi: 'स्कैम के तरीके जानें',
    },
    previewCardTitle: {
      en: 'Sample Threat Telemetry UI',
      hi: 'सैंपल थ्रेट टेलीमेट्री UI',
    },
    previewDemoTag: {
      en: 'DEMO PREVIEW',
      hi: 'डेमो प्रीव्यू',
    },
    previewMessageSnippet: {
      en: '"Dear customer, your KYC is expired. Update immediately at http://sbi-kyc-verify.top or account will be blocked in 2 hrs."',
      hi: '"प्रिय ग्राहक, आपका KYC समाप्त हो गया है। खाता बंद होने से बचाने के लिए तुरंत http://sbi-kyc-verify.top पर अपडेट करें।"',
    },
    previewSignal1: {
      en: 'Artificial 2-hour urgency detected',
      hi: '2 घंटे की नकली जल्दबाज़ी का संकेत',
    },
    previewSignal2: {
      en: 'Unverified lookalike .top domain',
      hi: 'असली बैंक जैसा नकली .top लिंक',
    },
    previewSignal3: {
      en: 'Credential harvesting pattern',
      hi: 'खाता जानकारी चुराने का तरीका',
    },
    previewTagHigh: { en: 'HIGH', hi: 'उच्च' },
    previewTagSample: { en: 'SAMPLE', hi: 'सैंपल' },
  },
  stats: {
    title: {
      en: 'Built for Modern Digital Fraud Defense',
      hi: 'आधुनिक डिजिटल धोखाधड़ी से सुरक्षा के लिए निर्मित',
    },
    items: [
      {
        value: { en: '2 Scanners', hi: '2 स्कैनर' },
        label: {
          en: 'Message & URL Protection',
          hi: 'मैसेज और URL जाँच',
        },
        sub: {
          en: 'SMS, WhatsApp, Email & Web Links',
          hi: 'SMS, WhatsApp, ईमेल और वेब लिंक',
        },
      },
      {
        value: { en: 'EN + हिं', hi: 'EN + हिं' },
        label: {
          en: 'Bilingual Accessibility',
          hi: 'दोनों भाषाओं में आसान उपयोग',
        },
        sub: {
          en: 'Instant English & Hindi UI toggle',
          hi: 'एक क्लिक में अंग्रेज़ी और हिंदी बदलें',
        },
      },
      {
        value: { en: '1930', hi: '1930' },
        label: {
          en: 'Cyber Helpline Ready',
          hi: 'साइबर हेल्पलाइन जानकारी',
        },
        sub: {
          en: 'Actionable Indian cyber safety steps',
          hi: 'ठगी होने पर तुरंत उठाने वाले कदम',
        },
      },
      {
        value: { en: 'AI + URL', hi: 'AI + URL' },
        label: {
          en: 'Backend Scam Defense',
          hi: 'सुरक्षित बैकएंड स्कैम जाँच',
        },
        sub: {
          en: 'AI message scan & zero-visit URL check',
          hi: 'AI मैसेज स्कैन और सुरक्षित लिंक जाँच',
        },
      },
    ],
  },
  howItWorks: {
    badge: { en: 'WORKFLOW ARCHITECTURE', hi: 'कार्यप्रणाली' },
    title: {
      en: 'How ScamShield AI Protects Users',
      hi: 'ScamShield AI उपयोगकर्ताओं की रक्षा कैसे करता है',
    },
    subtitle: {
      en: 'A streamlined three-step defense pipeline designed for speed, clarity, and zero technical jargon.',
      hi: 'तेज़, स्पष्ट और बिना किसी तकनीकी जटिलता के तीन-चरणीय सुरक्षा प्रक्रिया।',
    },
    steps: [
      {
        step: '01',
        title: { en: 'Paste Message or URL', hi: 'संदेश या लिंक पेस्ट करें' },
        desc: {
          en: 'Drop in any suspicious SMS, WhatsApp forward, job offer email, or unfamiliar payment/KYC link.',
          hi: 'कोई भी संदिग्ध SMS, WhatsApp मैसेज, नौकरी का ईमेल या अनजान भुगतान/KYC लिंक पेस्ट करें।',
        },
      },
      {
        step: '02',
        title: { en: 'Multi-Signal Inspection', hi: 'बहु-स्तरीय संकेत जाँच' },
        desc: {
          en: 'Backend AI analysis evaluates urgency tactics, fake rewards, impersonation, OTP traps, and phishing cues.',
          hi: 'बैकएंड AI विश्लेषण तात्कालिकता की चाल, नकली इनाम, नकल, OTP जाल और फ़िशिंग संकेतों की जाँच करता है।',
        },
      },
      {
        step: '03',
        title: { en: 'Clear Actionable Verdict', hi: 'स्पष्ट सुरक्षा सलाह' },
        desc: {
          en: 'Receive a human-friendly risk gauge, highlighted red flags, and immediate steps to stay safe.',
          hi: 'सरल रिस्क मीटर, प्रमुख खतरे के संकेत और सुरक्षित रहने के तुरंत कदम प्राप्त करें।',
        },
      },
    ],
  },
  features: {
    badge: { en: 'PLATFORM MODULES', hi: 'प्लेटफ़ॉर्म मॉड्यूल' },
    title: {
      en: 'Cybersecurity Dashboard Capabilities',
      hi: 'साइबर सुरक्षा डैशबोर्ड की प्रमुख क्षमताएँ',
    },
    cards: [
      {
        title: { en: 'Message Threat Scanner', hi: 'मैसेज थ्रेट स्कैनर' },
        desc: {
          en: 'Backend AI-powered inspection for SMS, WhatsApp, and email lures with red flags and risk scoring.',
          hi: 'SMS, WhatsApp और ईमेल धोखाधड़ी की जाँच के लिए बैकएंड AI रिस्क स्कोर और चेतावनी विवरण।',
        },
        cta: { en: 'Open Message Scanner', hi: 'मैसेज स्कैनर खोलें' },
        route: 'message-scanner' as const,
      },
      {
        title: { en: 'Deep URL Inspector', hi: 'सुरक्षित URL स्कैनर' },
        desc: {
          en: 'Checks suspicious domains, subdomains, IP links, lookalike spoofing, and optional threat-reputation lookups without opening the link.',
          hi: 'लिंक को खोले बिना संदिग्ध डोमेन, सबडोमेन, IP लिंक, नकली वेबसाइट पैटर्न और बाहरी थ्रेट सूची की जाँच करता है।',
        },
        cta: { en: 'Open URL Scanner', hi: 'URL स्कैनर खोलें' },
        route: 'url-scanner' as const,
      },
      {
        title: { en: 'Scam Awareness Hub', hi: 'स्कैम जागरूकता केंद्र' },
        desc: {
          en: 'Interactive guide to UPI fraud, digital arrest scams, phishing links, and an interactive Red Flag checklist.',
          hi: 'UPI फ्रॉड, डिजिटल अरेस्ट, फ़िशिंग लिंक और इंटरैक्टिव चेतावनी चेकलिस्ट की मार्गदर्शिका।',
        },
        cta: { en: 'Learn Scam Tactics', hi: 'स्कैम तरीके समझें' },
        route: 'awareness' as const,
      },
    ],
  },
  messageScanner: {
    badge: { en: 'PHASE 2 • AI MESSAGE ANALYSIS', hi: 'चरण 2 • AI मैसेज विश्लेषण' },
    title: {
      en: 'AI Message Scam Scanner',
      hi: 'AI मैसेज स्कैम स्कैनर',
    },
    subtitle: {
      en: 'Paste any suspicious SMS, WhatsApp message, email, or text below. Our secure backend AI checks for scam patterns, urgency, impersonation, OTP theft, and phishing cues.',
      hi: 'नीचे कोई भी संदिग्ध SMS, WhatsApp संदेश, ईमेल या टेक्स्ट पेस्ट करें। हमारा सुरक्षित बैकएंड AI स्कैम पैटर्न, जल्दबाज़ी, नकल, OTP चोरी और फ़िशिंग संकेतों की जाँच करता है।',
    },
    statusChecking: {
      en: 'Checking backend AI status...',
      hi: 'बैकएंड AI स्थिति जाँची जा रही है...',
    },
    statusConnected: {
      en: 'Live AI Backend Ready',
      hi: 'लाइव AI बैकएंड तैयार है',
    },
    statusNotConfigured: {
      en: 'AI Key Not Configured (Setup Required)',
      hi: 'AI कुंजी कॉन्फ़िगर नहीं है (सेटअप आवश्यक)',
    },
    statusOffline: {
      en: 'Backend Server Offline',
      hi: 'बैकएंड सर्वर ऑफ़लाइन है',
    },
    channelLabel: { en: 'Message Source', hi: 'संदेश का माध्यम' },
    channelOther: { en: 'Other', hi: 'अन्य' },
    samplesLabel: { en: 'Fill Test Text:', hi: 'टेस्ट संदेश भरें:' },
    textareaLabel: { en: 'Suspicious Message Content', hi: 'संदिग्ध संदेश सामग्री' },
    textareaPlaceholder: {
      en: 'Paste the SMS, WhatsApp message, email, or other suspicious text here...',
      hi: 'जिस SMS, WhatsApp संदेश, ईमेल या अन्य टेक्स्ट की जाँच करनी है, उसे यहाँ पेस्ट करें...',
    },
    scanButton: { en: 'Scan Message', hi: 'मैसेज स्कैन करें' },
    scanningButton: { en: 'Analyzing with AI...', hi: 'AI से विश्लेषण हो रहा है...' },
    clearButton: { en: 'Clear', hi: 'साफ़ करें' },
    charCount: { en: 'characters', hi: 'अक्षर' },
    emptyInputError: {
      en: 'Please paste or type a message before scanning.',
      hi: 'स्कैन करने से पहले कृपया कोई संदेश पेस्ट या टाइप करें।',
    },
    tooLongError: {
      en: 'Message exceeds the 5,000-character limit. Please shorten it and try again.',
      hi: 'संदेश 5,000 अक्षरों की सीमा से अधिक है। कृपया इसे छोटा करके पुनः प्रयास करें।',
    },
    resultHeader: { en: 'AI Risk Assessment Report', hi: 'AI जोखिम मूल्यांकन रिपोर्ट' },
    liveAiBadge: { en: 'LIVE AI ANALYSIS', hi: 'लाइव AI विश्लेषण' },
    riskScoreLabel: { en: 'Risk Score', hi: 'रिस्क स्कोर' },
    patternMatrixTitle: {
      en: 'Threat Pattern Checklist',
      hi: 'खतरे के पैटर्न की जाँच',
    },
    patternDetected: { en: 'Detected', hi: 'पाया गया' },
    patternClear: { en: 'Not Detected', hi: 'नहीं मिला' },
    patterns: {
      urgency: { en: 'Urgency / Panic', hi: 'तात्कालिकता / डर' },
      fakeRewards: { en: 'Fake Rewards / Prizes', hi: 'नकली इनाम / कैशबैक' },
      impersonation: { en: 'Brand / Official Impersonation', hi: 'नकली पहचान / ब्रांड' },
      otpRequest: { en: 'OTP / Credential Request', hi: 'OTP / गोपनीय जानकारी माँग' },
      suspiciousPayment: { en: 'Suspicious Payment / QR', hi: 'संदिग्ध भुगतान / QR' },
      phishingIndicators: { en: 'Phishing Links / Lures', hi: 'फ़िशिंग लिंक / संकेत' },
    },
    reasonsTitle: {
      en: 'Reasons for Risk Assessment',
      hi: 'जोखिम आकलन के प्रमुख कारण',
    },
    redFlagsTitle: {
      en: 'Detected Red Flags',
      hi: 'पहचाने गए खतरे के संकेत (Red Flags)',
    },
    noRedFlags: {
      en: 'No major scam red flags were identified in this message.',
      hi: 'इस संदेश में कोई बड़ा स्कैम संकेत नहीं पाया गया।',
    },
    phrasesTitle: { en: 'Suspicious Phrases', hi: 'संदिग्ध वाक्यांश' },
    noPhrasesText: {
      en: 'No specific suspicious phrases were flagged.',
      hi: 'कोई विशेष संदिग्ध वाक्यांश चिह्नित नहीं किया गया।',
    },
    aiDisclaimer: {
      en: 'AI Accuracy Notice: AI scam predictions are probabilistic and not guaranteed. False positives or false negatives can occur—always verify financial, KYC, or urgent requests via official channels.',
      hi: 'AI सटीकता सूचना: AI द्वारा दिया गया स्कैम विश्लेषण केवल संभावित आकलन है और 100% गारंटी नहीं है। हमेशा वित्तीय, KYC या जल्दबाज़ी वाले अनुरोधों की आधिकारिक माध्यम से पुष्टि करें।',
    },
    timeoutError: {
      en: 'The AI analysis request timed out. Please try again in a moment.',
      hi: 'AI विश्लेषण अनुरोध का समय समाप्त हो गया। कृपया कुछ देर बाद पुनः प्रयास करें।',
    },
    actionTitle: {
      en: 'Practical Safety Recommendations',
      hi: 'व्यावहारिक सुरक्षा सुझाव',
    },
    idleTitle: { en: 'Ready to Analyze Message', hi: 'संदेश विश्लेषण के लिए तैयार' },
    idleDesc: {
      en: 'Paste a suspicious SMS, WhatsApp forward, or email on the left (or click a test snippet) and press "Scan Message" for live backend AI evaluation.',
      hi: 'बाएँ ओर कोई संदिग्ध SMS, WhatsApp संदेश या ईमेल पेस्ट करें और लाइव AI जाँच के लिए "मैसेज स्कैन करें" दबाएँ।',
    },
    errorTitle: {
      en: 'Analysis Could Not Be Completed',
      hi: 'विश्लेषण पूरा नहीं हो सका',
    },
    setupGuideTitle: {
      en: 'Backend AI Setup Required (No Fake Results Shown)',
      hi: 'बैकएंड AI सेटअप आवश्यक (कोई नकली परिणाम नहीं दिखाया गया)',
    },
    setupGuideBody: {
      en: 'ScamShield AI will never fabricate AI verdicts. To enable real message scanning, create a .env file in the project root with your Gemini API key and start the backend server:',
      hi: 'ScamShield AI कभी भी नकली AI परिणाम नहीं दिखाता। वास्तविक मैसेज स्कैनिंग शुरू करने के लिए प्रोजेक्ट रूट में .env फ़ाइल बनाएँ और अपनी Gemini API कुंजी जोड़ें:',
    },
    retryStatusButton: {
      en: 'Re-check Backend Status',
      hi: 'बैकएंड स्थिति फिर जाँचें',
    },
  },
  urlScanner: {
    badge: { en: 'PHASE 3 • SAFE URL INSPECTION', hi: 'चरण 3 • सुरक्षित URL जाँच' },
    title: {
      en: 'URL Scam & Pattern Scanner',
      hi: 'URL स्कैम और पैटर्न स्कैनर',
    },
    subtitle: {
      en: 'Inspect suspicious links safely without ever opening or visiting them. Separates local structural heuristics from external threat-reputation lookups.',
      hi: 'किसी भी संदिग्ध लिंक को खोले बिना सुरक्षित रूप से जाँचें। स्थानीय संरचनात्मक जाँच और बाहरी प्रतिष्ठा जाँच को स्पष्ट रूप से अलग दिखाया जाता है।',
    },
    statusChecking: {
      en: 'Checking URL inspection backend...',
      hi: 'URL जाँच बैकएंड स्थिति देखी जा रही है...',
    },
    statusReputationReady: {
      en: 'Heuristics + Reputation API Ready',
      hi: 'हीयूरिस्टिक्स + प्रतिष्ठा API तैयार',
    },
    statusHeuristicsOnly: {
      en: 'Local Heuristics Ready • Reputation API Not Configured',
      hi: 'स्थानीय जाँच तैयार • बाहरी प्रतिष्ठा API कॉन्फ़िगर नहीं',
    },
    statusOffline: {
      en: 'Backend Server Offline',
      hi: 'बैकएंड सर्वर ऑफ़लाइन है',
    },
    safeInspectionNotice: {
      en: 'Zero-Visit Guarantee: ScamShield never fetches, opens, or loads the URL you enter.',
      hi: 'शून्य-विज़िट सुरक्षा: ScamShield आपके द्वारा दर्ज URL को कभी खोलता या लोड नहीं करता।',
    },
    inputLabel: { en: 'URL to Inspect', hi: 'जाँचने के लिए URL दर्ज करें' },
    inputPlaceholder: {
      en: 'https://example-login-verify.com/kyc',
      hi: 'https://example-login-verify.com/kyc',
    },
    samplesLabel: { en: 'Fill Test URL:', hi: 'टेस्ट URL भरें:' },
    scanButton: { en: 'Inspect URL', hi: 'URL जाँचें' },
    scanningButton: { en: 'Inspecting URL Structure...', hi: 'URL संरचना जाँची जा रही है...' },
    clearButton: { en: 'Reset', hi: 'रीसेट' },
    emptyUrlError: {
      en: 'Please enter a URL before inspecting.',
      hi: 'जाँचने से पहले कृपया एक URL दर्ज करें।',
    },
    invalidUrlError: {
      en: 'Please enter a valid http:// or https:// web address (no spaces).',
      hi: 'कृपया एक मान्य http:// या https:// वेब पता दर्ज करें (बिना स्पेस)।',
    },
    resultHeader: { en: 'URL Inspection Report', hi: 'URL जाँच रिपोर्ट' },
    riskScoreLabel: { en: 'Risk Score', hi: 'रिस्क स्कोर' },
    heuristicSectionTitle: {
      en: '1. Local Heuristic & Structural Analysis',
      hi: '1. स्थानीय संरचनात्मक और पैटर्न जाँच',
    },
    heuristicSectionBadge: {
      en: 'LEXICAL INSPECTION',
      hi: 'संरचनात्मक जाँच',
    },
    reputationSectionTitle: {
      en: '2. External Reputation Check',
      hi: '2. बाहरी थ्रेट प्रतिष्ठा जाँच',
    },
    reputationNotConfigured: {
      en: 'NOT CONFIGURED',
      hi: 'कॉन्फ़िगर नहीं',
    },
    reputationClean: {
      en: 'NO MATCH FOUND',
      hi: 'कोई मैच नहीं मिला',
    },
    reputationThreat: {
      en: 'THREAT MATCHED',
      hi: 'थ्रेट पाया गया',
    },
    reputationError: {
      en: 'LOOKUP ERROR',
      hi: 'जाँच त्रुटि',
    },
    reputationSetupHint: {
      en: 'To enable live threat-list reputation checks, add GOOGLE_SAFE_BROWSING_API_KEY to your backend .env file and restart the server.',
      hi: 'लाइव थ्रेट सूची जाँच सक्रिय करने के लिए बैकएंड .env फ़ाइल में GOOGLE_SAFE_BROWSING_API_KEY जोड़ें और सर्वर पुनः प्रारंभ करें।',
    },
    factsLabels: {
      normalized: { en: 'Inspected URL (Not Opened)', hi: 'जाँचा गया URL (खोला नहीं गया)' },
      domain: { en: 'Registrable Domain', hi: 'मुख्य डोमेन' },
      protocol: { en: 'Protocol', hi: 'प्रोटोकॉल' },
      subdomains: { en: 'Subdomain Levels', hi: 'सबडोमेन स्तर' },
      ipCheck: { en: 'IP-Based Host', hi: 'IP-आधारित होस्ट' },
      idnCheck: { en: 'Punycode / IDN', hi: 'Punycode / IDN' },
      atTrick: { en: '"@" Authority Trick', hi: '"@" छल जाँच' },
      port: { en: 'Custom Port', hi: 'कस्टम पोर्ट' },
    },
    indicatorsTitle: {
      en: 'Detected Structural & Pattern Indicators',
      hi: 'पहचाने गए संरचनात्मक और पैटर्न संकेत',
    },
    noIndicatorsTitle: {
      en: 'No Suspicious Structural Patterns Flagged',
      hi: 'कोई संदिग्ध संरचनात्मक पैटर्न नहीं मिला',
    },
    noIndicatorsNote: {
      en: 'No suspicious domain, subdomain, IP, or URL structure anomalies were detected locally. This does NOT guarantee the destination website is safe.',
      hi: 'स्थानीय जाँच में कोई संदिग्ध डोमेन, सबडोमेन, IP या URL संरचना संकेत नहीं मिला। इसका अर्थ यह नहीं है कि वेबसाइट पूरी तरह सुरक्षित है।',
    },
    actionTitle: {
      en: 'Practical Safety Recommendations',
      hi: 'व्यावहारिक सुरक्षा सुझाव',
    },
    idleTitle: { en: 'Enter a URL to Run Safe Inspection', hi: 'सुरक्षित जाँच के लिए URL दर्ज करें' },
    idleDesc: {
      en: 'Paste any suspicious link above or pick a test URL to inspect domain patterns, subdomains, IP hosts, and URL structure without visiting the page.',
      hi: 'पेज को खोले बिना डोमेन पैटर्न, सबडोमेन, IP होस्ट और URL संरचना की जाँच करने के लिए ऊपर कोई लिंक दर्ज करें।',
    },
    errorTitle: {
      en: 'URL Inspection Failed',
      hi: 'URL जाँच विफल रही',
    },
  },
  awareness: {
    badge: { en: 'CYBER HYGIENE & EDUCATION', hi: 'साइबर सुरक्षा शिक्षा' },
    title: {
      en: 'Scam Awareness & Cyber Safety Guide',
      hi: 'स्कैम जागरूकता और साइबर सुरक्षा गाइड',
    },
    subtitle: {
      en: 'Learn how common digital scams work, spot early warning signs, and follow practical steps to protect your money and personal data.',
      hi: 'जानें कि आम डिजिटल स्कैम कैसे काम करते हैं, शुरुआती चेतावनी संकेतों को पहचानें और अपने पैसे व डेटा को सुरक्षित रखें।',
    },
    searchPlaceholder: {
      en: 'Search scam topics (e.g., OTP, UPI, job, email, link)...',
      hi: 'स्कैम विषय खोजें (जैसे OTP, UPI, नौकरी, ईमेल, लिंक)...',
    },
    filterAll: { en: 'All Topics', hi: 'सभी विषय' },
    filterFinancial: { en: 'OTP, UPI & Lottery', hi: 'OTP, UPI और लॉटरी' },
    filterLinks: { en: 'Emails & Links', hi: 'ईमेल और लिंक' },
    filterImpersonation: { en: 'Jobs, Support & Traps', hi: 'नौकरी, सपोर्ट और चाल' },
    expandAll: { en: 'Expand All', hi: 'सभी खोलें' },
    collapseAll: { en: 'Collapse All', hi: 'सभी बंद करें' },
    warningSignsHeading: { en: 'Warning Signs', hi: 'चेतावनी के संकेत' },
    preventionTipsHeading: { en: 'Prevention Tips', hi: 'बचाव के उपाय' },
    showExample: { en: 'View Example Scam Lure', hi: 'नकली संदेश का उदाहरण देखें' },
    hideExample: { en: 'Hide Example', hi: 'उदाहरण छिपाएँ' },
    noSearchMatches: {
      en: 'No scam guides matched your search. Clear the filter to view all topics.',
      hi: 'आपकी खोज से कोई विषय नहीं मिला। सभी विषय देखने के लिए फ़िल्टर साफ़ करें।',
    },
    clearFilter: { en: 'Reset Filters', hi: 'फ़िल्टर हटाएँ' },
    checklistTitle: {
      en: 'Interactive Red-Flag Self-Check',
      hi: 'इंटरैक्टिव चेतावनी स्व-जाँच',
    },
    checklistSubtitle: {
      en: 'Check any signs present in a message or call you received:',
      hi: 'यदि आपको मिले संदेश या कॉल में ये संकेत हैं, तो उन्हें चुनें:',
    },
    checklistItems: [
      {
        id: 'urgency',
        text: {
          en: 'Creates panic or artificial 1–24 hour deadline ("Account blocked today")',
          hi: 'डर या जल्दबाज़ी पैदा करना ("आज खाता बंद हो जाएगा")',
        },
      },
      {
        id: 'otp_pin',
        text: {
          en: 'Asks for OTP, UPI PIN, CVV, or screen-sharing app installation',
          hi: 'OTP, UPI PIN, CVV या स्क्रीन-शेयरिंग ऐप इंस्टॉल करने को कहना',
        },
      },
      {
        id: 'collect_request',
        text: {
          en: 'Asks you to enter UPI PIN to "receive" prize money or refund',
          hi: 'इनाम या रिफंड "पाने" के लिए UPI PIN डालने को कहना',
        },
      },
      {
        id: 'weird_link',
        text: {
          en: 'Uses shortened links or misspelled domains (.top, .xyz, -kyc-verify)',
          hi: 'शॉर्ट लिंक या गलत स्पेलिंग वाले डोमेन (.top, .xyz, -kyc-verify)',
        },
      },
      {
        id: 'authority',
        text: {
          en: 'Threatens "Digital Arrest", police/CBI video call, or parcel seizure',
          hi: '"डिजिटल अरेस्ट", पुलिस/CBI वीडियो कॉल या पार्सल ज़ब्ती की धमकी',
        },
      },
    ],
    checklistResultSafe: {
      en: 'Select any warning signs above to evaluate risk awareness.',
      hi: 'जागरूकता आकलन के लिए ऊपर दिए गए किसी भी संकेत को चुनें।',
    },
    checklistResultWarn: {
      en: 'Caution: Even 1–2 of these signs strongly suggest a social engineering attempt. Verify via official channels first.',
      hi: 'सावधान: इनमें से 1–2 संकेत भी सोशल इंजीनियरिंग धोखाधड़ी की ओर इशारा करते हैं। पहले आधिकारिक स्रोत से पुष्टि करें।',
    },
    checklistResultCritical: {
      en: 'High Scam Probability: Multiple classic fraud indicators detected! Do NOT click, pay, or share OTP/PIN.',
      hi: 'अत्यधिक स्कैम जोखिम: कई प्रमुख धोखाधड़ी संकेत मिले हैं! बिल्कुल क्लिक न करें, भुगतान न करें और OTP/PIN साझा न करें।',
    },
    emergencyTitle: {
      en: 'If You Suspect or Experience a Cyber Scam',
      hi: 'यदि आपको साइबर ठगी का संदेह हो या आप शिकार हो जाएँ',
    },
    stepPrefix: { en: 'STEP', hi: 'कदम' },
    emergencySteps: [
      {
        title: { en: 'Call 1930 Immediately', hi: 'तुरंत 1930 पर कॉल करें' },
        desc: {
          en: 'India National Cyber Crime Helpline — reporting within the golden hour helps freeze fraudulent transfers.',
          hi: 'राष्ट्रीय साइबर क्राइम हेल्पलाइन — शुरुआती समय में रिपोर्ट करने से संदिग्ध लेनदेन रोके जा सकते हैं।',
        },
      },
      {
        title: { en: 'Report on cybercrime.gov.in', hi: 'cybercrime.gov.in पर शिकायत दर्ज करें' },
        desc: {
          en: 'Save screenshots, transaction IDs, sender numbers, and suspicious URLs as evidence.',
          hi: 'सबूत के तौर पर स्क्रीनशॉट, ट्रांजैक्शन ID, नंबर और संदिग्ध URL सुरक्षित रखें।',
        },
      },
      {
        title: { en: 'Freeze Card & UPI Access', hi: 'कार्ड और UPI तुरंत ब्लॉक करें' },
        desc: {
          en: 'Use your bank’s official app or helpline to block compromised cards, netbanking, or UPI IDs.',
          hi: 'अपने बैंक के आधिकारिक ऐप या हेल्पलाइन से तुरंत कार्ड, नेटबैंकिंग या UPI ID ब्लॉक करें।',
        },
      },
    ],
  },
  about: {
    badge: { en: 'PROJECT ROADMAP & MISSION', hi: 'प्रोजेक्ट रोडमैप और मिशन' },
    title: {
      en: 'About ScamShield AI',
      hi: 'ScamShield AI के बारे में',
    },
    subtitle: {
      en: 'Built as a hackathon initiative to make digital fraud detection accessible, transparent, and bilingual for everyday internet users.',
      hi: 'हर इंटरनेट उपयोगकर्ता के लिए डिजिटल धोखाधड़ी की पहचान को सरल, पारदर्शी और द्विभाषी बनाने की हैकाथॉन पहल।',
    },
    missionTitle: { en: 'Why We Are Building This', hi: 'हम इसे क्यों बना रहे हैं' },
    missionBody: {
      en: 'Millions of first-time digital payment users receive deceptive KYC alerts, fake courier links, and social-engineering scams every day. Existing security tools are often too technical or English-only. ScamShield AI bridges this gap with a clean SaaS interface, clear risk breakdowns, and full English & Hindi support.',
      hi: 'करोड़ों डिजिटल भुगतान उपयोगकर्ताओं को रोज़ाना नकली KYC संदेश, फ़र्ज़ी कूरियर लिंक और सोशल-इंजीनियरिंग कॉल मिलते हैं। अधिकांश सुरक्षा टूल तकनीकी या केवल अंग्रेज़ी में होते हैं। ScamShield AI सरल UI और हिंदी-अंग्रेज़ी सहायता के साथ इस अंतर को पाटता है।',
    },
    roadmapTitle: { en: 'Transparent Hackathon Phases', hi: 'पारदर्शी हैकाथॉन चरण' },
    phase1Title: { en: 'Phase 1: Frontend & UX (Completed)', hi: 'चरण 1: फ्रंटएंड और UX (पूर्ण)' },
    phase1Items: [
      { en: 'Responsive dark-navy SaaS cybersecurity interface', hi: 'रिस्पॉन्सिव डार्क-नेवी साइबर सुरक्षा इंटरफ़ेस' },
      { en: 'Interactive Message Scanner & URL Scanner layouts', hi: 'इंटरैक्टिव मैसेज और URL स्कैनर लेआउट' },
      { en: 'Clearly labeled sample/demo threat telemetry states', hi: 'स्पष्ट रूप से लेबल किए गए सैंपल/डेमो परिणाम' },
      { en: 'Full English & Hindi bilingual UI toggle', hi: 'पूर्ण अंग्रेज़ी और हिंदी द्विभाषी UI टॉगल' },
      { en: 'Scam Awareness hub & interactive Red-Flag checklist', hi: 'स्कैम जागरूकता केंद्र और चेतावनी चेकलिस्ट' },
    ],
    phase2Title: { en: 'Phase 2–5: Live Defense & Bilingual AI', hi: 'चरण 2–5: लाइव सुरक्षा और द्विभाषी AI' },
    phase2Items: [
      { en: 'Secure backend AI message scam detection API (Active)', hi: 'सुरक्षित बैकएंड AI मैसेज स्कैम जाँच API (सक्रिय)' },
      { en: 'Zero-visit URL heuristic & optional Safe Browsing check (Active)', hi: 'लिंक खोले बिना URL पैटर्न और प्रतिष्ठा जाँच (सक्रिय)' },
      { en: 'Full English & Hindi UI and easy-to-read AI explanations (Active)', hi: 'पूर्ण अंग्रेज़ी और सरल हिंदी UI व AI व्याख्या (सक्रिय)' },
      { en: 'Multilingual OCR screenshot scam scanner (Planned)', hi: 'स्क्रीनशॉट से स्कैम पहचानने वाला OCR स्कैनर (आगामी)' },
    ],
    privacyTitle: { en: 'Privacy-First Design Principle', hi: 'गोपनीयता-प्रथम डिज़ाइन सिद्धांत' },
    privacyBody: {
      en: 'API keys stay strictly on the backend server and are never exposed to the browser. Message analysis requests do not store user submissions on our servers.',
      hi: 'API कुंजियाँ पूरी तरह बैकएंड सर्वर पर सुरक्षित रहती हैं और ब्राउज़र में कभी साझा नहीं की जातीं। संदेश जाँच के दौरान आपका टेक्स्ट हमारे सर्वर पर सेव नहीं किया जाता।',
    },
    ctaTitle: {
      en: 'Try the Message & URL Scanners',
      hi: 'मैसेज और URL स्कैनर आज़माएँ',
    },
    ctaDesc: {
      en: 'Check suspicious messages with backend AI or inspect unfamiliar links safely in English and Hindi.',
      hi: 'अंग्रेज़ी या हिंदी में संदिग्ध संदेशों की AI जाँच करें और अनजान लिंक को बिना खोले सुरक्षित रूप से परखें।',
    },
  },
  footer: {
    desc: {
      en: 'Hackathon AI-powered scam & phishing defense platform with bilingual English & Hindi support.',
      hi: 'अंग्रेज़ी और हिंदी सहायता के साथ AI-आधारित स्कैम और फ़िशिंग सुरक्षा प्लेटफ़ॉर्म।',
    },
    quickLinks: { en: 'Navigation', hi: 'नेविगेशन' },
    safetyResources: { en: 'Safety & Helplines', hi: 'सुरक्षा और हेल्पलाइन' },
    helplineText: {
      en: 'India Cyber Helpline: 1930',
      hi: 'भारत साइबर हेल्पलाइन: 1930',
    },
    portalText: {
      en: 'National Portal: cybercrime.gov.in',
      hi: 'राष्ट्रीय पोर्टल: cybercrime.gov.in',
    },
    statusLabel: {
      en: 'Status: AI Message & Safe URL Defense',
      hi: 'स्थिति: AI मैसेज और सुरक्षित URL सुरक्षा',
    },
    copyright: {
      en: 'ScamShield AI • Hackathon Project',
      hi: 'ScamShield AI • हैकाथॉन प्रोजेक्ट',
    },
    designTag: {
      en: 'Dark Navy Cyber SaaS • EN / हिन्दी',
      hi: 'डार्क नेवी साइबर सुरक्षा • EN / हिन्दी',
    },
  },
  riskLabels: {
    high: { en: 'HIGH RISK (DEMO)', hi: 'उच्च जोखिम (डेमो)' },
    suspicious: { en: 'SUSPICIOUS (DEMO)', hi: 'संदिग्ध (डेमो)' },
    safe: { en: 'LOW RISK / SAFE (DEMO)', hi: 'सुरक्षित / कम जोखिम (डेमो)' },
  },
  messageRiskLevels: {
    High: { en: 'HIGH RISK', hi: 'उच्च जोखिम (High)' },
    Medium: { en: 'MEDIUM RISK', hi: 'मध्यम जोखिम (Medium)' },
    Low: { en: 'LOW RISK', hi: 'कम जोखिम (Low)' },
  },
  severityLabels: {
    high: { en: 'HIGH', hi: 'उच्च' },
    medium: { en: 'MEDIUM', hi: 'मध्यम' },
    low: { en: 'LOW', hi: 'कम' },
  },
  channelNames: {
    sms: { en: 'SMS', hi: 'SMS' },
    whatsapp: { en: 'WhatsApp', hi: 'WhatsApp' },
    email: { en: 'Email', hi: 'ईमेल' },
    other: { en: 'Other', hi: 'अन्य' },
  },
  fallbackErrors: {
    messageAnalyze: {
      en: 'Unexpected error while analyzing message.',
      hi: 'संदेश की जाँच के दौरान अचानक त्रुटि आ गई।',
    },
    urlInspect: {
      en: 'Unexpected error while inspecting URL.',
      hi: 'URL की जाँच के दौरान अचानक त्रुटि आ गई।',
    },
  },
} as const;

export function t(
  obj: Record<Language, string>,
  lang: Language
): string {
  return obj[lang];
}
