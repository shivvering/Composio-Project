import React from 'react';
import Link from 'next/link';
import {
  Compass,
  CheckCircle2,
  FileText,
  HelpCircle,
  ShieldCheck,
  Bot,
  User,
  Zap,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How This Was Built & Checked | OAuth Path',
  description:
    'Methodology, verification standards, and architectural design behind OAuth Path and AI agent app approvals.',
};

export default function HowItWorksPage() {
  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px' }}>
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
          How OAuth Path was built and checked
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
          }}
        >
          Connecting an AI agent to real-world software shouldn&apos;t require emailing provider
          support teams or uncovering surprise compliance audits after weeks of engineering. Here
          is how we research, verify, and structure each guide.
        </p>

        {/* Section 1: The Verification Pyramid */}
        <section
          style={{
            marginBottom: '3rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
            }}
          >
            1. The Three-Tier Confidence Standard
          </h2>
          <p
            style={{
              fontSize: '0.975rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginBottom: '1.25rem',
            }}
          >
            Developer documentation is notorious for falling out of sync with real production
            enforcement. To prevent false assumptions, every claim in an OAuth Path guide is
            assigned one of three strict confidence ratings:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '8px',
                backgroundColor: 'var(--verified-bg)',
                border: '1px solid var(--verified-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  color: 'var(--verified-text)',
                  marginBottom: '0.35rem',
                }}
              >
                <CheckCircle2 size={16} />
                <span>Verified (Tested in Production)</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#14532d', lineHeight: 1.5 }}>
                We actively registered an OAuth application in the provider&apos;s developer console,
                executed the OAuth 2.0 authorization code flow end-to-end, tested token issuance,
                and personally hit the review triggers.
              </p>
            </div>

            <div
              style={{
                padding: '1.25rem',
                borderRadius: '8px',
                backgroundColor: 'var(--docs-bg)',
                border: '1px solid var(--docs-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  color: 'var(--docs-text)',
                  marginBottom: '0.35rem',
                }}
              >
                <FileText size={16} />
                <span>From Official Docs</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#1e3a8a', lineHeight: 1.5 }}>
                Directly referenced from the provider&apos;s official developer portal, API reference,
                or Trust & Safety policies, with direct link citations included.
              </p>
            </div>

            <div
              style={{
                padding: '1.25rem',
                borderRadius: '8px',
                backgroundColor: 'var(--unverified-bg)',
                border: '1px solid var(--unverified-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  color: 'var(--unverified-text)',
                  marginBottom: '0.35rem',
                }}
              >
                <HelpCircle size={16} />
                <span>Unverified / Community Observed</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#78350f', lineHeight: 1.5 }}>
                Reported by developers on developer forums or GitHub issues, but either unconfirmed
                by official documentation or subject to regional/undocumented A/B policy tests.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Agent vs Developer Division of Labor */}
        <section
          style={{
            marginBottom: '3rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
            }}
          >
            2. The Agent vs. Developer Boundary
          </h2>
          <p
            style={{
              fontSize: '0.975rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginBottom: '1.25rem',
            }}
          >
            One of the biggest misconceptions in AI agent engineering is assuming an autonomous agent
            can set up its own credentials from start to finish. In reality, providers enforce strict
            human identity requirements:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  marginBottom: '0.75rem',
                }}
              >
                <Bot size={18} />
                <span>What AI Agents Excel At</span>
              </div>
              <ul
                style={{
                  paddingLeft: '1.1rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                }}
              >
                <li>Scraping and summarizing provider OAuth docs in real-time</li>
                <li>Drafting app manifests (YAML/JSON) with minimal scope sets</li>
                <li>Generating PKCE challenge/verifier authentication code</li>
                <li>Writing scope justifications for review submissions</li>
                <li>Detecting token expiration and scheduling refresh exchanges</li>
              </ul>
            </div>

            <div
              style={{
                padding: '1.25rem',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-light)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                }}
              >
                <User size={18} />
                <span>What Human Developers Must Do</span>
              </div>
              <ul
                style={{
                  paddingLeft: '1.1rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                }}
              >
                <li>Pass 2FA authentication and SMS verification during login</li>
                <li>Add DNS TXT records to prove domain ownership (Google/Slack)</li>
                <li>Record demo videos showing OAuth screen and data workflows</li>
                <li>Accept terms of service and sign legal trust agreements</li>
                <li>Pay third-party security lab audit fees (e.g. CASA Tier 2)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: The Managed OAuth Paradigm (Composio) */}
        <section
          style={{
            marginBottom: '3rem',
            paddingBottom: '2.5rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
            }}
          >
            3. The Managed OAuth Trade-off
          </h2>
          <p
            style={{
              fontSize: '0.975rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              marginBottom: '1rem',
            }}
          >
            Why do platforms like Composio exist? For complex providers like Google, navigating the
            verification gauntlet takes between 2 to 6 weeks and can cost thousands of dollars in
            third-party assessments just to read an email.
          </p>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-light)',
              marginBottom: '1rem',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
              When Managed OAuth is the Best Choice:
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              For internal tools, early-stage MVPs, and rapid agent prototyping, using a pre-verified
              managed OAuth app allows you to launch in 10 minutes rather than waiting 6 weeks.
            </p>
          </div>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
              When Custom Credentials are Non-Negotiable:
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Enterprise customer contracts, white-labeled client consent screens, and strict
              zero-trust token storage requirements necessitate registering and owning your own OAuth app.
            </p>
          </div>
        </section>

        {/* Section 4: Architecture & Security */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: 'var(--text-primary)',
            }}
          >
            4. Architecture & Security Guarantees
          </h2>
          <ul
            style={{
              paddingLeft: '1.25rem',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <li>
              <strong>Zero Secret Leaks:</strong> API keys and OAuth client secrets are strictly
              stored in server environment variables and excluded from the repository via <code>.gitignore</code>.
            </li>
            <li>
              <strong>JSON Schema Enforced:</strong> All guides validate against a canonical JSON Schema
              ensuring every essential dimension (difficulty, timeline, blockers, sources) is present.
            </li>
            <li>
              <strong>Print & PDF Friendly:</strong> Every guide includes custom print styles so you
              can instantly save or distribute clean PDFs to your security and compliance teams.
            </li>
          </ul>
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
            Ready to explore?
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#1e40af' }}>
            Check out the live guides for Slack, Notion, and Google sensitive scopes.
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
              <span>Browse Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
