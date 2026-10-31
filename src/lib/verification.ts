import fs from 'fs';
import path from 'path';

export type VerificationStatus = 'verified correct' | 'corrected' | 'could not verify';

export interface VerificationEntry {
  guide: string;
  guideSlug?: string;
  claim: string;
  source: string;
  sourceTitle?: string;
  status: VerificationStatus;
  notes: string;
}

const VERIFICATION_FILE = path.join(process.cwd(), 'data', 'verification.json');

export function getVerificationLog(): VerificationEntry[] {
  try {
    if (!fs.existsSync(VERIFICATION_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(VERIFICATION_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  } catch (err) {
    console.error('Error reading verification log:', err);
    return [];
  }
}
