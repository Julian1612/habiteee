import React, { useMemo } from 'react';
import { Fingerprint, Plus, RotateCcw, Zap } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { getStartOfDay, formatDate } from '../utils/dateUtils';

export const TodayView: React.FC = () => {
  const { state, addRecordValue, removeLastRecord } = useHabitStore();
  const today = getStartOfDay(Date.now());

  // Gruppierung nach Kategorien
  const categorizedHabits = useMemo(() => {
    const groups: Record<string, typeof state.habits> = {};
    state.habits.forEach(h => {
      if (!groups[h.category]) groups[h.category] = [];
      groups[h.category].push(h);
    });
    return groups;
  }, [state.habits]);

  // Fortschrittsberechnung für ein Habit am heutigen Tag
  const getProgress = (habitId: string) => {
    return state.records
      .filter(r => r.habitId === habitId && getStartOfDay(r.timestamp) === today)
      .reduce((sum, r) => sum + r.value, 0);
  };

  return (
    <div className="pt-8 animate-in fade-in duration-700 pb-12">
      <header className="mb-12">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase">Presence</h1>
        <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2">{formatDate(Date.now())}</p>
      </header>

      <div className="space-y-12">
        {Object.entries(categorizedHabits).map(([category, habits]) => (
          <section key={category} className="space-y-6">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent-primary/60 font-medium ml-1">
              {category}
            </h2>
            
            <div className="space-y-4">
              {habits.map((habit) => {
                const current = getProgress(habit.id);
                const isCompleted = current >= habit.goalValue;
                const progressPercent = Math.min((current / habit.goalValue) * 100, 100);

                return (
                  <div key={habit.id} className={`p-6 rounded-ios border transition-all duration-500 ${isCompleted ? 'bg-accent-soft border-accent-primary/20' : 'bg-base-card border-border-thin'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <span className={`text-sm tracking-wide block ${isCompleted ? 'text-accent-primary' : 'text-text-vivid'}`}>
                          {habit.name}
                        </span>
                        <span className="text-[10px] text-text-dim mt-1 font-light tracking-wider">
                          {current} / {habit.goalValue} {habit.unit}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {current > 0 && !isCompleted && (
                          <button onClick={() => removeLastRecord(habit.id, today)} className="p-2 text-text-dim/40 hover:text-text-vivid transition-colors">
                            <RotateCcw size={16} strokeWidth={1.5} />
                          </button>
                        )}
                        <button 
                          onClick={() => !isCompleted && addRecordValue(habit.id, Date.now(), 1)}
                          className={`transition-all ${isCompleted ? 'text-accent-primary' : 'text-accent-primary/60 hover:text-accent-primary'}`}
                        >
                          {isCompleted ? <Fingerprint size={28} /> : <Plus size={28} strokeWidth={1.5} />}
                        </button>
                      </div>
                    </div>

                    {/* Minimalistischer Fortschrittsbalken */}
                    <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent-primary transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {state.habits.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <Zap size={32} className="mx-auto text-text-dim/20" />
          <p className="text-text-dim text-xs italic opacity-50 tracking-widest uppercase">Void of intentions</p>
        </div>
      )}
    </div>
  );
};