# OAuth Path 🧭

> Clear, developer-tested guides on navigating OAuth setup, approval wait times, and compliance requirements for AI agent builders.

Connecting an AI agent to third-party services like Gmail, Slack, and Notion is quick in code, but navigating third-party OAuth app approvals is confusing and unpredictable. Every provider is different: approval can take hours or weeks, and developers often have to email providers or get blocked by unexpected CASA security audits.

**OAuth Path** provides clear, structured, shareable guides for popular providers, plus a **live research agent** that can research any unlisted app or website on demand using Google Search grounding.

---

## 🚀 Setup & Local Development

### Prerequisites
* **Node.js** >= 18.17 (Node 20 or 24 recommended)
* **npm**, **pnpm**, or **yarn**
* A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Install Dependencies
```bash
git clone <repo-url>
cd oauth-path
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> **Security Note:** Secrets are strictly loaded from environment variables. `.env*` files are excluded in `.gitignore` and never committed to the repository.

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/new), click **Add New Project** and select this repository.
3. In **Project Settings** > **Environment Variables**, add:
   * **Key:** `GEMINI_API_KEY`
   * **Value:** `your_gemini_api_key_here`
4. Click **Deploy**. Vercel will build and serve the App Router application immediately.

---

## 🛠️ Tools & Stack Used

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict schema-first typing)
* **AI Research Engine:** Google Gemini API (`gemini-flash-lite-latest` / `gemini-3.5-flash-lite`) with native **Google Search Grounding**
* **Icons:** [Lucide React](https://lucide.dev/) (Lightweight, accessible tree-shakeable icons)
* **Styling:** Custom CSS with CSS variables and print-optimized stylesheets (`@media print`)

---

## 🏛️ Key Architectural Decisions

1. **Schema-First Canonical Structure:**
   Every guide (whether manually curated or generated via AI) validates against an explicit JSON schema and TypeScript interface ([`src/types/guide.ts`](src/types/guide.ts)). This guarantees that essential dimensions—such as difficulty rating, setup vs. approval wait timeline, blockers, agent boundaries, and confidence levels—are always present.

2. **Grounding with Google Search:**
   Rather than relying purely on pre-trained parametric memory (which hallucinates outdated review policies), the live research agent (`POST /api/generate`) utilizes Google Search grounding to retrieve real developer documentation. Source URLs are extracted directly from grounding chunks to prevent URL hallucination.

3. **Two-Tier Resilient Storage (Vercel Ready):**
   Standard guides are bundled directly in `/data/guides/` as JSON. In serverless environments like Vercel (where the project directory is read-only at runtime), newly generated guides automatically write to `/tmp/guides/` and are held in an in-memory cache, ensuring the application never crashes with `EROFS` errors.

4. **1-Shot Error Feedback Loop:**
   If a model output fails schema validation on the first attempt, the specific validation errors are dynamically fed back into the prompt for an automated single retry before throwing an error.

5. **Print & PDF-Friendly Layouts:**
   Every guide includes dedicated `@media print` rules that hide navigation and chrome, prevent card splitting across page breaks, and format URLs into readable footnote citations for easy distribution to compliance and legal teams.

---

## ⚠️ Limitations

* **Provider Policy Drift:** Third-party developer portals change their submission procedures, review criteria, and pricing tiers frequently. While the verification confidence labels (`verified`, `from official docs`, `unverified`) reflect the state at `lastChecked`, production teams must always verify with live provider docs.
* **Agent Automation Boundaries:** AI agents can draft manifests, construct PKCE challenge parameters, and write justification narratives, but they cannot solve CAPTCHAs, pass 2FA SMS challenges, accept legal agreements, or pay third-party security lab audit fees on behalf of developers.
* **Serverless Ephemeral Storage:** On Vercel, dynamically generated guides saved to `/tmp` and memory persist for the lifetime of the warm lambda container. In high-traffic production, persisting dynamic guides permanently across global serverless edges would require an external store like Vercel KV, Redis, or PostgreSQL.
* **Free-Tier Search Quotas:** Free-tier Gemini keys have strict request-per-minute and daily caps for Google Search grounding. When search quota is exceeded, the research engine falls back to direct model knowledge.

---

## 🐛 Known Bugs & Quirks (Honest Assessment)

1. **Vercel Cache Lifetime on Cold Starts:**
   Newly generated guides created by one user in a serverless lambda are stored in `/tmp` and memory. When Vercel spins down or relocates the lambda instance, those dynamically researched guides will be regenerated on the next request unless they were committed to the `/data/guides` repository folder.
2. **Google Search Tool Rate Limits (HTTP 429):**
   If a user submits multiple live research requests in quick succession on a standard free-tier Gemini API key, Google Search grounding may trigger a `429 RESOURCE_EXHAUSTED` status. The agent catches this and falls back to model retrieval, but deep inline citations may be limited.
3. **Multi-page Safari Print Scaling:**
   When printing long guides to PDF in Safari on macOS, Safari may occasionally break long code blocks or blocker cards across two pages awkwardly. Firefox and Chromium render the `@media print` page-break rules cleanly.
4. **Dynamic Slug Collisions:**
   If a user researches a generic or punctuated query (e.g. `Google (sensitive)` vs `Google`), slugs are normalized to kebab-case (`google-sensitive`). If two queries resolve to identical normalized slugs, the cache will treat them as the same application.
