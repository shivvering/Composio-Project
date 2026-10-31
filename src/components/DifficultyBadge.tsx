import React from 'react';
import { DifficultyLevel } from '@/types/guide';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  className?: string;
}

export function DifficultyBadge({ level, className = '' }: DifficultyBadgeProps) {
  const levelClass =
    level === 'easy'
      ? 'badge-easy'
      : level === 'medium'
      ? 'badge-medium'
      : 'badge-hard';

  return (
    <span className={`badge-difficulty ${levelClass} ${className}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
        }}
      />
      {level.toUpperCase()}
    </span>
  );
}
