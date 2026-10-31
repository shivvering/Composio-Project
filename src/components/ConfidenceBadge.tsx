import React from 'react';
import { CheckCircle2, FileText, HelpCircle, Users, ExternalLink } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence?: string;
  sourceUrl?: string;
  size?: 'sm' | 'md';
}

export function ConfidenceBadge({
  confidence = 'Unverified estimate',
  sourceUrl,
  size = 'md',
}: ConfidenceBadgeProps) {
  const norm = confidence.toLowerCase();

  let badgeClass = 'badge-confidence unverified';
  let label = confidence;
  let Icon = HelpCircle;

  if (norm.includes('official') || norm.includes('docs')) {
    badgeClass = 'badge-confidence docs';
    label = 'From official docs';
    Icon = FileText;
  } else if (norm.includes('community')) {
    badgeClass = 'badge-confidence community';
    label = 'Community reported';
    Icon = Users;
  } else if (norm.includes('verified correct') || norm === 'verified') {
    badgeClass = 'badge-confidence verified';
    label = 'Verified';
    Icon = CheckCircle2;
  } else {
    badgeClass = 'badge-confidence unverified';
    label = 'Unverified estimate';
    Icon = HelpCircle;
  }

  const isSmall = size === 'sm';

  const badgeContent = (
    <span
      className={badgeClass}
      style={{
        fontSize: isSmall ? '0.7rem' : '0.75rem',
        padding: isSmall ? '0.1rem 0.45rem' : '0.15rem 0.55rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
      }}
    >
      <Icon size={isSmall ? 11 : 13} />
      <span>{label}</span>
      {sourceUrl && (
        <ExternalLink
          size={isSmall ? 10 : 11}
          style={{ marginLeft: '2px', opacity: 0.8 }}
        />
      )}
    </span>
  );

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
        title={`View source (${label}): ${sourceUrl}`}
        style={{ display: 'inline-flex', textDecoration: 'none' }}
      >
        {badgeContent}
      </a>
    );
  }

  return badgeContent;
}
