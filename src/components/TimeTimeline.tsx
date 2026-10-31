import React from 'react';
import { TimeEstimate } from '@/types/guide';
import { ConfidenceBadge } from './ConfidenceBadge';
import { Clock, Hourglass, Info } from 'lucide-react';

interface TimeTimelineProps {
  timeEstimate: TimeEstimate;
}

export function TimeTimeline({ timeEstimate }: TimeTimelineProps) {
  return (
    <div className="timeline-box">
      <div className="timeline-stages">
        <div className="timeline-stage">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem',
            }}
          >
            <div className="timeline-stage-title">
              <Clock size={15} color="var(--primary)" />
              <span>Active Setup Time</span>
            </div>
            {timeEstimate.setupTimeConfidence && (
              <ConfidenceBadge
                confidence={timeEstimate.setupTimeConfidence}
                sourceUrl={timeEstimate.setupTimeSourceUrl}
                size="sm"
              />
            )}
          </div>
          <div className="timeline-stage-value">{timeEstimate.setupTime}</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Code configuration & console registration
          </span>
        </div>

        <div className="timeline-stage">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem',
            }}
          >
            <div className="timeline-stage-title">
              <Hourglass size={15} color="#d97706" />
              <span>Approval & Review Wait</span>
            </div>
            {timeEstimate.approvalWaitConfidence && (
              <ConfidenceBadge
                confidence={timeEstimate.approvalWaitConfidence}
                sourceUrl={timeEstimate.approvalWaitSourceUrl}
                size="sm"
              />
            )}
          </div>
          <div className="timeline-stage-value">{timeEstimate.approvalWait}</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            External provider trust & security review
          </span>
        </div>
      </div>

      {timeEstimate.notes && (
        <div className="timeline-notes">
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--text-muted)' }} />
          <span>{timeEstimate.notes}</span>
        </div>
      )}
    </div>
  );
}
