import fs from 'fs';
import path from 'path';
import { OAuthGuide } from '@/types/guide';
import { validateOAuthGuide } from '@/lib/validateGuide';
import { memoryGuides, getGuideBySlug } from '@/lib/guides';

const GUIDES_DIR = path.join(process.cwd(), 'data', 'guides');
const TMP_GUIDES_DIR = path.join('/tmp', 'guides');

export function createSlug(appName: string): string {
  return appName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Extracts JSON content even if wrapped in markdown code blocks.
 */
function extractJsonFromText(rawText: string): any {
  let cleaned = rawText.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  // Find outermost JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

/**
 * Calls Gemini API with Google Search Grounding enabled (with graceful fallback if search quota is exhausted).
 */
async function callGeminiWithSearch(
  prompt: string,
  apiKey: string,
  modelName: string = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest',
  timeoutMs: number = 45000,
  enableSearch: boolean = true
): Promise<any> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;

  const payload: any = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  if (enableSearch) {
    payload.tools = [
      {
        google_search: {},
      },
    ];
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timer);

    // If 404 on the specific model, try gemini-flash-latest
    if (response.status === 404 && modelName !== 'gemini-flash-latest') {
      console.warn(`Model ${modelName} returned 404, attempting gemini-flash-latest`);
      return callGeminiWithSearch(prompt, apiKey, 'gemini-flash-latest', timeoutMs, enableSearch);
    }

    // If search grounding specifically threw a 429 quota exhaustion, retry once without search tool
    if (response.status === 429 && enableSearch) {
      console.warn('Search grounding quota limit hit (429). Falling back to direct model knowledge.');
      return callGeminiWithSearch(prompt, apiKey, modelName, timeoutMs, false);
    }

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error(`Gemini API error ${response.status}:`, errBody);
      throw new Error('This is busy, please try again in a minute.');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    clearTimeout(timer);
    if (error.name === 'AbortError') {
      console.error('Gemini API call timed out.');
      throw new Error('This is busy, please try again in a minute.');
    }
    if (error.message === 'This is busy, please try again in a minute.') {
      throw error;
    }
    console.error('Gemini network/API error:', error);
    throw new Error('This is busy, please try again in a minute.');
  }
}

/**
 * Main Live Research Agent function.
 */
export async function researchAndGenerateGuide(query: string): Promise<{
  guide: OAuthGuide;
  cached: boolean;
  slug: string;
}> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    throw new Error('A valid app name or website is required.');
  }

  // 1. Check local cache first (in-memory, bundled, or /tmp)
  const querySlug = createSlug(cleanQuery);
  const existingGuide = getGuideBySlug(querySlug);
  if (existingGuide) {
    return {
      guide: existingGuide,
      cached: true,
      slug: querySlug,
    };
  }

  // Check if any existing file matches by appName or website
  if (fs.existsSync(GUIDES_DIR)) {
    const existingFiles = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.json'));
    for (const file of existingFiles) {
      try {
        const fileContent = JSON.parse(
          fs.readFileSync(path.join(GUIDES_DIR, file), 'utf-8')
        );
        const matchName =
          fileContent.appName?.toLowerCase() === cleanQuery.toLowerCase();
        const matchWeb =
          fileContent.website?.toLowerCase().includes(cleanQuery.toLowerCase());
        if (matchName || matchWeb) {
          const matchedSlug = file.replace(/\.json$/, '');
          return {
            guide: { ...fileContent, slug: matchedSlug },
            cached: true,
            slug: matchedSlug,
          };
        }
      } catch (err) {
        // ignore invalid files
      }
    }
  }

  // 2. Validate API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your environment variables to use live research.'
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const buildPrompt = (extraFeedback?: string) => `
You are an expert AI infrastructure researcher researching OAuth 2.0 app registration and approval processes for developers building AI agents.
Research the OAuth 2.0 app setup and approval requirements for: "${cleanQuery}".

INSTRUCTIONS:
1. Use official developer documentation as your primary source.
2. Find:
   - Where the OAuth app is registered (exact developer portal URL)
   - Required fields, verification steps, and scopes
   - Review or verification rules (e.g., app store review, trust & safety verification, CASA security assessments)
   - Stated or reported approval wait times and active developer setup times
   - Common blockers and pitfalls developers face (and actionable solutions)
   - Division of labor: what an AI agent can automate (e.g. manifest generation, PKCE exchange) vs what a human developer must do (e.g. 2FA login, paying fees, DNS verification)
   - Managed OAuth comparison: when using managed OAuth (like Composio) is sufficient vs when the developer needs custom credentials
3. DO NOT GUESS. If something cannot be confirmed from official sources, mark the claim as "unverified" and add the uncertainty to "openQuestions".
4. Sources: Include only URLs found during search or official developer documentation. Do not invent non-existent URLs.
5. Return ONLY a valid JSON object strictly matching this TypeScript structure:

{
  "appName": string,
  "website": string,
  "lastChecked": "${today}",
  "difficulty": {
    "level": "easy" | "medium" | "hard",
    "reason": string
  },
  "timeEstimate": {
    "setupTime": string,
    "approvalWait": string,
    "notes": string
  },
  "requirements": string[],
  "steps": [
    {
      "stepNumber": number,
      "title": string,
      "description": string,
      "actionUrl": string (optional URL to developer console)
    }
  ],
  "blockers": [
    {
      "problem": string,
      "solution": string
    }
  ],
  "agentVsDeveloper": {
    "agentCanDo": string[],
    "developerMustDo": string[]
  },
  "managedOption": {
    "managedSufficientWhen": string,
    "customRequiredWhen": string
  },
  "sources": [
    {
      "title": string,
      "url": string
    }
  ],
  "claims": [
    {
      "claim": string,
      "confidence": "verified" | "from official docs" | "unverified",
      "sourceUrl": string (optional)
    }
  ],
  "openQuestions": string[]
}

${extraFeedback ? `\nPREVIOUS ATTEMPT FAILED WITH THESE ERRORS:\n${extraFeedback}\nPlease fix these errors and return valid JSON only.` : ''}
`;

  // 3. First execution
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
  let rawResponse = await callGeminiWithSearch(buildPrompt(), apiKey, primaryModel);

  const parseAndExtractSources = (response: any) => {
    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('This is busy, please try again in a minute.');
    }

    // Extract grounding URLs from Google Search metadata
    const searchSources: Array<{ title: string; url: string }> = [];
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks;
    if (Array.isArray(groundingChunks)) {
      for (const chunk of groundingChunks) {
        if (chunk?.web?.uri) {
          searchSources.push({
            title: chunk.web.title || 'Official Documentation',
            url: chunk.web.uri,
          });
        }
      }
    }

    const parsedJson = extractJsonFromText(text);

    // If Google Search grounding chunks are present, enforce them as the source URLs
    if (searchSources.length > 0) {
      parsedJson.sources = searchSources;
    }

    return parsedJson;
  };

  let parsed: any;
  try {
    parsed = parseAndExtractSources(rawResponse);
  } catch (err: any) {
    console.warn('First parse failed:', err.message);
  }

  let validation = validateOAuthGuide(parsed);

  // 4. Retry once if validation fails
  if (!validation.valid) {
    console.warn('Initial validation failed with errors:', validation.errors);
    const feedback = validation.errors.join('\n');
    try {
      rawResponse = await callGeminiWithSearch(buildPrompt(feedback), apiKey, primaryModel);
      parsed = parseAndExtractSources(rawResponse);
      validation = validateOAuthGuide(parsed);
    } catch (retryErr: any) {
      console.error('Retry attempt failed:', retryErr);
      throw new Error('This is busy, please try again in a minute.');
    }
  }

  if (!validation.valid || !validation.guide) {
    console.error('Second validation failed:', validation.errors);
    throw new Error('This is busy, please try again in a minute.');
  }

  const finalGuide = validation.guide;
  const finalSlug = createSlug(finalGuide.appName) || querySlug;
  finalGuide.slug = finalSlug;

  // 5. Cache in memory and write to disk
  memoryGuides.set(finalSlug, finalGuide);

  try {
    if (!fs.existsSync(GUIDES_DIR)) {
      fs.mkdirSync(GUIDES_DIR, { recursive: true });
    }
    fs.writeFileSync(
      path.join(GUIDES_DIR, `${finalSlug}.json`),
      JSON.stringify(finalGuide, null, 2),
      'utf-8'
    );
  } catch (fsErr) {
    // If running in a serverless environment with a read-only filesystem (e.g., Vercel), fallback to /tmp
    try {
      if (!fs.existsSync(TMP_GUIDES_DIR)) {
        fs.mkdirSync(TMP_GUIDES_DIR, { recursive: true });
      }
      fs.writeFileSync(
        path.join(TMP_GUIDES_DIR, `${finalSlug}.json`),
        JSON.stringify(finalGuide, null, 2),
        'utf-8'
      );
    } catch (tmpErr) {
      console.warn('Could not write to disk or /tmp in serverless environment, retained in memory:', tmpErr);
    }
  }

  return {
    guide: finalGuide,
    cached: false,
    slug: finalSlug,
  };
}
