'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OAuthGuide } from '@/types/guide';
import { Sparkles, Loader2, ArrowLeft, AlertCircle, Compass } from 'lucide-react';

interface GuideNotFoundProps {
  slug: string;
}

const PROGRESS_STEPS = [
  'Searching Google for official developer documentation...',
  'Analyzing OAuth registration console & credentials...',
  'Checking verification rules, wait times & review tiers...',
  'Synthesizing common blockers, fixes & agent boundaries...',
  'Validating guide schema & finalizing shareable report...',
];

export function GuideNotFound({ slug }: GuideNotFoundProps) {
  const router = useRouter();
  const [isResearching, setIsResearching] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const readableName = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Check if guide exists in sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('guide_' + slug);
        if (cached) {
          // If cached in sessionStorage, refresh to render
          window.location.reload();
        }
      } catch (e) {
        // ignore
      }
    }
  }, [slug]);

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

  const handleGenerate = async () => {
    setIsResearching(true);
    setError(null);
    setCurrentStepIndex(0);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: readableName }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'This is busy, please try again in a minute.');
      }

      if (typeof window !== 'undefined' && data.guide) {
        sessionStorage.setItem('guide_' + (data.slug || slug), JSON.stringify(data.guide));
      }

      // Reload to render the newly generated guide
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'This is busy, please try again in a minute.');
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: '680px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
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
          <span>Back to directory</span>
        </Link>
      </div>

      <div
        style={{
          padding: '2.5rem 2rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#f3e8ff',
            color: '#7c3aed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
          }}
        >
          <Sparkles size={24} />
        </div>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '0.75rem',
            color: 'var(--text-primary)',
          }}
        >
          Generate Guide for &ldquo;{readableName}&rdquo;
        </h1>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '1.75rem',
          }}
        >
          An OAuth guide for <strong>{readableName}</strong> is ready to be researched.
          Our live agent will search official developer documentation, verify approval rules,
          and build a structured guide for you.
        </p>

        {isResearching ? (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#f5f3ff',
              borderRadius: '8px',
              border: '1px solid #ddd6fe',
              textAlign: 'left',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#5b21b6', fontWeight: 700 }}>
              <Loader2 size={18} style={{ animation: 'spin 1.2s linear infinite' }} />
              <span>Researching {readableName}...</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PROGRESS_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: '0.85rem',
                    color: idx === currentStepIndex ? '#5b21b6' : idx < currentStepIndex ? '#15803d' : '#9ca3af',
                    fontWeight: idx === currentStepIndex ? 600 : 500,
                  }}
                >
                  {idx < currentStepIndex ? '✓ ' : idx === currentStepIndex ? '● ' : '○ '}
                  {step}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleGenerate}
              className="btn-action"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                borderColor: 'var(--primary)',
                padding: '0.65rem 1.25rem',
                fontSize: '0.95rem',
              }}
            >
              <Sparkles size={16} />
              <span>Generate Guide Live</span>
            </button>

            <Link
              href="/"
              className="btn-action"
              style={{
                padding: '0.65rem 1.25rem',
                fontSize: '0.95rem',
              }}
            >
              Browse Catalog
            </Link>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#991b1b',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textAlign: 'left',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
