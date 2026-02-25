import { useState, useMemo } from 'react';
import { Settings as SettingsIcon, Shield, Wind, Sparkles } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { SettingsView } from './SettingsView';
import { getLastNDays, getStartOfDay } from '../utils/dateUtils';
import type { HabitRecord } from '../types';

export const JourneyView = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { state } = useHabitStore();
  
  const pastDays = useMemo(() => getLastNDays(28), []);

  const dailyIntensity = useMemo(() => {
    const intensityMap: Record<number, number> = {};
    const records: HabitRecord[] = state.records || [];
    
    records.forEach(r => {
      const day = getStartOfDay(r.timestamp);
      intensityMap[day] = (intensityMap[day] || 0) + (r.value || 0);
    });
    return intensityMap;
  }, [state.records]);

  const totalVolume = useMemo(() => 
    (state.records || []).reduce((sum, r) => sum + (r.value || 0), 0)
  , [state.records]);

  const getIntensityClass = (value: number) => {
    if (value === 0) return 'bg-white/5';
    if (value < 2) return 'bg-accent-primary/20';
    if (value < 5) return 'bg-accent-primary/40';
    if (value < 10) return 'bg-accent-primary/70';
    return 'bg-accent-primary shadow-[0_0_12px_rgba(99,102,241,0.4)]';
  };

  return (
    <div className="pt-8 animate-in fade-in duration-700 pb-40"> {/* Erhöhtes pb-40 für die neue Navbar */}
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
          {/* Key-Stats mit verbessertem Kontrast */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-base-card rounded-ios border border-border-thin flex flex-col items-center text-center shadow-sm">
              <Shield size={20} className="text-accent-primary/60 mb-3" />
              <span className="text-2xl font-light tracking-tighter text-text-vivid">{totalVolume}</span>
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
                const intensity = dailyIntensity[day] || 0;
                return (
                  <div 
                    key={day} 
                    className={`aspect-square rounded-sm transition-all duration-1000 ${getIntensityClass(intensity)}`}
                  />
                );
              })}
            </div>
            <div className="mt-6 flex justify-between items-center text-[9px] uppercase tracking-widest text-text-dim font-bold">
              <span>Void</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-accent-primary/20 rounded-sm" />
                <div className="w-2.5 h-2.5 bg-accent-primary/40 rounded-sm" />
                <div className="w.2.5 h-2.5 bg-accent-primary/70 rounded-sm" />
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