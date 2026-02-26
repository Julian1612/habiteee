import { useState } from 'react';
import { Fingerprint, Plus, RotateCcw, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { getStartOfDay, getStartOfPeriod } from '../utils/dateUtils';
import type { Habit } from '../types';

interface TodayHabitCardProps {
  habit: Habit;
  today: number;
}

export const TodayHabitCard = ({ habit, today }: TodayHabitCardProps) => {
  const { state, addRecordValue, removeLastRecord, toggleStepRecord } = useHabitStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const periodStart = habit.frequencyType === 'daily' 
    ? today 
    : getStartOfPeriod(habit.frequencyType, habit.periodStartDay);

  const current = (state.records || [])
    .filter(r => r.habitId === habit.id && r.timestamp >= periodStart)
    .reduce((sum, r) => sum + r.value, 0);

  const isCompleted = current >= habit.goalValue;
  const progressPercent = Math.min((current / habit.goalValue) * 100, 100);
  const hasSteps = (habit.steps || []).length > 0;

  const todaysRecord = (state.records || []).find(
    r => r.habitId === habit.id && getStartOfDay(r.timestamp) === today
  );
  const completedStepsToday = todaysRecord?.completedSteps || [];

  return (
    <div className={`rounded-ios border transition-all duration-500 overflow-hidden ${
      isCompleted ? 'bg-accent-soft border-accent-primary/30' : 'bg-base-card border-border-thin'
    }`}>
      <div className="p-6 flex items-center justify-between">
        <div onClick={() => hasSteps && setIsExpanded(!isExpanded)} className="flex-1 cursor-pointer select-none active:opacity-70 transition-opacity">
          <div className="flex items-center gap-2">
            <span className={`text-sm tracking-wide font-bold ${isCompleted ? 'text-accent-primary' : 'text-text-vivid'}`}>
              {habit.name}
            </span>
            {hasSteps && (
              <span className="text-text-dim/50">
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </span>
            )}
          </div>
          <span className="text-[11px] text-text-dim mt-1.5 font-bold tracking-wider block">
            {current} / {habit.goalValue} {habit.unit}
          </span>
        </div>
        
        <div className="flex gap-4">
          {current > 0 && !isCompleted && (
            <button 
              onClick={() => removeLastRecord(habit.id, today)} 
              className="p-2 text-text-dim active:text-text-vivid active:scale-90 transition-all"
            >
              <RotateCcw size={20} />
            </button>
          )}
          <button 
            onClick={() => !isCompleted && addRecordValue(habit.id, Date.now(), 1)}
            className={`transition-all active:scale-90 p-1 ${isCompleted ? 'text-accent-primary' : 'text-accent-primary/80'}`}
          >
            {isCompleted ? <Fingerprint size={36} /> : <Plus size={36} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="h-[4px] w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent-primary transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {isExpanded && hasSteps && (
        <div className="px-6 pb-6 pt-2 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="h-[1px] w-full bg-border-thin opacity-30" />
          {habit.steps.map(step => {
            const isStepCompleted = completedStepsToday.includes(step.id);
            return (
              <div key={step.id} onClick={() => toggleStepRecord(habit.id, step.id, today)} className="flex items-center gap-4 cursor-pointer active:opacity-60 transition-opacity select-none">
                <div className={`transition-colors ${isStepCompleted ? 'text-accent-primary' : 'text-text-dim'}`}>
                  {isStepCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
                <span className={`text-sm font-medium transition-all ${isStepCompleted ? 'text-text-dim line-through opacity-40' : 'text-text-vivid'}`}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};