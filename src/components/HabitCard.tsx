import React from 'react';
import type { Habit } from '../types';
import { Heatmap } from './Heatmap';
import { getStartOfDay } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  records: number[];
  onToggle: (habitId: string, timestamp: number) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, records, onToggle }) => {
  const today = getStartOfDay(Date.now());
  const isCompletedToday = records.some(r => getStartOfDay(r) === today);

  return (
    <div style={{ 
      padding: '16px', 
      border: '1px solid #333', 
      borderRadius: '12px', 
      marginBottom: '16px',
      backgroundColor: '#1a1a1a'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{habit.name}</h3>
        <button 
          onClick={() => onToggle(habit.id, today)}
          style={{ 
            backgroundColor: isCompletedToday ? '#4ade80' : '#333',
            color: isCompletedToday ? '#000' : '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {isCompletedToday ? 'Erledigt 🎉' : 'Check-in'}
        </button>
      </div>
      <p style={{ fontSize: '14px', color: '#888', margin: '8px 0' }}>
        Frequenz: {habit.targetCount}x {habit.frequencyType}
      </p>
      
      <Heatmap records={records} days={14} />
    </div>
  );
};