import fs from 'fs';
import path from 'path';
import { OAuthGuide } from '@/types/guide';

const BUNDLED_GUIDES_DIR = path.join(process.cwd(), 'data', 'guides');
const TMP_GUIDES_DIR = path.join('/tmp', 'guides');

// In-memory fallback cache for serverless environments (e.g. Vercel)
declare global {
  var __memoryGuides: Map<string, OAuthGuide> | undefined;
}

if (!global.__memoryGuides) {
  global.__memoryGuides = new Map<string, OAuthGuide>();
}

export const memoryGuides = global.__memoryGuides;

export function getAllGuideSlugs(): string[] {
  const slugs = new Set<string>();

  // 1. Bundled guides
  if (fs.existsSync(BUNDLED_GUIDES_DIR)) {
    try {
      fs.readdirSync(BUNDLED_GUIDES_DIR)
        .filter((file) => file.endsWith('.json'))
        .forEach((file) => slugs.add(file.replace(/\.json$/, '')));
    } catch (e) {
      console.warn('Error reading bundled guides dir:', e);
    }
  }

  // 2. Serverless /tmp guides
  if (fs.existsSync(TMP_GUIDES_DIR)) {
    try {
      fs.readdirSync(TMP_GUIDES_DIR)
        .filter((file) => file.endsWith('.json'))
        .forEach((file) => slugs.add(file.replace(/\.json$/, '')));
    } catch (e) {
      // ignore
    }
  }

  // 3. In-memory guides
  memoryGuides.forEach((_, slug) => {
    slugs.add(slug);
  });

  return Array.from(slugs);
}

export function getGuideBySlug(slug: string): OAuthGuide | null {
  // Check memory first
  if (memoryGuides.has(slug)) {
    return memoryGuides.get(slug)!;
  }

  // Check bundled guides
  try {
    const bundledPath = path.join(BUNDLED_GUIDES_DIR, `${slug}.json`);
    if (fs.existsSync(bundledPath)) {
      const raw = fs.readFileSync(bundledPath, 'utf-8');
      const data = JSON.parse(raw) as OAuthGuide;
      return { ...data, slug };
    }
  } catch (error) {
    console.error(`Error reading bundled guide for slug: ${slug}`, error);
  }

  // Check /tmp guides (Vercel runtime fallback)
  try {
    const tmpPath = path.join(TMP_GUIDES_DIR, `${slug}.json`);
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, 'utf-8');
      const data = JSON.parse(raw) as OAuthGuide;
      return { ...data, slug };
    }
  } catch (error) {
    // ignore
  }

  return null;
}

export function getAllGuides(): OAuthGuide[] {
  const slugs = getAllGuideSlugs();
  const guides: OAuthGuide[] = [];

  for (const slug of slugs) {
    const guide = getGuideBySlug(slug);
    if (guide) {
      guides.push(guide);
    }
  }

  return guides.sort((a, b) => a.appName.localeCompare(b.appName));
}
