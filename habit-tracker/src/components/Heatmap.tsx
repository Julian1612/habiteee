import React from 'react';
import { getLastNDays, getStartOfDay } from '../utils/dateUtils';

interface HeatmapProps {
  records: number[];
  days?: number;
}

export const Heatmap: React.FC<HeatmapProps> = ({ records, days = 28 }) => {
  const pastDays = getLastNDays(days);
  const recordSet = new Set(records.map(getStartOfDay));

  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
      {pastDays.map((day) => {
        const isCompleted = recordSet.has(day);
        return (
          <div
            key={day}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              backgroundColor: isCompleted ? '#4ade80' : '#e5e7eb',
              transition: 'background-color 0.2s ease-in-out',
            }}
            title={new Date(day).toLocaleDateString('de-DE')}
          />
        );
      })}
    </div>
  );
};