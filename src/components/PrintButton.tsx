'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <button onClick={handlePrint} className="btn-action no-print" title="Print or Save as PDF">
      <Printer size={14} />
      <span>Print / PDF</span>
    </button>
  );
}
