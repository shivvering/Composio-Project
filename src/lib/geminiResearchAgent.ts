import fs from 'fs';
import path from 'path';
import { OAuthGuide } from '@/types/guide';
import { validateOAuthGuide } from '@/lib/validateGuide';

const GUIDES_DIR = path.join(process.cwd(), 'data', 'guides');

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
 * Calls Gemini API with Google Search Grounding enabled.
 */
async function callGeminiWithSearch(
  prompt: string,
  apiKey: string,
  modelName: string = 'gemini-2.5-flash',
  timeoutMs: number = 45000
) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    tools: [
      {
        google_search: {},
      },
    ],
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (response.status === 404 && modelName === 'gemini-2.5-flash') {
      // Fallback to gemini-1.5-flash if 2.5 is not found in the region/project
      console.warn(`Model ${modelName} returned 404, falling back to gemini-1.5-flash`);
      return callGeminiWithSearch(prompt, apiKey, 'gemini-1.5-flash', timeoutMs);
    }

    if (response.status === 429 || response.status === 503 || !response.ok) {
      const errBody = await response.text().catch(() => '');
      console.error(`Gemini API error ${response.status}:`, errBody);
      throw new Error('This is busy, please try again in a minute.');
    }

    return await response.json();
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

  // 1. Check local cache first
  const querySlug = createSlug(cleanQuery);
  const cachePath = path.join(GUIDES_DIR, `${querySlug}.json`);

  if (fs.existsSync(cachePath)) {
    try {
      const cachedData = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      return {
        guide: { ...cachedData, slug: querySlug },
        cached: true,
        slug: querySlug,
      };
    } catch (e) {
      console.warn(`Error reading cached guide at ${cachePath}, regenerating...`);
    }
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
  if (!apiKey) {
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
4. Sources: Include only URLs found during your search. Do not hallucinate or invent URLs.
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
  const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
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
            title: chunk.web.title || 'Official Documentation / Search Result',
            url: chunk.web.uri,
          });
        }
      }
    }

    const parsedJson = extractJsonFromText(text);

    // Ensure sources are exclusively real search URLs if available
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

  // 5. Cache to /data/guides/{slug}.json
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
    console.error('Failed to cache guide to disk:', fsErr);
  }

  return {
    guide: finalGuide,
    cached: false,
    slug: finalSlug,
  };
}
