import React from 'react';
import Link from 'next/link';
import { getVerificationLog } from '@/lib/verification';
import { VerificationTable } from '@/components/VerificationTable';
import { ShieldCheck, ArrowLeft, FileCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Verification Log | OAuth Path',
  description:
    'Full verification log tracking claims tested in production, corrected statements, and official documentation sources.',
};

export default function VerificationLogPage() {
  const entries = getVerificationLog();

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to guides</span>
        </Link>
      </div>

      {/* Header */}
      <div style={{ maxWidth: '800px', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--primary-subtle)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          <ShieldCheck size={14} />
          <span>Auditing & Accuracy</span>
        </div>

        <h1
          style={{
            fontSize: '2.3rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            marginBottom: '0.75rem',
            color: 'var(--text-primary)',
          }}
        >
          Verification Log
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
          }}
        >
          Every key claim across our guides is continuously cross-examined against real production
          behavior and official developer documentation. This log tracks our test findings,
          remedied assumptions, and items currently undergoing confirmation.
        </p>
      </div>

      {/* Interactive Filterable Table */}
      <VerificationTable initialEntries={entries} />
    </div>
  );
}
