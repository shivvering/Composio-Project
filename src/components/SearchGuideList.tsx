'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { OAuthGuide } from '@/types/guide';
import { DifficultyBadge } from './DifficultyBadge';
import { Search, ArrowRight, ExternalLink, Clock, Hourglass, Sparkles } from 'lucide-react';

interface SearchGuideListProps {
  initialGuides: OAuthGuide[];
}

export function SearchGuideList({ initialGuides }: SearchGuideListProps) {
  const [query, setQuery] = useState('');

  const filteredGuides = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialGuides;

    return initialGuides.filter((guide) => {
      const matchName = guide.appName.toLowerCase().includes(q);
      const matchSite = guide.website.toLowerCase().includes(q);
      const matchDifficulty = guide.difficulty.level.toLowerCase().includes(q);
      const matchRequirements = guide.requirements.some((r) =>
        r.toLowerCase().includes(q)
      );
      return matchName || matchSite || matchDifficulty || matchRequirements;
    });
  }, [query, initialGuides]);

  const isCustomQuery =
    query.trim().length > 0 &&
    !filteredGuides.some(
      (g) => g.appName.toLowerCase() === query.trim().toLowerCase()
    );

  return (
    <div>
      {/* Search Bar Container */}
      <div className="search-container" style={{ margin: '2rem 0' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            boxShadow: 'var(--shadow-md)',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
            transition: 'border-color 0.15s ease',
          }}
        >
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '1.1rem',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Look up an app or paste its website (e.g. Slack, Notion, Google)..."
            style={{
              width: '100%',
              padding: '1.1rem 1.1rem 1.1rem 3.25rem',
              fontSize: '1.05rem',
              border: 'none',
              outline: 'none',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: '1rem',
                border: 'none',
                background: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                padding: '0.25rem 0.5rem',
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '1.25rem',
          marginTop: '1.5rem',
        }}
      >
        {filteredGuides.map((guide) => {
          const guideSlug = guide.slug || guide.appName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          return (
            <Link
              key={guide.appName}
              href={`/guide/${guideSlug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {guide.appName}
                  </h3>
                  <DifficultyBadge level={guide.difficulty.level} />
                </div>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.25rem',
                    lineHeight: '1.45',
                  }}
                >
                  {guide.difficulty.reason}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    padding: '0.75rem 0.85rem',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: '6px',
                    fontSize: '0.825rem',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Clock size={14} color="var(--primary)" />
                    <span style={{ color: 'var(--text-muted)' }}>Setup:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {guide.timeEstimate.setupTime}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Hourglass size={14} color="#d97706" />
                    <span style={{ color: 'var(--text-muted)' }}>Approval wait:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {guide.timeEstimate.approvalWait}
                    </strong>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-light)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                }}
              >
                <span>View Full OAuth Guide</span>
                <ArrowRight size={16} />
              </div>
            </Link>
          );
        })}

        {/* Live Research Suggestion Card if search yields unmatched app */}
        {isCustomQuery && (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#faf5ff',
              border: '2px dashed #c084fc',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#7e22ce',
                  backgroundColor: '#f3e8ff',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  marginBottom: '0.75rem',
                }}
              >
                <Sparkles size={13} />
                Live Research
              </div>

              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#581c87',
                  marginBottom: '0.5rem',
                }}
              >
                Research &ldquo;{query}&rdquo;
              </h3>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#6b21a8',
                  lineHeight: '1.45',
                  marginBottom: '1rem',
                }}
              >
                This app isn&apos;t in the catalog yet. The live agent engine can scrape the
                developer docs, analyze approval requirements, and generate an OAuth guide on the fly.
              </p>
            </div>

            <div
              style={{
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#7e22ce',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>Live Agent Research Ready</span>
              <Sparkles size={14} />
            </div>
          </div>
        )}
      </div>

      {filteredGuides.length === 0 && !isCustomQuery && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--text-muted)',
          }}
        >
          No guides found matching your query.
        </div>
      )}
    </div>
  );
}
