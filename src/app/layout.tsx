import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, BookOpen, ShieldCheck, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'OAuth Path | AI generated, checked against official docs where marked',
  description:
    'AI generated, checked against official docs where marked. Clear guides on navigating OAuth setup, approval wait times, and compliance requirements for AI agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container site-header-inner">
            <Link href="/" className="logo-area no-print">
              <Compass size={22} color="var(--primary)" />
              <span>OAuth Path</span>
              <span className="logo-badge">For AI Agents</span>
            </Link>

            <nav className="nav-links no-print">
              <Link href="/">Guides</Link>
              <Link href="/verification-log">Verification Log</Link>
              <Link href="/how-it-works">How it works</Link>
              <a
                href="https://composio.dev"
                target="_blank"
                rel="noreferrer"
                className="nav-cta"
              >
                <span>Composio</span>
                <ExternalLink size={13} />
              </a>
            </nav>
          </div>
        </header>

        <main style={{ minHeight: 'calc(100vh - 180px)' }}>{children}</main>

        <footer className="site-footer">
          <div className="container site-footer-inner">
            <div>
              OAuth Path: AI generated OAuth setup and approval guides for AI agent builders. Check provider docs before you rely on a guide.
            </div>
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <Link href="/" className="no-print">Guides</Link>
              <Link href="/verification-log" className="no-print">Verification Log</Link>
              <Link href="/how-it-works" className="no-print">How it works</Link>
              <a
                href="https://composio.dev"
                target="_blank"
                rel="noreferrer"
                className="no-print"
              >
                Composio
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
