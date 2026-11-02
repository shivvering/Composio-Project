'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OAuthGuide } from '@/types/guide';
import { DifficultyBadge } from './DifficultyBadge';
import {
  Search,
  ArrowRight,
  Clock,
  Hourglass,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface SearchGuideListProps {
  initialGuides: OAuthGuide[];
}

const PROGRESS_STEPS = [
  'Searching Google for official developer documentation...',
  'Analyzing OAuth registration console & credentials...',
  'Checking verification rules, wait times & review tiers...',
  'Synthesizing common blockers, fixes & agent boundaries...',
  'Validating guide schema & finalizing shareable report...',
];

export function SearchGuideList({ initialGuides }: SearchGuideListProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [guides, setGuides] = useState<OAuthGuide[]>(initialGuides);

  // Live research agent states
  const [isResearching, setIsResearching] = useState(false);
  const [researchTarget, setResearchTarget] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cycle progress messages while researching
  useEffect(() => {
    if (!isResearching) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) =>
        prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isResearching]);

  const filteredGuides = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guides;

    return guides.filter((guide) => {
      const matchName = guide.appName.toLowerCase().includes(q);
      const matchSite = guide.website.toLowerCase().includes(q);
      const matchDifficulty = guide.difficulty.level.toLowerCase().includes(q);
      const matchRequirements = guide.requirements.some((r) => {
        const text = typeof r === 'string' ? r : r.text;
        return text.toLowerCase().includes(q);
      });
      return matchName || matchSite || matchDifficulty || matchRequirements;
    });
  }, [query, guides]);

  const exactMatchExists = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.some((g) => g.appName.toLowerCase() === q);
  }, [query, guides]);

  const handleStartResearch = async (targetApp: string) => {
    const appToResearch = targetApp.trim();
    if (!appToResearch || isResearching) return;

    setIsResearching(true);
    setResearchTarget(appToResearch);
    setErrorMessage(null);
    setCurrentStepIndex(0);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: appToResearch }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'This is busy, please try again in a minute.');
      }

      // Add to local state if new
      if (data.guide && !guides.some((g) => g.appName === data.guide.appName)) {
        setGuides((prev) => [data.guide, ...prev]);
      }

      // Store in sessionStorage for instant retrieval across Vercel serverless cold starts
      if (typeof window !== 'undefined' && data.guide && data.slug) {
        try {
          sessionStorage.setItem('guide_' + data.slug, JSON.stringify(data.guide));
        } catch (e) {}
      }

      // Route directly to the shareable guide page with a full navigation
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Research error:', err);
      setErrorMessage(err.message || 'This is busy, please try again in a minute.');
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div>
      {/* Search Input Bar */}
      <div className="search-container" style={{ margin: '2rem 0 1.25rem 0' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (filteredGuides.length === 0 && query.trim()) {
              handleStartResearch(query);
            }
          }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            boxShadow: 'var(--shadow-md)',
            borderRadius: '10px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-strong)',
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
            disabled={isResearching}
            onChange={(e) => {
              setQuery(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="Look up an app or paste its website (e.g. Slack, GitHub, Linear, Stripe)..."
            style={{
              width: '100%',
              padding: '1.1rem 7.5rem 1.1rem 3.25rem',
              fontSize: '1.05rem',
              border: 'none',
              outline: 'none',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              right: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            {query && !isResearching && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setErrorMessage(null);
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '0.25rem 0.5rem',
                }}
              >
                Clear
              </button>
            )}

            {query.trim().length > 0 && !exactMatchExists && !isResearching && (
              <button
                type="button"
                onClick={() => handleStartResearch(query)}
                className="btn-action"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  borderColor: 'var(--primary)',
                  fontSize: '0.825rem',
                  padding: '0.45rem 0.75rem',
                }}
              >
                <Sparkles size={13} />
                <span>Research</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Live Research Progress Overlay / Box */}
      {isResearching && (
        <div
          style={{
            margin: '1.5rem 0',
            padding: '1.75rem',
            backgroundColor: '#f5f3ff',
            borderRadius: '10px',
            border: '2px solid #8b5cf6',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Loader2 size={24} color="#7c3aed" style={{ animation: 'spin 1.2s linear infinite' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#5b21b6' }}>
                AI Research Agent Active: &ldquo;{researchTarget}&rdquo;
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6d28d9' }}>
                Grounding with Google Search across official documentation
              </div>
            </div>
          </div>

          {/* Stepper Progress Visualizer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.25rem' }}>
            {PROGRESS_STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.9rem',
                    color: isCurrent ? '#5b21b6' : isDone ? '#15803d' : '#9ca3af',
                    fontWeight: isCurrent ? 600 : 500,
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={16} color="#16a34a" />
                  ) : isCurrent ? (
                    <Loader2 size={16} color="#7c3aed" style={{ animation: 'spin 1.2s linear infinite' }} />
                  ) : (
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '1.5px solid #d1d5db',
                      }}
                    />
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div
          style={{
            margin: '1.25rem 0',
            padding: '1rem 1.25rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: '#991b1b', fontSize: '0.925rem' }}>
              {errorMessage}
            </div>
            {query && (
              <button
                onClick={() => handleStartResearch(query)}
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#dc2626',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Retry Research
              </button>
            )}
          </div>
        </div>
      )}

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
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                        margin: 0,
                      }}
                    >
                      {guide.appName}
                    </h3>
                    {['discord', 'plaid', 'spotify', 'zoom'].includes((guide.slug || guide.appName).toLowerCase()) && (
                      <span
                        style={{
                          fontSize: '0.675rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          border: '1px solid #fde68a',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Generated live, unchecked
                      </span>
                    )}
                  </div>
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
        {query.trim().length > 0 && !exactMatchExists && !isResearching && (
          <div
            onClick={() => handleStartResearch(query)}
            style={{
              padding: '1.5rem',
              backgroundColor: '#faf5ff',
              border: '2px dashed #c084fc',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3e8ff';
              e.currentTarget.style.borderColor = '#9333ea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#faf5ff';
              e.currentTarget.style.borderColor = '#c084fc';
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
                Live Agent Research
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
                This app isn&apos;t in the catalog yet. Click here to trigger the Gemini live research
                agent to scrape developer docs and generate a verified guide.
              </p>
            </div>

            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#7e22ce',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>Click to Start Live Research</span>
              <Sparkles size={15} />
            </div>
          </div>
        )}
      </div>

      {filteredGuides.length === 0 && query.trim().length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--text-muted)',
          }}
        >
          No guides available yet.
        </div>
      )}
    </div>
  );
}
