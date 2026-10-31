import React from 'react';
import { TimeEstimate } from '@/types/guide';
import { Clock, Hourglass, Info } from 'lucide-react';

interface TimeTimelineProps {
  timeEstimate: TimeEstimate;
}

export function TimeTimeline({ timeEstimate }: TimeTimelineProps) {
  return (
    <div className="timeline-box">
      <div className="timeline-stages">
        <div className="timeline-stage">
          <div className="timeline-stage-title">
            <Clock size={15} color="var(--primary)" />
            <span>Active Setup Time</span>
          </div>
          <div className="timeline-stage-value">{timeEstimate.setupTime}</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Code configuration & console registration
          </span>
        </div>

        <div className="timeline-stage">
          <div className="timeline-stage-title">
            <Hourglass size={15} color="#d97706" />
            <span>Approval & Review Wait</span>
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
