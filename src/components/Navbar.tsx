'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, ExternalLink, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="logo-area no-print" onClick={() => setIsOpen(false)}>
          <Compass size={22} color="var(--primary)" />
          <span>OAuth Path</span>
          <span className="logo-badge">For AI Agents</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links desktop-nav no-print">
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

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="mobile-nav-toggle no-print"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown / Drawer */}
      {isOpen && (
        <div className="mobile-nav-menu no-print">
          <nav className="mobile-nav-links">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`}
            >
              Guides
            </Link>
            <Link
              href="/verification-log"
              onClick={() => setIsOpen(false)}
              className={`mobile-nav-link ${pathname === '/verification-log' ? 'active' : ''}`}
            >
              Verification Log
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setIsOpen(false)}
              className={`mobile-nav-link ${pathname === '/how-it-works' ? 'active' : ''}`}
            >
              How it works
            </Link>
            <a
              href="https://composio.dev"
              target="_blank"
              rel="noreferrer"
              className="nav-cta mobile-cta"
              onClick={() => setIsOpen(false)}
            >
              <span>Composio</span>
              <ExternalLink size={14} />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
