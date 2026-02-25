import { useState, useMemo } from 'react';
import { Settings as SettingsIcon, Shield, Wind, Sparkles } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { SettingsView } from './SettingsView';
import { getLastNDays, getStartOfDay } from '../utils/dateUtils';

export const JourneyView = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { state } = useHabitStore();
  
  const pastDays = useMemo(() => getLastNDays(28), []);

  // HEATMAP LOGIK: Berechnet die prozentuale Erfolgsquote pro Tag
  const dailyIntensity = useMemo(() => {
    const intensityMap: Record<number, number> = {};
    
    pastDays.forEach(dayTimestamp => {
      const dayOfWeek = new Date(dayTimestamp).getDay();
      const endOfDay = dayTimestamp + 86399999; // 23:59:59 Uhr dieses Tages
      
      // 1. Welche Habits waren an diesem Tag angesetzt?
      const scheduledHabits = (state.habits || []).filter(h => {
        // Ignoriere Habits, die an diesem Tag noch gar nicht existierten
        if (h.createdAt > endOfDay) return false;
        // Prüfe, ob das Habit für diesen Wochentag aktiviert ist
        if (h.customDays && !h.customDays.includes(dayOfWeek)) return false;
        return true;
      });

      // Wenn an dem Tag nichts angesetzt war, ist die Intensität 0
      if (scheduledHabits.length === 0) {
        intensityMap[dayTimestamp] = 0;
        return;
      }

      // 2. Wie viele der angesetzten Habits wurden bearbeitet?
      let completedCount = 0;
      scheduledHabits.forEach(habit => {
        const recordForDay = (state.records || []).find(
          r => r.habitId === habit.id && getStartOfDay(r.timestamp) === dayTimestamp
        );
        
        if (recordForDay) {
          // Zählt als erledigt/bearbeitet, wenn ein Wert > 0 geloggt wurde oder Steps abgehakt sind
          if ((recordForDay.value && recordForDay.value > 0) || 
              (recordForDay.completedSteps && recordForDay.completedSteps.length > 0)) {
            completedCount++;
          }
        }
      });

      // 3. Berechne den Prozentsatz (0 bis 100)
      intensityMap[dayTimestamp] = (completedCount / scheduledHabits.length) * 100;
    });

    return intensityMap;
  }, [state.habits, state.records, pastDays]);

  // Total Resonance bleibt als absoluter Score erhalten
  const totalResonance = useMemo(() => {
    let score = 0;
    (state.records || []).forEach(r => {
      if (r.value && r.value > 0) score += 1;
      if (r.completedSteps) score += r.completedSteps.length;
    });
    return score;
  }, [state.records]);

  // Dynamische Klassen basierend auf dem erreichten Prozentsatz
  const getIntensityClass = (percentage: number) => {
    if (percentage === 0) return 'bg-white/5';                   
    if (percentage <= 33) return 'bg-accent-primary/20';         
    if (percentage <= 66) return 'bg-accent-primary/40';         
    if (percentage < 100) return 'bg-accent-primary/70';         
    return 'bg-accent-primary shadow-[0_0_12px_rgba(99,102,241,0.4)]'; 
  };

  return (
    <div className="pt-8 animate-in fade-in duration-700 pb-40">
      <header className="flex justify-between items-start mb-12 px-1">
        <div>
          <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase text-text-vivid">Journey</h1>
          <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2 font-bold">The architecture of time</p>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)} 
          className={`p-2 transition-all duration-500 active:scale-90 ${showSettings ? 'text-accent-primary rotate-90' : 'text-text-dim hover:text-accent-primary'}`}
        >
          <SettingsIcon size={22} strokeWidth={1.5} />
        </button>
      </header>

      {showSettings ? (
        <SettingsView />
      ) : (
        <div className="space-y-12">
          {/* Key-Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-base-card rounded-ios border border-border-thin flex flex-col items-center text-center shadow-sm">
              <Shield size={20} className="text-accent-primary/60 mb-3" />
              <span className="text-2xl font-light tracking-tighter text-text-vivid">{totalResonance}</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-text-dim mt-1 font-bold">Total Resonance</span>
            </div>
            <div className="p-6 bg-base-card rounded-ios border border-border-thin flex flex-col items-center text-center shadow-sm">
              <Wind size={20} className="text-accent-primary/60 mb-3" />
              <span className="text-2xl font-light tracking-tighter text-text-vivid">{(state.habits || []).length}</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-text-dim mt-1 font-bold">Active Echoes</span>
            </div>
          </div>

          {/* Intensitäts-Heatmap */}
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

          <p className="text-center text-text-dim italic font-medium text-sm px-8 leading-relaxed opacity-80">
            "Your journey is written in the density of your presence."
          </p>
        </div>
      )}
    </div>
  );
};