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
    <div className="p-4 border border-border-thin rounded-ios mb-4 bg-base-card">
      <div className="flex justify-between items-center">
        <h3 className="m-0 text-text-vivid">{habit.name}</h3>
        <button 
          onClick={() => onToggle(habit.id, today)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isCompletedToday ? 'bg-accent-primary text-base-bg' : 'bg-white/5 text-text-vivid'
          }`}
        >
          {isCompletedToday ? 'Done 🎉' : 'Check-in'}
        </button>
      </div>
      <p className="text-xs text-text-dim my-2 uppercase tracking-widest">
        Goal: {habit.goalValue}x {habit.unit}
      </p>
      <Heatmap records={records} days={14} />
    </div>
  );
};