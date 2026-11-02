import './globals.css';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'OAuth Path | AI generated, checked against official docs where marked',
  description:
    'AI generated, checked against official docs where marked. Clear guides on navigating OAuth setup, approval wait times, and compliance requirements for AI agents.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main style={{ minHeight: 'calc(100vh - 180px)' }}>{children}</main>

        <footer className="site-footer">
          <div className="container site-footer-inner">
            <div>
              OAuth Path: AI generated OAuth setup and approval guides for AI agent builders. Check provider docs before you rely on a guide.
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
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
