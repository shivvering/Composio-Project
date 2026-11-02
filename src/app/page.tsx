import React from 'react';
import { getAllGuides } from '@/lib/guides';
import { SearchGuideList } from '@/components/SearchGuideList';
import { ShieldAlert, Zap, Clock, Compass } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const guides = getAllGuides();

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      {/* Hero & Problem Statement */}
      <section style={{ maxWidth: '780px' }}>
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
            marginBottom: '1rem',
          }}
        >
          <Compass size={14} />
          <span>The Developer Compass for AI Integrations</span>
        </div>

        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
          }}
        >
          Never get blindsided by third-party OAuth app approvals again.
        </h1>

        <p
          style={{
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem',
          }}
        >
          Building an AI agent is fast. Getting third-party OAuth apps approved is not.
          Every provider has different rules: some approve instantly, others demand weeks of security
          assessments, YouTube screen recordings, or verified domain ownership.
        </p>

        {/* Quick Problem Callout Card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Clock size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Unpredictable Wait Times</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Instant for GitHub, Linear and Notion. Up to about 10 days for Google sensitive scopes. Several weeks for Google restricted scopes, which need an annual security assessment.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShieldAlert size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Hidden Blocker Landmines</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Missing video URLs, unverified DNS records, or unexpected scope escalations.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                backgroundColor: '#dcfce7',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Zap size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Managed vs Custom</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Know when managed OAuth (like Composio) is enough vs when you need your own app.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Search & List */}
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '0.75rem',
            marginBottom: '0.5rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Available Provider Guides
          </h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            11 apps documented (7 pre checked, 4 generated by the live agent and not yet checked)
          </span>
        </div>

        <SearchGuideList initialGuides={guides} />
      </section>
    </div>
  );
}
