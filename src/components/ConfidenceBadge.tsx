import React from 'react';
import { ClaimConfidence } from '@/types/guide';
import { CheckCircle2, FileText, HelpCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: ClaimConfidence;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  if (confidence === 'verified') {
    return (
      <span className="badge-confidence verified">
        <CheckCircle2 size={13} />
        Verified (Tested)
      </span>
    );
  }

  if (confidence === 'from official docs') {
    return (
      <span className="badge-confidence docs">
        <FileText size={13} />
        From Official Docs
      </span>
    );
  }

  return (
    <span className="badge-confidence unverified">
      <HelpCircle size={13} />
      Unverified
    </span>
  );
}
