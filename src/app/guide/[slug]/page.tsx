import React from 'react';
import Link from 'next/link';
import { getGuideBySlug, getAllGuideSlugs } from '@/lib/guides';
import { researchAndGenerateGuide } from '@/lib/geminiResearchAgent';
import { DifficultyBadge } from '@/components/DifficultyBadge';
import { ConfidenceBadge } from '@/components/ConfidenceBadge';
import { TimeTimeline } from '@/components/TimeTimeline';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { PrintButton } from '@/components/PrintButton';
import { GuideNotFound } from '@/components/GuideNotFound';
import {
  ExternalLink,
  ChevronLeft,
  Calendar,
  ListOrdered,
  AlertTriangle,
  Bot,
  UserCheck,
  Layers,
  HelpCircle,
  FileCheck,
  CheckCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { Metadata } from 'next';

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  const slugs = getAllGuideSlugs();
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: GuidePageProps): Metadata {
  const guide = getGuideBySlug(params.slug);
  if (!guide) {
    return {
      title: 'Guide Not Found | OAuth Path',
    };
  }

  return {
    title: `${guide.appName} OAuth App & Approval Guide | OAuth Path`,
    description: `Complete developer setup, approval timelines, and blockers for ${guide.appName} OAuth 2.0 app integration.`,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  let guide = getGuideBySlug(params.slug);

  // If not found in static/bundled cache, attempt live research on demand
  if (!guide && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    try {
      const res = await researchAndGenerateGuide(params.slug);
      guide = res.guide;
    } catch (err) {
      console.warn(`On-demand research failed for "${params.slug}":`, err);
    }
  }

  // If still not available, show interactive generation view instead of 404
  if (!guide) {
    return <GuideNotFound slug={params.slug} />;
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Top Navigation & Breadcrumb */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
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
          <ChevronLeft size={16} />
          <span>Back to all guides</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <CopyLinkButton />
          <PrintButton />
        </div>
      </div>

      {/* Fallback Warning Banner if generated without Google Search grounding */}
      {guide.groundedWithSearch === false && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            backgroundColor: '#fffbeb',
            border: '2px solid #f59e0b',
            marginBottom: '1.25rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            lineHeight: 1.5,
            color: '#92400e',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0 }} />
          <span>
            Generated without web search. Treat everything on this page as unverified.
          </span>
        </div>
      )}

      {/* Visible AI-Generated Label with Date & Official Docs Reminder */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          padding: '0.9rem 1.15rem',
          borderRadius: '10px',
          backgroundColor: '#f5f3ff',
          border: '1px solid #ddd6fe',
          marginBottom: '1.25rem',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          color: '#5b21b6',
        }}
      >
        <Sparkles size={18} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>
            {guide.manuallyChecked
              ? `Manually Verified Guide (Last verified ${guide.lastVerified || guide.lastChecked}):`
              : `Generated on ${guide.lastChecked}:`}
          </strong>{' '}
          Provider OAuth rules and review policies change frequently — always verify current submission requirements with the{' '}
          <a
            href={guide.website}
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#6d28d9',
              fontWeight: 700,
              textDecoration: 'underline',
            }}
          >
            official {guide.appName} documentation
          </a>{' '}
          before submitting for production approval.
        </div>
      </div>

      {/* Guide Header Banner */}
      <header
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: 'var(--text-primary)',
                }}
              >
                {guide.appName}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <DifficultyBadge level={guide.difficulty.level} />
                {guide.difficulty.confidence && (
                  <ConfidenceBadge
                    confidence={guide.difficulty.confidence}
                    sourceUrl={guide.difficulty.sourceUrl}
                    size="sm"
                  />
                )}
              </div>
            </div>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {guide.difficulty.reason}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}
            >
              <a
                href={guide.website}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                }}
              >
                <span>{guide.website.replace(/^https?:\/\//, '')}</span>
                <ExternalLink size={14} />
              </a>

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} />
                <span>
                  {guide.manuallyChecked
                    ? `Last verified: ${guide.lastVerified || guide.lastChecked}`
                    : `Generated on ${guide.lastChecked}`}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Time Estimate Timeline */}
        <TimeTimeline timeEstimate={guide.timeEstimate} />

        {/* Prerequisites & Requirements */}
        <div style={{ marginTop: '1.25rem' }}>
          <div
            style={{
              fontSize: '0.825rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-muted)',
              marginBottom: '0.4rem',
            }}
          >
            Required Before Starting
          </div>
          <div className="reqs-list">
            {guide.requirements.map((req, i) => {
              const isObj = typeof req === 'object' && req !== null;
              const text = isObj ? req.text : req;
              const conf = isObj ? req.confidence : 'From official docs';
              const src = isObj ? req.sourceUrl : undefined;

              return (
                <span
                  key={i}
                  className="req-badge"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>• {text}</span>
                  <ConfidenceBadge confidence={conf} sourceUrl={src} size="sm" />
                </span>
              );
            })}
          </div>
        </div>
      </header>

      {/* Section 1: Step-by-Step Setup */}
      <section className="guide-section">
        <div className="guide-section-header">
          <ListOrdered size={20} color="var(--primary)" />
          <h2 className="guide-section-title">Step-by-Step Setup Guide</h2>
        </div>
        <p className="guide-section-subtitle">
          Follow these sequential actions to register your OAuth application and configure endpoints.
        </p>

        <div className="step-list">
          {guide.steps.map((step) => (
            <div key={step.stepNumber} className="step-card">
              <div className="step-number">{step.stepNumber}</div>
              <div className="step-content">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    marginBottom: '0.35rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <h3 className="step-title" style={{ margin: 0 }}>
                    {step.title}
                  </h3>
                  {step.confidence && (
                    <ConfidenceBadge
                      confidence={step.confidence}
                      sourceUrl={step.sourceUrl}
                      size="sm"
                    />
                  )}
                </div>
                <p className="step-desc">{step.description}</p>
                {step.actionUrl && (
                  <a
                    href={step.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="step-link"
                  >
                    <span>Open in {guide.appName} Console</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Likely Blockers & How to Fix Them */}
      <section className="guide-section">
        <div className="guide-section-header">
          <AlertTriangle size={20} color="#dc2626" />
          <h2 className="guide-section-title">Common Blockers & Fixes</h2>
        </div>
        <p className="guide-section-subtitle">
          Anticipate the pitfalls and approval rejections that catch most agent developers off guard.
        </p>

        <div className="blockers-grid">
          {guide.blockers.map((blocker, i) => (
            <div key={i} className="blocker-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginBottom: '0.4rem',
                  flexWrap: 'wrap',
                }}
              >
                <div className="blocker-problem" style={{ marginBottom: 0 }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  <span>{blocker.problem}</span>
                </div>
                {blocker.confidence && (
                  <ConfidenceBadge
                    confidence={blocker.confidence}
                    sourceUrl={blocker.sourceUrl}
                    size="sm"
                  />
                )}
              </div>
              <div className="blocker-solution">
                <strong style={{ color: 'var(--text-primary)' }}>Action Plan: </strong>
                {blocker.solution}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: What an agent can do vs what you must do */}
      <section className="guide-section">
        <div className="guide-section-header">
          <Layers size={20} color="var(--primary)" />
          <h2 className="guide-section-title">What an agent can do vs what you must do</h2>
        </div>
        <p className="guide-section-subtitle">
          A clear division of labor: tasks your autonomous agent can handle vs actions requiring human developer authorization.
        </p>

        <div className="agent-split-grid">
          <div className="agent-box agent">
            <div className="agent-box-title" style={{ color: 'var(--primary)' }}>
              <Bot size={18} />
              <span>What an Agent Can Do</span>
            </div>
            <ul className="agent-items-list">
              {guide.agentVsDeveloper.agentCanDo.map((item, i) => (
                <li key={i} className="agent-item">
                  <CheckCircle size={15} color="var(--primary)" className="agent-item-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="agent-box developer">
            <div className="agent-box-title" style={{ color: 'var(--text-primary)' }}>
              <UserCheck size={18} />
              <span>What You Must Do Yourself</span>
            </div>
            <ul className="agent-items-list">
              {guide.agentVsDeveloper.developerMustDo.map((item, i) => (
                <li key={i} className="agent-item">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--text-primary)',
                      marginTop: '6px',
                      flexShrink: 0,
                    }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 4: Managed Option (e.g. Composio) vs Custom Credentials */}
      <section className="guide-section">
        <div className="guide-section-header">
          <ShieldCheck size={20} color="#16a34a" />
          <h2 className="guide-section-title">Managed OAuth vs Custom Credentials</h2>
        </div>
        <p className="guide-section-subtitle">
          Evaluate whether using a managed integration platform (like Composio) is sufficient or if you must create your own app.
        </p>

        {/* Note required by prompt (e) */}
        <div
          style={{
            marginBottom: '1.25rem',
            padding: '0.85rem 1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span>
            This tool was built for a Composio assignment, and Composio sells managed OAuth.
          </span>
        </div>

        <div className="managed-grid">
          <div className="managed-card managed">
            <div className="managed-card-title" style={{ color: '#166534' }}>
              <CheckCircle size={17} />
              <span>When Managed OAuth is Enough</span>
            </div>
            <div className="managed-card-body">
              {guide.managedOption.managedSufficientWhen}
            </div>
          </div>

          <div className="managed-card custom">
            <div className="managed-card-title" style={{ color: 'var(--text-primary)' }}>
              <Layers size={17} />
              <span>When Custom Credentials are Required</span>
            </div>
            <div className="managed-card-body">
              {guide.managedOption.customRequiredWhen}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Key Claims & Confidence Breakdown */}
      <section className="guide-section">
        <div className="guide-section-header">
          <FileCheck size={20} color="var(--primary)" />
          <h2 className="guide-section-title">Key Claims & Verification Status</h2>
        </div>
        <p className="guide-section-subtitle">
          Specific factual statements evaluated against official documentation and live developer tests.
        </p>

        <div className="claims-list">
          {guide.claims.map((claim, i) => (
            <div key={i} className="claim-item">
              <span className="claim-text">{claim.claim}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <ConfidenceBadge confidence={claim.confidence} />
                {claim.sourceUrl && (
                  <a
                    href={claim.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-muted)' }}
                    title="View source document"
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Official Sources & Documentation */}
      <section className="guide-section">
        <div className="guide-section-header">
          <ExternalLink size={20} color="var(--text-secondary)" />
          <h2 className="guide-section-title">Official Sources & Documentation</h2>
        </div>
        <div className="sources-list">
          {guide.sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="source-item"
            >
              <ExternalLink size={14} />
              <span>{source.title}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Section 7: Open Questions & Unresolved Edge Cases */}
      {guide.openQuestions && guide.openQuestions.length > 0 && (
        <section className="guide-section">
          <div className="guide-section-header">
            <HelpCircle size={20} color="#b45309" />
            <h2 className="guide-section-title">Open Questions & Uncertainties</h2>
          </div>
          <p className="guide-section-subtitle">
            Areas currently subject to policy changes or requiring ongoing real-world verification.
          </p>
          <ul
            style={{
              paddingLeft: '1.25rem',
              color: 'var(--text-secondary)',
              fontSize: '0.925rem',
              lineHeight: 1.6,
            }}
          >
            {guide.openQuestions.map((q, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>
                {q}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
