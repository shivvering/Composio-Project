'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy URL', err);
    }
  };

  return (
    <button onClick={handleCopy} className="btn-action" title="Copy shareable guide link">
      {copied ? <Check size={14} color="#15803d" /> : <Copy size={14} />}
      <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
    </button>
  );
}
