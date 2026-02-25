import { useState, useMemo } from 'react';
import { Settings as SettingsIcon, Shield, Wind, Sparkles } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { SettingsView } from './SettingsView';
import { getLastNDays, getStartOfDay } from '../utils/dateUtils';

export const JourneyView = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { state } = useHabitStore();
  
  const pastDays = useMemo(() => getLastNDays(28), []);

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

  const totalResonance = useMemo(() => {
    let score = 0;
    (state.records || []).forEach(r => {
      if (r.value && r.value > 0) score += 1;
      if (r.completedSteps) score += r.completedSteps.length;
    });
    return score;
  }, [state.records]);

  const getIntensityClass = (percentage: number) => {
    if (percentage === 0) return 'bg-white/5';                   
    if (percentage <= 33) return 'bg-accent-primary/20';         
    if (percentage <= 66) return 'bg-accent-primary/40';         
    if (percentage < 100) return 'bg-accent-primary/70';         
    return 'bg-accent-primary shadow-[0_0_12px_rgba(99,102,241,0.4)]'; 
  };

  // NEU: Täglich wechselndes Zitat
  const dailyQuote = useMemo(() => {
    const quotes = [
      "Your journey is written in the density of your presence.",
      "We suffer more often in imagination than in reality. — Seneca",
      "You have power over your mind, not outside events. — Marcus Aurelius",
      "The obstacle in the path becomes the path. — Marcus Aurelius",
      "First say to yourself what you would be; and then do what you have to do. — Epictetus",
      "No man is free who is not master of himself. — Epictetus",
      "Waste no more time arguing what a good man should be. Be one. — Marcus Aurelius",
      "It is not that we have a short time to live, but that we waste a lot of it. — Seneca",
      "What we do now echoes in eternity. — Marcus Aurelius",
      "Do not let the future disturb you. You will meet it, if you have to. — Marcus Aurelius",
      "Focus on what is up to you, ignore what is not. — Epictetus",
      "Step by step. Echo by echo."
    ];
    // Teilt die vergangenen Millisekunden in ganze Tage auf, um den Index zu bestimmen
    const dayIndex = Math.floor(Date.now() / 86400000);
    return quotes[dayIndex % quotes.length];
  }, []);

  return (
    <div className="pt-8 animate-in fade-in duration-700 pb-40">
      {showSettings ? (
        <SettingsView onClose={() => setShowSettings(false)} />
      ) : (
        <>
          <header className="flex justify-between items-start mb-12 px-1">
            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
              <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase text-text-vivid">Journey</h1>
              <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2 font-bold">The architecture of time</p>
            </div>
            <button 
              onClick={() => setShowSettings(true)} 
              className="p-2 transition-all duration-500 active:scale-90 text-text-dim hover:text-accent-primary"
            >
              <SettingsIcon size={22} strokeWidth={1.5} />
            </button>
          </header>

          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
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

            {/* NEU: Rendering des ausgewählten Zitats */}
            <p className="text-center text-text-dim italic font-medium text-sm px-8 leading-relaxed opacity-80">
              "{dailyQuote}"
            </p>
          </div>
        </>
      )}
    </div>
  );
};