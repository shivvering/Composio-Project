import React from 'react';
import Link from 'next/link';
import {
  Compass,
  FileText,
  ShieldCheck,
  Bot,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How it works | OAuth Path',
  description:
    'An honest explanation of how OAuth Path guides are drafted, labeled, checked, and limited.',
};

export default function HowItWorksPage() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '780px' }}>
        {/* Header */}
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
          <span>Transparency & Methodology</span>
        </div>

        <h1
          style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
          }}
        >
          How it works
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
          }}
        >
          An honest explanation of how guides are generated, what was tested, what the AI does, and where the limits are.
        </p>

        {/* Section 1: How guides are made */}
        <section
          style={{
            marginBottom: '1.75rem',
            padding: '1.5rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Sparkles size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              How guides are made
            </h2>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
            An AI agent (Gemini with Google Search) drafts each guide in a fixed format. Source links come from the search results, and links that do not load are removed.
          </p>
        </section>

        {/* Section 2: Confidence labels */}
        <section
          style={{
            marginBottom: '1.75rem',
            padding: '1.5rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <FileText size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Confidence labels
            </h2>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
            <strong>From official docs</strong>, <strong>Community reported</strong>, <strong>Unverified estimate</strong>. The AI assigns these labels. I checked a sample by hand, and those checks are in the{' '}
            <Link
              href="/verification-log"
              style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
            >
              Verification Log
            </Link>
            .
          </p>
        </section>

        {/* Section 3: What I tested myself */}
        <section
          style={{
            marginBottom: '1.75rem',
            padding: '1.5rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <ShieldCheck size={20} color="#16a34a" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              What I tested myself
            </h2>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
            I created a Google OAuth app in testing mode and set up basic scopes. Everything else comes from documentation.
          </p>
        </section>

        {/* Section 4: When search is unavailable */}
        <section
          style={{
            marginBottom: '1.75rem',
            padding: '1.5rem',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={20} color="#d97706" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#92400e' }}>
              When search is unavailable
            </h2>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: 1.65, color: '#92400e', margin: 0 }}>
            If the search quota runs out, the agent runs without web search and the guide is marked as unverified.
          </p>
        </section>

        {/* Section 5: Limits */}
        <section
          style={{
            marginBottom: '1.75rem',
            padding: '1.5rem',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <Bot size={20} color="#64748b" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Limits
            </h2>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
            The AI can read and summarise documentation. It cannot register apps, accept terms or pass reviews for a developer.
          </p>
        </section>

        {/* Section 6: Disclosure */}
        <section
          style={{
            marginBottom: '2.5rem',
            padding: '1.5rem',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <ShieldCheck size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Disclosure
            </h2>
          </div>
          <p style={{ fontSize: '1rem', lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
            This site was built for a Composio assignment, and Composio sells managed OAuth.
          </p>
        </section>

        {/* Call to action */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'var(--primary-subtle)',
            borderRadius: '10px',
            border: '1px solid #bfdbfe',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
            Explore Guides
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#1e40af', margin: 0 }}>
            View documented setups, timelines, and common blockers for third-party developer platforms.
          </p>
          <div>
            <Link
              href="/"
              className="btn-action"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                borderColor: 'var(--primary)',
              }}
            >
              <span>Browse Guides</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
