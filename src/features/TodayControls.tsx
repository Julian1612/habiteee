import { useState, useMemo } from 'react';
import { Filter, Sun, SunDim, Moon, Infinity as AllDayIcon, Zap } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import type { PriorityTime } from '../types';

interface TodayControlsProps {
  activeTime: PriorityTime | 'all';
  setActiveTime: (time: PriorityTime | 'all') => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export const TodayControls = ({ activeTime, setActiveTime, activeCategory, setActiveCategory }: TodayControlsProps) => {
  const { state } = useHabitStore();
  const [showCategories, setShowCategories] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(state.habits.map(h => h.category));
    return ['All', ...Array.from(cats)];
  }, [state.habits]);

  const timeSlots = [
    { id: 'morning', label: 'Morning', icon: Sun },
    { id: 'afternoon', label: 'Day', icon: SunDim },
    { id: 'evening', label: 'Evening', icon: Moon },
    { id: 'all-day', label: 'Always', icon: AllDayIcon },
    { id: 'all', label: 'Journey', icon: Zap },
  ] as const;

  return (
    <div className="fixed bottom-[110px] left-0 right-0 bg-base-bg/80 backdrop-blur-2xl border-t border-border-thin px-4 pt-4 pb-8 z-40">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-[9px] text-text-dim uppercase tracking-[0.2em] font-bold">Temporal Focus</span>
          <button 
            onClick={() => setShowCategories(!showCategories)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all active:scale-95 ${
              activeCategory !== 'All' ? 'bg-accent-soft border-accent-primary/50 text-accent-primary' : 'bg-base-card border-border-thin text-text-dim'
            }`}
          >
            <Filter size={10} strokeWidth={2.5} />
            <span className="text-[8px] uppercase tracking-widest font-bold">
              {activeCategory === 'All' ? 'All Spheres' : activeCategory}
            </span>
          </button>
        </div>

        {showCategories && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth animate-in fade-in slide-in-from-bottom-2 duration-300">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowCategories(false); }}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-[9px] uppercase tracking-widest border font-bold transition-all active:scale-95 ${
                  activeCategory === cat ? 'bg-accent-primary text-white border-accent-primary shadow-lg shadow-accent-primary/20' : 'bg-base-card text-text-dim border-border-thin'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <nav className="flex justify-between bg-base-card/80 p-1.5 rounded-[22px] border border-border-thin shadow-2xl">
          {timeSlots.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTime(id as PriorityTime | 'all')}
              className={`flex-1 flex flex-col items-center py-3 rounded-[16px] transition-all duration-300 active:scale-95 ${
                activeTime === id ? 'bg-accent-soft text-accent-primary font-bold' : 'text-text-dim'
              }`}
            >
              <Icon size={20} strokeWidth={activeTime === id ? 2 : 1.2} />
              <span className="text-[7px] uppercase tracking-widest mt-1.5 font-bold">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};