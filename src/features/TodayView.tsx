import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { getStartOfDay, formatDate } from '../utils/dateUtils';
import type { PriorityTime } from '../types';
import { TodayHabitCard } from './TodayHabitCard';
import { TodayControls } from './TodayControls';

export const TodayView = () => {
  const { state } = useHabitStore();
  const today = getStartOfDay(Date.now());
  const currentDayOfWeek = new Date(today).getDay();

  const getInitialTime = (): PriorityTime => {
    const hour = new Date().getHours();
    if (hour < 11) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const [activeTime, setActiveTime] = useState<PriorityTime | 'all'>(getInitialTime());
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredHabits = useMemo(() => {
    return state.habits.filter(h => {
      const isCorrectDay = !h.customDays || h.customDays.includes(currentDayOfWeek);
      const isCorrectTime = activeTime === 'all' || h.priorityTime === activeTime;
      const isCorrectCategory = activeCategory === 'All' || h.category === activeCategory;
      return isCorrectDay && isCorrectTime && isCorrectCategory;
    });
  }, [state.habits, currentDayOfWeek, activeTime, activeCategory]);

  return (
    <div className="pt-4 animate-in fade-in duration-700 pb-[280px]">
      <header className="mb-10 px-1">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase text-text-vivid">Presence</h1>
        <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2 font-bold">{formatDate(today)}</p>
      </header>

      <div className="grid gap-4">
        {filteredHabits.map((habit) => (
          <TodayHabitCard key={habit.id} habit={habit} today={today} />
        ))}

        {filteredHabits.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <Filter size={32} className="mx-auto text-text-dim/20" />
            <p className="text-text-dim text-[10px] italic font-bold tracking-[0.3em] uppercase">No echoes in this sphere</p>
          </div>
        )}
      </div>

      <TodayControls 
        activeTime={activeTime} setActiveTime={setActiveTime}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
      />
    </div>
  );
};