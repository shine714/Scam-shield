# ScamShield AI

> **Bilingual AI-Powered Scam & Phishing Detection Platform (English / हिन्दी)**

**Live Deployments:**
- **Full-Stack App (Frontend + Backend API):** https://scam-shield-ipqq.onrender.com
- **GitHub Pages UI (Connected to Backend API):** https://shine714.github.io/Scam-shield/

ScamShield AI is a full-stack cybersecurity web application designed to help everyday internet and digital-payment users detect suspicious SMS, WhatsApp messages, emails, and deceptive URLs **before** clicking links, sharing OTPs, or transferring money.

---

## Project Objective

Digital fraud—such as fake banking KYC alerts, UPI collect/QR scams, digital arrest impersonation, and lookalike phishing domains—disproportionately affects everyday smartphone users who often lack accessible, non-technical security tools in their native language.

ScamShield AI provides a clear, privacy-first, bilingual (**English & Hindi**) cybersecurity dashboard that explains *why* a message or link looks dangerous and what practical safety steps to take.

---

## Problem Statement & Solution

### Problem Statement
- Millions of users receive deceptive SMS, WhatsApp forwards, and phishing links claiming urgent account suspension, cashback rewards, or government/police notices.
- Most security scanners are either English-only, overly technical, or rely on unsafe link previews.
- Users need clear, actionable risk explanations—without exposing private messages or API secrets in the browser.

### Solution
ScamShield AI combines:
1. **Secure Backend AI Message Analysis**: Evaluates suspicious text (`SMS`, `WhatsApp`, `Email`, `Other`) through an Express backend using Google's Gemini API (`@google/genai`), returning structured risk scores (`0–100`), risk levels (`Low`, `Medium`, `High`), detected threat patterns, suspicious phrases, reasons, and practical recommendations in plain English and everyday Hindi.
2. **Zero-Visit Safe URL Inspection**: Inspects URLs statically on the backend without ever opening, fetching, or loading the target webpage. Clearly separates **local structural heuristics** (IP hosts, Punycode/IDN, shorteners, high-abuse TLDs, nested subdomains, brand impersonation, `@` authority tricks, `.apk` downloads, open redirects) from **external reputation lookups** (optional Google Safe Browsing API v4).
3. **Bilingual Accessibility & Scam Education**: An instant `EN / हिन्दी` toggle across every page, plus an interactive Scam Awareness Hub, Red-Flag self-check checklist, and emergency cyber helpline guidance (`1930` / `cybercrime.gov.in`).

---

## Implemented Features

- **Landing Page**: Dark-navy cybersecurity SaaS hero section, interactive threat telemetry preview, capability overview, 3-step defense pipeline, and embedded scam awareness preview.
- **AI Message Scam Scanner (`/api/analyze-message`)**:
  - Supports `SMS`, `WhatsApp`, `Email`, and `Other` sources plus quick-fill test inputs.
  - Client and server input validation (empty input, 5,000-character limit, malformed JSON handling).
  - Loading states, timeout handling (`504 AI_TIMEOUT`), and honest error states (`503 AI_NOT_CONFIGURED` when no API key is configured—never fakes AI verdicts).
  - Displays Risk Level (`Low` / `Medium` / `High`), Risk Score (`0–100`), 6 threat pattern indicators (`Urgency`, `Fake Rewards`, `Impersonation`, `OTP Request`, `Suspicious Payment`, `Phishing Indicators`), reasons, red flags, suspicious phrases, safety recommendations, and a non-guarantee AI disclaimer.
- **Safe URL Scam Scanner (`/api/analyze-url`)**:
  - Validates URLs and blocks dangerous non-web schemes (`javascript:`, `data:`, `file:`, backslashes).
  - Never visits or opens the target URL; renders inspected URLs strictly as non-clickable text.
  - Clearly distinguishes local heuristic analysis from external Google Safe Browsing v4 reputation checks, and explicitly notes when no suspicious patterns are found that safety is still not guaranteed.
- **Scam Awareness Hub & Interactive Checklist**:
  - Covers UPI Collect/QR fraud, Fake KYC SMS, Digital Arrest spoofing, and Part-Time Task/APK malware traps.
  - Interactive Red-Flag checklist with dynamic risk awareness feedback and emergency `1930` reporting steps.
- **About & Privacy-First Architecture Page**: Documents project mission, roadmap, and privacy practices.
- **Full English & Hindi (`EN` / `हिन्दी`) Language Toggle**: Persisted in `localStorage`, updating navigation, headings, controls, error messages, and AI scanner outputs seamlessly.

---

## Technologies Used

### Frontend
- **React 19** + **TypeScript**
- **Vite 6** (dev server, `/api` proxy, production bundler)
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (cybersecurity & dashboard icons)

### Backend & AI
- **Node.js (>= 20)** + **Express 5**
- **Zod** (strict request & AI JSON output schema validation)
- **Google GenAI SDK (`@google/genai`)** with `gemini-3.8-flash` (configured via `GEMINI_API_KEY`)
- **Google Safe Browsing Lookup API v4** (optional, configured via `GOOGLE_SAFE_BROWSING_API_KEY`)
- **`tsx`** & **`concurrently`** (TypeScript runtime & dual dev runner)

### Testing
- Node.js built-in test runner (`node:test` via `tsx --test`) covering API validation, AI error/timeout handling, URL heuristics, i18n completeness, and React SSR rendering.

---

## Project Structure

```text
scamshield-ai/
├── server/
│   ├── aiService.ts        # Gemini API integration, schema validation, timeout handling
│   ├── app.ts              # Express app, /api routes, security headers, prod dist/ serving
│   ├── index.ts            # Server entry point (reads PORT from env)
│   ├── schema.ts           # Zod & JSON schemas for message analysis
│   ├── urlAnalyzer.ts      # Zero-visit URL validation, heuristics, Safe Browsing lookup
│   └── urlSchema.ts        # Zod & TypeScript types for URL inspection
├── src/
│   ├── components/         # Navbar, Footer, RiskGauge, ScamAwarenessSection
│   ├── data/demoData.ts    # Bilingual test-input fillers & scam awareness guides
│   ├── i18n/translations.ts# Complete EN / हिन्दी translation dictionary
│   ├── pages/              # LandingPage, MessageScannerPage, UrlScannerPage, AboutPage
│   ├── App.tsx             # Hash routing & persistent EN / HI language state
│   ├── index.css           # Dark-navy SaaS theme & subtle cyber animations
│   └── types.ts            # Frontend TypeScript interfaces
├── tests/                  # Automated backend, URL, i18n, UI render & prod-serving tests
├── .env.example            # Template for backend environment variables
├── .gitignore              # Excludes .env, node_modules, dist, logs
├── render.yaml             # Render single-service deployment blueprint
├── package.json            # Build, dev, start, typecheck, and test scripts
└── vite.config.ts          # Vite + Tailwind config with /api dev proxy
```

---

## Local Setup Instructions

### Prerequisites
- **Node.js 20+** (verified with Node `v26.5.0`) and **npm**

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the project root:
```bash
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

Edit `.env` and add your API key(s):
```env
GEMINI_API_KEY=your_actual_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash
GOOGLE_SAFE_BROWSING_API_KEY=
PORT=3001
```

### 3. Run in Development Mode
Starts both the Express backend (`http://localhost:3001`) and Vite frontend (`http://localhost:5173`) concurrently:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 4. Run Tests, Typechecks, and Production Build
```bash
npm test
npm run typecheck
npm run build
```

### 5. Preview Production Build Locally (Single Server)
After running `npm run build`, Express automatically serves the compiled `dist/` frontend alongside `/api/*`:
```bash
npm start
```
Then visit **`http://localhost:3001`**.

---

## Environment Variable Configuration

| Variable | Required? | Default | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | **Required for Message AI** | *(none)* | Server-side Google Gemini API key used by `/api/analyze-message`. Obtain from Google AI Studio. |
| `GEMINI_MODEL` | Optional | `gemini-3.8-flash` | Gemini model ID used for message scam classification. |
| `GOOGLE_SAFE_BROWSING_API_KEY` | Optional | *(none)* | Server-side Google Safe Browsing v4 API key for external URL reputation checks in `/api/analyze-url`. |
| `PORT` | Optional | `3001` | Port the Express backend listens on (automatically injected by Render/Railway). |

### Security & Secret Hygiene
- **Never** commit `.env` or `.env.*` files (already excluded in `.gitignore`).
- **Never** prefix secret keys with `VITE_`; all AI and Safe Browsing requests run strictly on the backend in `server/`.
- **Health Check Endpoint**: `GET /api/health` exposes only boolean readiness flags (`aiConfigured`, `urlReputationConfigured`), never secret values.

---

## Deployment Guide (Obtaining Your Live Demo URL)

ScamShield AI is structured as a **single full-stack Node.js Web Service**: `npm run build` compiles the React/Vite frontend into `dist/`, and `npm start` runs Express to serve both `/api/*` and the `dist/` frontend on the platform's `PORT`.

> **Note:** This repository is prepared and verified for deployment, but is **not yet deployed** to a public host until you connect your repository to a hosting platform below.

### Option A: Deploy to Render (Recommended — `render.yaml` Included)
1. Push your project to a **GitHub** (or GitLab) repository (verify `.env` is NOT pushed).
2. Log in to [Render](https://render.com) and click **New + → Blueprint** (or **New + → Web Service**).
3. Connect your GitHub repository. Render will automatically detect `render.yaml`:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. In the Render dashboard (**Environment** tab), add your secret environment variables:
   - `GEMINI_API_KEY` = *(your Gemini API key)*
   - `GOOGLE_SAFE_BROWSING_API_KEY` = *(optional Safe Browsing key)*
5. Click **Deploy** / **Apply**.
6. **Obtain your Demo URL**: Once the deploy status turns **Live**, copy the `https://<your-service-name>.onrender.com` URL shown at the top of your Render service dashboard.

### Option B: Deploy to Railway
1. Push your project to GitHub (without `.env`).
2. Log in to [Railway](https://railway.app) → **New Project → Deploy from GitHub repo**.
3. Railway detects Node.js via `package.json`:
   - Set **Build Command**: `npm ci && npm run build`
   - Set **Start Command**: `npm start`
4. Open **Variables** in Railway and add `GEMINI_API_KEY` (and optionally `GOOGLE_SAFE_BROWSING_API_KEY`, `GEMINI_MODEL=gemini-3.8-flash`).
5. Under **Settings → Networking**, click **Generate Domain** to obtain your public `https://<app>.up.railway.app` Demo URL.

---

## Hackathon Submission Checklist

- [ ] **Repository Cleanliness**: Confirm `.env` is absent from git history (`git status` / GitHub file tree) and `.env.example` is present.
- [ ] **All Checks Pass**: Confirm `npm test`, `npm run typecheck`, and `npm run build` exit with code `0`.
- [ ] **Live Deployment Verified**:
  - [ ] Visit `https://<your-demo-url>/api/health` and confirm `aiConfigured: true`.
  - [ ] Test **Message Scanner** with both scam and benign messages in `EN` and `हिन्दी`.
  - [ ] Test **URL Scanner** with a phishing lookalike URL, IP URL, and official URL.
  - [ ] Test **Scam Awareness** tabs, Red-Flag checklist, and mobile responsive view.
- [ ] **Submission Assets Ready**:
  - [ ] Public Demo URL pasted into the hackathon submission form.
  - [ ] GitHub repository URL linked and set to Public (if required by judges).
  - [ ] 2–3 screenshots or a short walkthrough video showcasing English/Hindi toggle, AI Message Scanner, and Safe URL Scanner.
  - [ ] Clear summary of problem, solution, tech stack, and future roadmap ready for judges.
