import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { getLastNDays, getStartOfDay } from '../utils/dateUtils';

export const JourneyHeatmap = () => {
  const { state } = useHabitStore();
  
  // 28 Tage für das Grid
  const pastDays = useMemo(() => getLastNDays(28), []);

  // Berechnet die "Erfüllungs-Intensität" pro Tag
  const dailyIntensity = useMemo(() => {
    const intensityMap: Record<number, number> = {};
    
    pastDays.forEach(dayTimestamp => {
      const dayOfWeek = new Date(dayTimestamp).getDay();
      const endOfDay = dayTimestamp + 86399999; 
      
      const scheduledHabits = (state.habits || []).filter(h => {
        const hasRecordToday = (state.records || []).some(
          r => r.habitId === h.id && 
               getStartOfDay(r.timestamp) === dayTimestamp && 
               ((r.value && r.value > 0) || (r.completedSteps && r.completedSteps.length > 0))
        );
        if (hasRecordToday) return true;
        if (h.createdAt > endOfDay) return false;
        if (h.customDays && !h.customDays.includes(dayOfWeek)) return false;
        
        return true;
      });

      if (scheduledHabits.length === 0) {
        intensityMap[dayTimestamp] = 0;
        return;
      }

      let completedCount = 0;
      scheduledHabits.forEach(habit => {
        const recordForDay = (state.records || []).find(
          r => r.habitId === habit.id && getStartOfDay(r.timestamp) === dayTimestamp
        );
        
        if (recordForDay) {
          if ((recordForDay.value && recordForDay.value > 0) || 
              (recordForDay.completedSteps && recordForDay.completedSteps.length > 0)) {
            completedCount++;
          }
        }
      });

      intensityMap[dayTimestamp] = (completedCount / scheduledHabits.length) * 100;
    });

    return intensityMap;
  }, [state.habits, state.records, pastDays]);

  const getIntensityClass = (percentage: number) => {
    if (percentage === 0) return 'bg-white/5';                   
    if (percentage <= 33) return 'bg-accent-primary/20';         
    if (percentage <= 66) return 'bg-accent-primary/40';         
    if (percentage < 100) return 'bg-accent-primary/70';         
    return 'bg-accent-primary shadow-[0_0_12px_rgba(99,102,241,0.4)]'; 
  };

  return (
    <div className="p-8 bg-base-card rounded-ios border border-border-thin shadow-sm">
      <h3 className="text-[10px] uppercase tracking-[0.3em] text-text-dim mb-6 flex items-center gap-2 font-bold">
        <Sparkles size={12} className="text-accent-primary" /> Temporal Density
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {pastDays.map(day => {
          const percentage = dailyIntensity[day] || 0;
          return (
            <div 
              key={day} 
              className={`aspect-square rounded-sm transition-all duration-1000 ${getIntensityClass(percentage)}`}
            />
          );
        })}
      </div>
      
      {/* Legende */}
      <div className="mt-6 flex justify-between items-center text-[9px] uppercase tracking-widest text-text-dim font-bold">
        <span>Void</span>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 bg-accent-primary/20 rounded-sm" />
          <div className="w-2.5 h-2.5 bg-accent-primary/40 rounded-sm" />
          <div className="w-2.5 h-2.5 bg-accent-primary/70 rounded-sm" />
          <div className="w-2.5 h-2.5 bg-accent-primary rounded-sm shadow-[0_0_4px_rgba(99,102,241,0.5)]" />
        </div>
        <span>Peak</span>
      </div>
    </div>
  );
};