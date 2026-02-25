import React, { useState, useMemo } from 'react';
import { Fingerprint, Plus, RotateCcw, Zap, Sun, SunDim, Moon, Infinity as AllDayIcon, Filter, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { getStartOfDay, formatDate } from '../utils/dateUtils';
import type { PriorityTime } from '../types';

export const TodayView: React.FC = () => {
  const { state, addRecordValue, removeLastRecord, updateHabit } = useHabitStore();
  const today = getStartOfDay(Date.now());
  const currentDayOfWeek = new Date().getDay();

  // State für ausgeklappte Habits
  const [expandedHabits, setExpandedHabits] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedHabits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getInitialTime = (): PriorityTime => {
    const hour = new Date().getHours();
    if (hour < 11) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const [activeTime, setActiveTime] = useState<PriorityTime | 'all'>(getInitialTime());
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(state.habits.map(h => h.category));
    return ['All', ...Array.from(cats)];
  }, [state.habits]);

  const timeSlots = [
    { id: 'morning', label: 'Morning', icon: Sun },
    { id: 'afternoon', label: 'Day', icon: SunDim },
    { id: 'evening', label: 'Evening', icon: Moon },
    { id: 'all-day', label: 'Always', icon: AllDayIcon },
    { id: 'all', label: 'Full Journey', icon: Zap },
  ] as const;

  const filteredHabits = useMemo(() => {
    return state.habits.filter(h => {
      const isCorrectDay = !h.customDays || h.customDays.includes(currentDayOfWeek);
      const isCorrectTime = activeTime === 'all' || h.priorityTime === activeTime;
      const isCorrectCategory = activeCategory === 'All' || h.category === activeCategory;
      return isCorrectDay && isCorrectTime && isCorrectCategory;
    });
  }, [state.habits, currentDayOfWeek, activeTime, activeCategory]);

  const getProgress = (habitId: string) => {
    return state.records
      .filter(r => r.habitId === habitId && getStartOfDay(r.timestamp) === today)
      .reduce((sum, r) => sum + r.value, 0);
  };

  const toggleStep = (habitId: string, stepId: string) => {
    const habit = state.habits.find(h => h.id === habitId);
    if (!habit) return;
    const steps = habit.steps || [];
    const newSteps = steps.map(s => s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s);
    updateHabit(habitId, { steps: newSteps });
  };

  return (
    <div className="pt-8 animate-in fade-in duration-700 pb-20">
      <header className="mb-8">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase">Presence</h1>
        <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2">{formatDate(Date.now())}</p>
      </header>

      <nav className="flex justify-between mb-8 bg-base-card/50 p-1 rounded-2xl border border-border-thin">
        {timeSlots.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTime(id)}
            className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-500 ${
              activeTime === id ? 'bg-accent-soft text-accent-primary' : 'text-text-dim hover:text-text-vivid'
            }`}
          >
            <Icon size={18} strokeWidth={activeTime === id ? 2 : 1.2} />
            <span className="text-[7px] uppercase tracking-widest mt-1 font-medium">{label}</span>
          </button>
        ))}
      </nav>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest border transition-all ${
              activeCategory === cat ? 'bg-accent-primary text-base-bg border-accent-primary' : 'text-text-dim border-border-thin'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredHabits.map((habit) => {
          const current = getProgress(habit.id);
          const isCompleted = current >= habit.goalValue;
          const progressPercent = Math.min((current / habit.goalValue) * 100, 100);
          const isExpanded = expandedHabits[habit.id];
          const hasSteps = (habit.steps || []).length > 0;

          return (
            <div key={habit.id} className={`rounded-ios border transition-all duration-500 ${
              isCompleted ? 'bg-accent-soft border-accent-primary/20' : 'bg-base-card border-border-thin'
            }`}>
              <div className="p-6 flex items-center justify-between">
                <div 
                  onClick={() => hasSteps && toggleExpand(habit.id)} 
                  className="flex-1 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-sm tracking-wide ${isCompleted ? 'text-accent-primary' : 'text-text-vivid'}`}>
                      {habit.name}
                    </span>
                    {hasSteps && (
                      <span className="text-text-dim/40">
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-text-dim mt-1 font-light tracking-wider block">
                    {current} / {habit.goalValue} {habit.unit}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {current > 0 && !isCompleted && (
                    <button onClick={() => removeLastRecord(habit.id, today)} className="p-2 text-text-dim/40 hover:text-text-vivid transition-colors">
                      <RotateCcw size={16} />
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

              {/* Fortschrittsbalken */}
              <div className="px-6 pb-2">
                <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-primary transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Unteraufgaben (Steps) - Erscheinen beim Tippen */}
              {isExpanded && hasSteps && (
                <div className="px-6 pb-6 pt-2 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="h-[1px] w-full bg-border-thin mb-4 opacity-50" />
                  {habit.steps.map(step => (
                    <div 
                      key={step.id} 
                      onClick={() => toggleStep(habit.id, step.id)} 
                      className="flex items-center gap-3 cursor-pointer group/step select-none"
                    >
                      <div className={`transition-colors ${step.isCompleted ? 'text-accent-primary' : 'text-text-dim/30 group-hover/step:text-text-dim'}`}>
                        {step.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      </div>
                      <span className={`text-[11px] transition-all ${step.isCompleted ? 'text-text-dim line-through opacity-50' : 'text-text-vivid'}`}>
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredHabits.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Filter size={32} className="mx-auto text-text-dim/10" />
            <p className="text-text-dim text-[10px] italic opacity-50 tracking-[0.3em] uppercase">
              No echoes in this sphere
            </p>
          </div>
        )}
      </div>
    </div>
  );
};