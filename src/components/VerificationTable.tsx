'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VerificationEntry, VerificationStatus } from '@/lib/verification';
import { CheckCircle2, AlertTriangle, HelpCircle, ExternalLink, Filter } from 'lucide-react';

interface VerificationTableProps {
  initialEntries: VerificationEntry[];
}

export function VerificationTable({ initialEntries }: VerificationTableProps) {
  const [filter, setFilter] = useState<'all' | VerificationStatus>('all');

  const filteredEntries = initialEntries.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified correct':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: '#dcfce7',
              color: '#166534',
              border: '1px solid #bbf7d0',
              whiteSpace: 'nowrap',
            }}
          >
            <CheckCircle2 size={13} />
            <span>Verified Correct</span>
          </span>
        );
      case 'corrected':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              whiteSpace: 'nowrap',
            }}
          >
            <AlertTriangle size={13} />
            <span>Corrected</span>
          </span>
        );
      case 'could not verify':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fde68a',
              whiteSpace: 'nowrap',
            }}
          >
            <HelpCircle size={13} />
            <span>Could Not Verify</span>
          </span>
        );
    }
  };

  const countFor = (s: 'all' | VerificationStatus) => {
    if (s === 'all') return initialEntries.length;
    return initialEntries.filter((e) => e.status === s).length;
  };

  return (
    <div>
      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          margin: '1.5rem 0',
        }}
      >
        <button
          onClick={() => setFilter('all')}
          className="btn-action"
          style={{
            backgroundColor: filter === 'all' ? 'var(--text-primary)' : 'var(--bg-surface)',
            color: filter === 'all' ? '#ffffff' : 'var(--text-secondary)',
            borderColor: filter === 'all' ? 'var(--text-primary)' : 'var(--border-light)',
          }}
        >
          All ({countFor('all')})
        </button>

        <button
          onClick={() => setFilter('verified correct')}
          className="btn-action"
          style={{
            backgroundColor: filter === 'verified correct' ? '#166534' : 'var(--bg-surface)',
            color: filter === 'verified correct' ? '#ffffff' : '#166534',
            borderColor: '#bbf7d0',
          }}
        >
          <CheckCircle2 size={13} />
          <span>Verified Correct ({countFor('verified correct')})</span>
        </button>

        <button
          onClick={() => setFilter('corrected')}
          className="btn-action"
          style={{
            backgroundColor: filter === 'corrected' ? '#1d4ed8' : 'var(--bg-surface)',
            color: filter === 'corrected' ? '#ffffff' : '#1d4ed8',
            borderColor: '#bfdbfe',
          }}
        >
          <AlertTriangle size={13} />
          <span>Corrected ({countFor('corrected')})</span>
        </button>

        <button
          onClick={() => setFilter('could not verify')}
          className="btn-action"
          style={{
            backgroundColor: filter === 'could not verify' ? '#92400e' : 'var(--bg-surface)',
            color: filter === 'could not verify' ? '#ffffff' : '#92400e',
            borderColor: '#fde68a',
          }}
        >
          <HelpCircle size={13} />
          <span>Could Not Verify ({countFor('could not verify')})</span>
        </button>
      </div>

      {/* Verification Log Table */}
      <div
        style={{
          overflowX: 'auto',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '10px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderBottom: '1px solid var(--border-light)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: '0.04em',
              }}
            >
              <th style={{ padding: '0.85rem 1rem', width: '130px' }}>Guide</th>
              <th style={{ padding: '0.85rem 1rem', minWidth: '220px' }}>Claim</th>
              <th style={{ padding: '0.85rem 1rem', width: '160px' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', width: '180px' }}>Source</th>
              <th style={{ padding: '0.85rem 1rem', minWidth: '220px' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom:
                    idx < filteredEntries.length - 1
                      ? '1px solid var(--border-light)'
                      : 'none',
                  verticalAlign: 'top',
                }}
              >
                {/* Guide Name */}
                <td style={{ padding: '1rem', fontWeight: 600 }}>
                  {entry.guideSlug ? (
                    <Link
                      href={`/guide/${entry.guideSlug}`}
                      style={{
                        color: 'var(--primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      {entry.guide}
                    </Link>
                  ) : (
                    <span>{entry.guide}</span>
                  )}
                </td>

                {/* Claim Statement */}
                <td style={{ padding: '1rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {entry.claim}
                </td>

                {/* Status Badge */}
                <td style={{ padding: '1rem' }}>
                  {getStatusBadge(entry.status)}
                </td>

                {/* Source Link */}
                <td style={{ padding: '1rem' }}>
                  {entry.source ? (
                    <a
                      href={entry.source}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: 'var(--primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontWeight: 500,
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>{entry.sourceTitle || 'View Source'}</span>
                      <ExternalLink size={13} style={{ flexShrink: 0 }} />
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>

                {/* Verification Notes */}
                <td
                  style={{
                    padding: '1rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {entry.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEntries.length === 0 && (
          <div
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            No verification records found matching this status filter.
          </div>
        )}
      </div>
    </div>
  );
}
