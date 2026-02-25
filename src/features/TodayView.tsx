import React from 'react';
import { Fingerprint, Circle, CheckCircle2 } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { getStartOfDay, formatDate } from '../utils/dateUtils';

export const TodayView: React.FC = () => {
  const { state, toggleRecord, updateHabit } = useHabitStore();
  const today = getStartOfDay(Date.now());
  const currentDayOfWeek = new Date().getDay();

  const activeHabits = (state.habits || []).filter(h => 
    !h.customDays || h.customDays.includes(currentDayOfWeek)
  );

  const toggleStep = (habitId: string, stepId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;
    const steps = habit.steps || [];
    const newSteps = steps.map(s => s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s);
    updateHabit(habitId, { steps: newSteps });
  };

  return (
    <div className="pt-8 animate-in fade-in duration-700">
      <header className="mb-12">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase">Presence</h1>
        <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2">{formatDate(Date.now())}</p>
      </header>

      <div className="space-y-10">
        {activeHabits.map((habit) => {
          const isCompleted = (state.records || []).some(r => r.habitId === habit.id && getStartOfDay(r.timestamp) === today);
          const steps = habit.steps || [];
          const allStepsDone = steps.length === 0 || steps.every(s => s.isCompleted);

          return (
            <div key={habit.id} className={`group rounded-ios transition-all duration-500 border ${isCompleted ? 'bg-accent-soft border-accent-primary/20' : 'bg-base-card border-border-thin'}`}>
              <div className="p-6 flex items-center justify-between">
                <div onClick={() => allStepsDone && !isCompleted && toggleRecord(habit.id, today)} className="flex-1 cursor-pointer">
                  <span className={`text-sm tracking-wide block ${isCompleted ? 'text-accent-primary' : 'text-text-vivid'}`}>
                    {habit.name}
                    {habit.priority === 'high' && <span className="ml-2 text-[8px] text-accent-primary/50">●</span>}
                  </span>
                  {!isCompleted && steps.length > 0 && (
                    <span className="text-[9px] text-text-dim mt-1 block">
                      {steps.filter(s => s.isCompleted).length} / {steps.length} steps
                    </span>
                  )}
                </div>
                <button 
                  disabled={!allStepsDone && !isCompleted}
                  onClick={() => toggleRecord(habit.id, today)}
                  className={`transition-all ${!allStepsDone && !isCompleted ? 'opacity-20' : 'opacity-100'} ${isCompleted ? 'text-accent-primary' : 'text-text-dim'}`}
                >
                  {isCompleted ? <Fingerprint size={28} /> : <Circle size={28} strokeWidth={1} />}
                </button>
              </div>

              {!isCompleted && steps.length > 0 && (
                <div className="px-6 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
                  {steps.map(step => (
                    <div key={step.id} onClick={() => toggleStep(habit.id, step.id)} className="flex items-center gap-3 cursor-pointer group/step">
                      <div className={`transition-colors ${step.isCompleted ? 'text-accent-primary' : 'text-text-dim/30 group-hover/step:text-text-dim'}`}>
                        {step.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                      <span className={`text-[11px] transition-all ${step.isCompleted ? 'text-text-dim line-through opacity-50' : 'text-text-vivid'}`}>{step.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {activeHabits.length === 0 && (
          <p className="text-center text-text-dim text-xs italic opacity-50">No habits for today.</p>
        )}
      </div>
    </div>
  );
};