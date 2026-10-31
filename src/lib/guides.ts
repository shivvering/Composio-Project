import fs from 'fs';
import path from 'path';
import { OAuthGuide } from '@/types/guide';

const GUIDES_DIR = path.join(process.cwd(), 'data', 'guides');

export function getAllGuideSlugs(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) {
    return [];
  }
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''));
}

export function getGuideBySlug(slug: string): OAuthGuide | null {
  try {
    const filePath = path.join(GUIDES_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw) as OAuthGuide;
    return {
      ...data,
      slug,
    };
  } catch (error) {
    console.error(`Error reading guide for slug: ${slug}`, error);
    return null;
  }
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

  // Sort: hard first or easy first? Let's sort alphabetically or stable order
  return guides.sort((a, b) => a.appName.localeCompare(b.appName));
}
