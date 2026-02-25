import React from 'react';
import { Fingerprint, Circle } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { getStartOfDay, formatDate } from '../utils/dateUtils';

export const TodayView: React.FC = () => {
  const { state, toggleRecord } = useHabitStore();
  const today = getStartOfDay(Date.now());

  return (
    <div className="pt-8 animate-in fade-in duration-700">
      <header className="mb-12">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase">Presence</h1>
        <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2">{formatDate(Date.now())}</p>
      </header>

      <div className="space-y-6">
        {state.habits.map((habit) => {
          const isCompleted = state.records.some(
            (r) => r.habitId === habit.id && getStartOfDay(r.timestamp) === today
          );

          return (
            <button
              key={habit.id}
              onClick={() => toggleRecord(habit.id, today)}
              className="w-full flex items-center justify-between p-6 rounded-ios bg-base-card border border-border-thin active:scale-[0.98] transition-all"
            >
              <div className="flex flex-col items-start">
                <span className={`text-sm tracking-wide ${isCompleted ? 'text-accent-primary' : 'text-text-vivid'}`}>
                  {habit.name}
                </span>
              </div>
              <div className={isCompleted ? 'text-accent-primary' : 'text-text-dim'}>
                {isCompleted ? <Fingerprint size={28} strokeWidth={1.5} /> : <Circle size={28} strokeWidth={1} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};