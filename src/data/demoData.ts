import type { Language, MessageChannel } from '../types.js';

export interface SampleMessageFiller {
  id: string;
  label: Record<Language, string>;
  channel: MessageChannel;
  text: string;
}

/**
 * Sample text snippets for convenience input testing in the Message Scanner.
 * These do NOT contain pre-computed or fake AI results—clicking Scan sends the
 * text to the secure backend AI endpoint (/api/analyze-message).
 */
export const sampleMessageFillers: SampleMessageFiller[] = [
  {
    id: 'kyc-sms',
    label: {
      en: 'Test Input: Bank KYC SMS',
      hi: 'टेस्ट संदेश: बैंक KYC SMS',
    },
    channel: 'sms',
    text: 'URGENT: Dear Customer, your SBI YONO KYC has expired today. Your account will be suspended in 2 hours. Click http://sbi-kyc-update-verify.top/login immediately and verify PAN + OTP.',
  },
  {
    id: 'reward-whatsapp',
    label: {
      en: 'Test Input: Fake Cashback / Task',
      hi: 'टेस्ट संदेश: नकली इनाम / टास्क',
    },
    channel: 'whatsapp',
    text: 'Congratulations! You won Rs. 25,000 Diwali UPI Cashback reward. Scan the attached QR or enter your UPI PIN on https://claim-bonus-upi.xyz within 30 minutes to receive funds.',
  },
  {
    id: 'safe-order',
    label: {
      en: 'Test Input: Normal Delivery Alert',
      hi: 'टेस्ट संदेश: सामान्य डिलीवरी अलर्ट',
    },
    channel: 'sms',
    text: 'Your prepaid order #IND-48291 is out for delivery today with BlueDart. You can view live tracking inside your shopping app under My Orders. No payment is required.',
  },
];

export interface SampleUrlFiller {
  id: string;
  label: Record<Language, string>;
  url: string;
}

/**
 * Sample URL strings for convenience input testing in the URL Scanner.
 * No pre-computed or fake results are stored here—clicking Inspect sends the
 * URL to /api/analyze-url for static structural heuristics and optional Safe Browsing lookup.
 */
export const sampleUrlFillers: SampleUrlFiller[] = [
  {
    id: 'lookalike-kyc',
    label: {
      en: 'Test URL: Lookalike KYC Link',
      hi: 'टेस्ट URL: नकली KYC लिंक',
    },
    url: 'http://sbi-kyc-update-verify.top/login?otp=verify',
  },
  {
    id: 'ip-url',
    label: {
      en: 'Test URL: Raw IP Host',
      hi: 'टेस्ट URL: IP आधारित लिंक',
    },
    url: 'http://192.168.45.12:8080/netbanking/update.apk',
  },
  {
    id: 'short-url',
    label: {
      en: 'Test URL: Shortened Link',
      hi: 'टेस्ट URL: शॉर्ट लिंक',
    },
    url: 'https://bit.ly/claim-upi-cashback-2026',
  },
  {
    id: 'official-url',
    label: {
      en: 'Test URL: Official Domain',
      hi: 'टेस्ट URL: आधिकारिक डोमेन',
    },
    url: 'https://www.npci.org.in',
  },
];

export type ScamGroup = 'financial' | 'links' | 'impersonation';

export interface ScamCategoryItem {
  id: string;
  group: ScamGroup;
  title: Record<Language, string>;
  badge: Record<Language, string>;
  summary: Record<Language, string>;
  warningSigns: Record<Language, string[]>;
  preventionTips: Record<Language, string[]>;
  exampleLure: Record<Language, string>;
}

export const scamAwarenessCategories: ScamCategoryItem[] = [
  {
    id: 'otp',
    group: 'financial',
    title: {
      en: 'OTP Scams',
      hi: 'OTP स्कैम',
    },
    badge: { en: 'Credential Theft', hi: 'गोपनीय कोड चोरी' },
    summary: {
      en: 'Scammers trick you into reading out a One-Time Password (OTP) sent to your phone by pretending to verify KYC, cancel an order, or send a refund.',
      hi: 'ठग KYC अपडेट, ऑर्डर कैंसल करने या रिफंड भेजने का बहाना बनाकर आपके फ़ोन पर आया OTP पूछ लेते हैं और खाते से पैसे निकाल लेते हैं।',
    },
    warningSigns: {
      en: [
        'Caller claims your bank account, SIM, or electricity will be blocked unless you share an OTP',
        'Asking for an OTP to "cancel" a transaction you never started',
        'Pressuring you to stay on the line and read numbers quickly before the timer expires',
      ],
      hi: [
        'कॉल करने वाला कहे कि OTP न बताने पर बैंक खाता, सिम या बिजली बंद हो जाएगी',
        'किसी अनजान लेनदेन को "रद्द" करने के नाम पर OTP माँगना',
        'समय खत्म होने का डर दिखाकर तुरंत कोड बताने का दबाव डालना',
      ],
    },
    preventionTips: {
      en: [
        'Never share an OTP with anyone—not even someone claiming to be bank staff or police',
        'Read the full SMS text carefully to check whether the OTP is for a debit or login',
        'If unsure, hang up and call the official helpline printed on the back of your bank card',
      ],
      hi: [
        'कभी भी किसी को OTP न बताएँ—चाहे सामने वाला बैंक अधिकारी या पुलिस ही क्यों न कहे',
        'OTP वाला पूरा SMS ध्यान से पढ़ें कि वह पैसे कटने का है या लॉगिन का',
        'संदेह होने पर कॉल काटें और अपने कार्ड के पीछे लिखे आधिकारिक नंबर पर बात करें',
      ],
    },
    exampleLure: {
      en: '"Sir, a Rs. 9,500 charge is pending on your card. Tell me the 6-digit OTP on your phone right now to block it."',
      hi: '"सर, आपके कार्ड से ₹9,500 कटने वाले हैं। इसे रोकने के लिए अभी फ़ोन पर आया 6 अंकों का OTP बताइए।"',
    },
  },
  {
    id: 'upi',
    group: 'financial',
    title: {
      en: 'UPI Scams',
      hi: 'UPI स्कैम',
    },
    badge: { en: 'Payment Fraud', hi: 'भुगतान धोखाधड़ी' },
    summary: {
      en: 'Fraudsters send a "Collect Money" request or QR code claiming you need to approve it with your UPI PIN to receive cashback, rent, or a marketplace payment.',
      hi: 'ठग कैशबैक, किराया या सामान खरीदने के पैसे भेजने के बहाने QR कोड या पेमेंट रिक्वेस्ट भेजते हैं और आपसे UPI PIN डलवाते हैं।',
    },
    warningSigns: {
      en: [
        'Telling you to enter your UPI PIN or scan a QR code in order to "receive" money',
        'Payment notifications showing "Pay" or "Approve Request" instead of a credit alert',
        'Sending a fake screenshot of a completed payment and asking you to refund "extra money"',
      ],
      hi: [
        'पैसे "प्राप्त करने" के लिए UPI PIN डालने या QR कोड स्कैन करने को कहना',
        'ऐप में पैसे मिलने के बजाय "Pay" या "Approve" का विकल्प दिखना',
        'नकली पेमेंट स्क्रीनशॉट भेजकर "गलती से ज़्यादा भेजे गए पैसे" वापस माँगना',
      ],
    },
    preventionTips: {
      en: [
        'Remember the Golden Rule: you NEVER need a UPI PIN or QR scan to receive money',
        'Always verify actual money received by checking your bank balance inside your official app',
        'Decline and block unknown UPI collect requests immediately',
      ],
      hi: [
        'हमेशा याद रखें: पैसे लेने के लिए कभी भी UPI PIN डालने या QR स्कैन करने की ज़रूरत नहीं होती',
        'सिर्फ स्क्रीनशॉट पर भरोसा न करें—अपने बैंक ऐप में बैलेंस देखकर पुष्टि करें',
        'अनजान UPI रिक्वेस्ट को तुरंत Decline (अस्वीकार) करके ब्लॉक करें',
      ],
    },
    exampleLure: {
      en: '"I have sent the OLX advance via UPI. Scan this QR code and enter your PIN so the amount deposits into your bank."',
      hi: '"मैंने OLX के लिए एडवांस पैसे भेज दिए हैं। इस QR को स्कैन करके अपना PIN डालें ताकि पैसे आपके खाते में आ जाएँ।"',
    },
  },
  {
    id: 'fake-jobs',
    group: 'impersonation',
    title: {
      en: 'Fake Job Offers',
      hi: 'नकली नौकरी के ऑफ़र',
    },
    badge: { en: 'Employment / Task Lure', hi: 'रोज़गार / टास्क जाल' },
    summary: {
      en: 'Scammers offer easy work-from-home income for liking videos, rating hotels, or data entry—then demand upfront "registration" or "prepaid task" deposits.',
      hi: 'घर बैठे वीडियो लाइक करने, रेटिंग देने या डेटा एंट्री से रोज़ भारी कमाई का लालच देकर पहले "रजिस्ट्रेशन" या "टास्क डिपॉज़िट" के नाम पर पैसे ऐंठते हैं।',
    },
    warningSigns: {
      en: [
        'High daily pay promised for zero skills or simple social-media likes',
        'Asking you to pay a security deposit, training fee, or "VIP task" recharge first',
        'Moving conversations quickly from SMS/WhatsApp to anonymous Telegram groups',
      ],
      hi: [
        'बिना किसी कौशल या आसान लाइक/रिव्यू के बदले रोज़ हज़ारों रुपये देने का वादा',
        'काम या सैलरी पाने से पहले सिक्योरिटी, रजिस्ट्रेशन या "VIP टास्क" फीस माँगना',
        'WhatsApp से हटाकर अनाम Telegram ग्रुप में जोड़ना',
      ],
    },
    preventionTips: {
      en: [
        'Legitimate employers never ask candidates to pay money to get a job or unlock wages',
        'Verify job openings directly on the company’s official careers website',
        'Stop immediately if a "part-time task" asks you to deposit money to earn a higher return',
      ],
      hi: [
        'असली कंपनियाँ नौकरी देने या कमाई निकालने के लिए कभी पैसे नहीं माँगतीं',
        'किसी भी जॉब ऑफ़र की जाँच कंपनी की आधिकारिक करियर वेबसाइट पर जाकर करें',
        'अगर कोई "पार्ट-टाइम टास्क" अधिक मुनाफ़े के लिए पैसे जमा करने को कहे, तो तुरंत रुक जाएँ',
      ],
    },
    exampleLure: {
      en: '"Earn Rs. 3,000–7,000/day liking YouTube videos! Message our HR manager on Telegram and pay Rs. 1,000 to unlock VIP tasks."',
      hi: '"YouTube वीडियो लाइक करके रोज़ ₹3,000–7,000 कमाएँ! VIP टास्क अनलॉक करने के लिए Telegram पर जुड़ें और ₹1,000 जमा करें।"',
    },
  },
  {
    id: 'lottery',
    group: 'financial',
    title: {
      en: 'Lottery Scams',
      hi: 'लॉटरी और इनाम स्कैम',
    },
    badge: { en: 'Fake Rewards', hi: 'नकली इनाम' },
    summary: {
      en: 'Messages congratulate you on winning a lucky draw, car, or cash prize you never entered—then demand "processing tax" or "delivery fees" to release it.',
      hi: 'आपने कभी कोई प्रतियोगिता नहीं खेली, फिर भी लाखों की लॉटरी, कार या इनाम जीतने का संदेश भेजकर "टैक्स" या "प्रोसेसिंग फीस" माँगते हैं।',
    },
    warningSigns: {
      en: [
        'Winning a contest, KBC draw, or gift voucher you never participated in',
        'Being asked to pay GST, customs clearance, or transfer fees before receiving a prize',
        'Fake certificates or edited photos using well-known TV show or brand logos',
      ],
      hi: [
        'ऐसी लॉटरी, KBC ड्रॉ या वाउचर जीतने की खबर जिसमें आपने कभी भाग ही नहीं लिया',
        'इनाम पाने से पहले GST, कस्टम या ट्रांसफ़र शुल्क जमा करने की शर्त',
        'प्रसिद्ध टीवी शो या ब्रांड के लोगो वाले नकली प्रमाणपत्र भेजना',
      ],
    },
    preventionTips: {
      en: [
        'Treat any unexpected prize notification requiring an advance fee as a scam',
        'Never send ID documents (Aadhaar/PAN) or bank details to claim unknown lucky draws',
        'Block and report the sender number on WhatsApp or your SMS app',
      ],
      hi: [
        'अगर किसी इनाम को पाने के लिए पहले पैसे देने पड़ें, तो समझ लें कि वह पक्का स्कैम है',
        'अज्ञात लॉटरी का दावा करने के लिए कभी अपना आधार, PAN या बैंक विवरण न भेजें',
        'ऐसे संदेश भेजने वाले नंबर को तुरंत ब्लॉक और रिपोर्ट करें',
      ],
    },
    exampleLure: {
      en: '"CONGRATULATIONS! Your mobile number won Rs. 25 Lakh in the Lucky Draw. Pay Rs. 4,500 processing fee today to release your cheque."',
      hi: '"बधाई हो! आपके मोबाइल नंबर ने लकी ड्रॉ में ₹25 लाख जीते हैं। चेक पाने के लिए आज ही ₹4,500 प्रोसेसिंग फीस जमा करें।"',
    },
  },
  {
    id: 'phishing-emails',
    group: 'links',
    title: {
      en: 'Phishing Emails',
      hi: 'फ़िशिंग ईमेल',
    },
    badge: { en: 'Email Deception', hi: 'नकली ईमेल जाल' },
    summary: {
      en: 'Deceptive emails mimic banks, cloud storage, tax portals, or streaming apps to make you click a fake sign-in page or open a malicious attachment.',
      hi: 'बैंक, ईमेल, टैक्स पोर्टल या शॉपिंग साइट जैसे दिखने वाले नकली ईमेल भेजकर आपको फ़र्ज़ी लॉगिन पेज पर ले जाया जाता है या खतरनाक फ़ाइल खुलवाई जाती है।',
    },
    warningSigns: {
      en: [
        'Sender address looks slightly off (e.g., support@bank-verify-alert.com instead of official domain)',
        'Generic greetings like "Dear Valued User" paired with urgent password/account warnings',
        'Attachments with unexpected .zip, .html, or executable files pretending to be invoices',
      ],
      hi: [
        'भेजने वाले का ईमेल पता असली कंपनी से थोड़ा अलग या संदिग्ध होना',
        '"Dear User" जैसे सामान्य संबोधन के साथ तुरंत पासवर्ड/खाता अपडेट करने की चेतावनी',
        'बिल या रसीद के नाम पर .zip, .html या अनजान फ़ाइल अटैचमेंट भेजना',
      ],
    },
    preventionTips: {
      en: [
        'Inspect the full sender email address—not just the display name—before trusting it',
        'Never log in through links inside urgent emails; open a new tab and type the official website',
        'Enable Two-Factor Authentication (2FA) on your email and banking accounts',
      ],
      hi: [
        'ईमेल के नाम के बजाय भेजने वाले का पूरा ईमेल पता ध्यान से जाँचें',
        'जरूरी लगने वाले ईमेल के लिंक से लॉगिन न करें—ब्राउज़र में खुद आधिकारिक वेबसाइट खोलें',
        'अपने ईमेल और बैंक खातों पर टू-फ़ैक्टर ऑथेंटिकेशन (2FA) चालू रखें',
      ],
    },
    exampleLure: {
      en: '"Security Alert: Unusual sign-in detected. Verify your password within 12 hours at https://mail-account-verify.top to avoid deletion."',
      hi: '"सुरक्षा चेतावनी: संदिग्ध लॉगिन दिखा है। खाता बंद होने से बचाने के लिए 12 घंटे में अपना पासवर्ड यहाँ सत्यापित करें।"',
    },
  },
  {
    id: 'fake-support',
    group: 'impersonation',
    title: {
      en: 'Fake Customer Support',
      hi: 'नकली कस्टमर केयर',
    },
    badge: { en: 'Helpline Spoofing', hi: 'नकली हेल्पलाइन' },
    summary: {
      en: 'Fraudsters post fake helpline numbers on search engines and social media, then ask callers to install screen-sharing apps like AnyDesk or TeamViewer.',
      hi: 'ठग इंटरनेट सर्च या सोशल मीडिया पर नकली कस्टमर केयर नंबर डाल देते हैं और मदद के बहाने फ़ोन में स्क्रीन-शेयरिंग ऐप इंस्टॉल करवाते हैं।',
    },
    warningSigns: {
      en: [
        'Finding a customer support number through random ads, comments, or unverified listings',
        'Agent asks you to download AnyDesk, QuickSupport, TeamViewer, or an .apk file',
        'Requesting you to make a "test Rs. 1 or Rs. 10 transaction" while your screen is shared',
      ],
      hi: [
        'सर्च विज्ञापन, कमेंट या अनजान वेबसाइट से मिला कस्टमर केयर नंबर',
        'मदद के नाम पर AnyDesk, QuickSupport, TeamViewer या .apk ऐप डाउनलोड करवाना',
        'स्क्रीन शेयर रहते हुए ₹1 या ₹10 का "टेस्ट ट्रांजैक्शन" करने को कहना',
      ],
    },
    preventionTips: {
      en: [
        'Get helpline numbers ONLY from the official app, bank passbook, card back, or verified .gov/.bank site',
        'Never install remote screen-sharing apps or unknown .apk files for "refund processing"',
        'Uninstall any remote-access tool immediately if you realize a stranger asked for it',
      ],
      hi: [
        'हेल्पलाइन नंबर हमेशा आधिकारिक ऐप, पासबुक, कार्ड के पीछे या सत्यापित वेबसाइट से ही लें',
        'रिफंड या मदद के नाम पर कभी भी स्क्रीन-शेयरिंग ऐप या .apk फ़ाइल इंस्टॉल न करें',
        'यदि किसी अनजान व्यक्ति के कहने पर ऐसा ऐप इंस्टॉल हो जाए, तो तुरंत हटा दें',
      ],
    },
    exampleLure: {
      en: '"To process your failed UPI refund instantly, download QuickSupport from Play Store and share the 9-digit code with our agent."',
      hi: '"आपका अटका हुआ UPI रिफंड तुरंत पाने के लिए QuickSupport ऐप डाउनलोड करें और स्क्रीन पर दिख रहा 9 अंकों का कोड बताएँ।"',
    },
  },
  {
    id: 'suspicious-links',
    group: 'links',
    title: {
      en: 'Suspicious Links',
      hi: 'संदिग्ध और फ़र्ज़ी लिंक',
    },
    badge: { en: 'Malicious URLs', hi: 'खतरनाक वेब लिंक' },
    summary: {
      en: 'Lookalike domains, raw IP addresses, and shortened URLs disguise phishing pages or auto-download malicious .apk apps onto your device.',
      hi: 'मिलते-जुलते नकली डोमेन, IP पते वाले लिंक और शॉर्ट URL आपको नकली वेबसाइट पर ले जाते हैं या फ़ोन में खतरनाक .apk ऐप डाउनलोड कर देते हैं।',
    },
    warningSigns: {
      en: [
        'Misspelled brand domains or extra hyphens like "sbi-kyc-update.top" or "amazon-gift.xyz"',
        'Links starting with raw IP numbers (e.g., http://192.168.x.x) or unencrypted http://',
        'Shortened URLs (bit.ly, tinyurl) hiding the true destination alongside urgent claims',
      ],
      hi: [
        'ब्रांड नाम की गलत स्पेलिंग या अतिरिक्त शब्द, जैसे "sbi-kyc-update.top"',
        'डोमेन नाम के बजाय सीधे नंबर (IP पता) या बिना HTTPS वाला http:// लिंक',
        'असली वेबसाइट छुपाने वाले शॉर्ट लिंक (bit.ly, tinyurl) जिनके साथ इनाम या धमकी हो',
      ],
    },
    preventionTips: {
      en: [
        'Inspect unfamiliar links in ScamShield’s URL Scanner before deciding whether to trust them',
        'Check the exact main domain right before ".com" or ".in" before entering any password',
        'Never open or install .apk, .exe, or .zip files linked from unknown SMS or WhatsApp messages',
      ],
      hi: [
        'किसी भी अनजान लिंक को खोलने से पहले ScamShield के URL स्कैनर से जाँचें',
        'पासवर्ड डालने से पहले ".com" या ".in" से ठीक पहले का मुख्य डोमेन नाम ध्यान से पढ़ें',
        'अनजान SMS या WhatsApp लिंक से आई .apk या .zip फ़ाइल कभी डाउनलोड न करें',
      ],
    },
    exampleLure: {
      en: '"Traffic E-Challan Pending: View & pay at http://parivahan-challan-pay.top/Challan.apk immediately."',
      hi: '"ट्रैफ़िक ई-चालान लंबित है: तुरंत देखने और भुगतान करने के लिए http://parivahan-challan-pay.top/Challan.apk खोलें।"',
    },
  },
  {
    id: 'social-engineering',
    group: 'impersonation',
    title: {
      en: 'Social Engineering',
      hi: 'सोशल इंजीनियरिंग (मनोवैज्ञानिक चाल)',
    },
    badge: { en: 'Psychological Manipulation', hi: 'मानसिक दबाव व भ्रम' },
    summary: {
      en: 'Scammers manipulate emotions—fear, urgency, greed, or respect for authority (such as fake police "Digital Arrest" calls)—so victims act without checking facts.',
      hi: 'ठग डर, जल्दबाज़ी, लालच या पुलिस/CBI अधिकारी बनकर ("डिजिटल अरेस्ट" जैसी धमकी) आपकी भावनाओं का फ़ायदा उठाते हैं ताकि आप बिना सोचे-समझे पैसे भेज दें।',
    },
    warningSigns: {
      en: [
        'Fake Police, CBI, Customs, or RBI officers threatening arrest over a video call',
        'Forcing secrecy ("Do not tell your family or bank") and demanding you stay on a live call',
        'Asking for a "security verification deposit" to clear your name from a fake case',
      ],
      hi: [
        'वीडियो कॉल पर नकली पुलिस, CBI, कस्टम या RBI अधिकारी बनकर गिरफ़्तारी की धमकी देना',
        '"परिवार या बैंक को मत बताना" कहकर लगातार लाइव कॉल पर बने रहने का दबाव डालना',
        'किसी झूठे केस से नाम हटाने के लिए "वेरिफिकेशन डिपॉज़िट" ट्रांसफ़र करने को कहना',
      ],
    },
    preventionTips: {
      en: [
        'Remember: Indian police and courts NEVER conduct "Digital Arrests" or demand money on video calls',
        'Pause, disconnect the call, and talk to a trusted family member or local police station',
        'Report any coercion or fraud attempt immediately to 1930 or cybercrime.gov.in',
      ],
      hi: [
        'याद रखें: भारतीय पुलिस या अदालत कभी वीडियो कॉल पर "डिजिटल अरेस्ट" नहीं करती और न पैसे माँगती है',
        'घबराएँ नहीं—तुरंत कॉल काटें और अपने परिवार या नजदीकी पुलिस थाने से संपर्क करें',
        'किसी भी धमकी या ठगी की सूचना तुरंत 1930 या cybercrime.gov.in पर दें',
      ],
    },
    exampleLure: {
      en: '"This is Cyber Crime Headquarters. Drugs were found in a parcel linked to your Aadhaar. Stay on Skype video and transfer Rs. 50,000 for verification."',
      hi: '"यह साइबर क्राइम मुख्यालय है। आपके आधार से जुड़े पार्सल में अवैध सामान मिला है। वीडियो कॉल पर रहें और जाँच के लिए ₹50,000 भेजें।"',
    },
  },
];
