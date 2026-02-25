import { useState, useMemo } from 'react';
import { Fingerprint, Plus, RotateCcw, Zap, Sun, SunDim, Moon, Infinity as AllDayIcon, Filter, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { getStartOfDay, formatDate, getStartOfPeriod } from '../utils/dateUtils';
import type { PriorityTime, Habit } from '../types';

export const TodayView = () => {
  const { state, addRecordValue, removeLastRecord, updateHabit } = useHabitStore();
  const today = getStartOfDay(Date.now());
  const currentDayOfWeek = new Date().getDay();

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

  const getProgress = (habit: Habit) => {
    const periodStart = habit.frequencyType === 'daily' 
      ? today 
      : getStartOfPeriod(habit.frequencyType, habit.periodStartDay);

    return (state.records || [])
      .filter(r => r.habitId === habit.id && r.timestamp >= periodStart)
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
    <div className="pt-4 animate-in fade-in duration-700 pb-80">
      <header className="mb-10 px-1">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase text-text-vivid">Presence</h1>
        <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2 font-bold">{formatDate(Date.now())}</p>
      </header>

      <div className="grid gap-4">
        {filteredHabits.map((habit) => {
          const current = getProgress(habit);
          const isCompleted = current >= habit.goalValue;
          const progressPercent = Math.min((current / habit.goalValue) * 100, 100);
          const isExpanded = expandedHabits[habit.id];
          const hasSteps = (habit.steps || []).length > 0;

          return (
            <div key={habit.id} className={`rounded-ios border transition-all duration-500 overflow-hidden ${
              isCompleted ? 'bg-accent-soft border-accent-primary/30' : 'bg-base-card border-border-thin'
            }`}>
              <div className="p-6 flex items-center justify-between">
                <div onClick={() => hasSteps && toggleExpand(habit.id)} className="flex-1 cursor-pointer select-none active:opacity-70 transition-opacity">
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
                  {habit.steps.map(step => (
                    <div key={step.id} onClick={() => toggleStep(habit.id, step.id)} className="flex items-center gap-4 cursor-pointer active:opacity-60 transition-opacity select-none">
                      <div className={`transition-colors ${step.isCompleted ? 'text-accent-primary' : 'text-text-dim'}`}>
                        {step.isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </div>
                      <span className={`text-sm font-medium transition-all ${step.isCompleted ? 'text-text-dim line-through opacity-40' : 'text-text-vivid'}`}>
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
          <div className="py-24 text-center space-y-4">
            <Filter size={32} className="mx-auto text-text-dim/20" />
            <p className="text-text-dim text-[10px] italic font-bold tracking-[0.3em] uppercase">No echoes in this sphere</p>
          </div>
        )}
      </div>

      {/* Steuerungseinheit: Exakt über der 110px Navigationsleiste */}
      <div className="fixed bottom-[110px] left-0 right-0 bg-base-bg/80 backdrop-blur-2xl border-t border-border-thin px-4 pt-5 pb-10 z-40">
        <div className="max-w-md mx-auto space-y-6">
          {/* Horizontales Scrollen für Kategorien ohne sichtbare Scrollbar */}
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest border font-bold transition-all active:scale-95 ${
                  activeCategory === cat ? 'bg-accent-primary text-white border-accent-primary shadow-lg shadow-accent-primary/20' : 'text-text-dim border-border-thin'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <nav className="flex justify-between bg-base-card/80 p-1.5 rounded-[24px] border border-border-thin shadow-2xl">
            {timeSlots.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTime(id)}
                className={`flex-1 flex flex-col items-center py-4 rounded-[18px] transition-all duration-300 active:scale-95 ${
                  activeTime === id ? 'bg-accent-soft text-accent-primary font-bold' : 'text-text-dim'
                }`}
              >
                <Icon size={22} strokeWidth={activeTime === id ? 2 : 1.2} />
                <span className="text-[8px] uppercase tracking-widest mt-2 font-bold">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};