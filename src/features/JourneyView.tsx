import React, { useState, useMemo } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { SettingsView } from './SettingsView';
import { getLastNDays, getStartOfDay } from '../utils/dateUtils';

export const JourneyView: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { state } = useHabitStore();
  const pastDays = useMemo(() => getLastNDays(28), []);

  const dailyIntensity = useMemo(() => {
    const counts: Record<number, number> = {};
    state.records.forEach(r => {
      const day = getStartOfDay(r.timestamp);
      counts[day] = (counts[day] || 0) + 1;
    });
    return counts;
  }, [state.records]);

  const getOpacity = (count: number) => {
    if (count === 0) return 'bg-white/5';
    if (count === 1) return 'bg-accent-primary/30';
    if (count === 2) return 'bg-accent-primary/60';
    return 'bg-accent-primary';
  };

  return (
    <div className="pt-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase">Journey</h1>
          <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2">The architecture of time</p>
        </div>
        <button onClick={() => setShowSettings(!showSettings)} className="p-2 text-text-dim hover:text-accent-primary transition-colors">
          <SettingsIcon size={18} strokeWidth={1} />
        </button>
      </header>

      {showSettings ? <SettingsView /> : (
        <div className="space-y-12">
          <div className="grid grid-cols-7 gap-2 p-6 bg-base-card rounded-ios border border-border-thin">
            {pastDays.map(day => (
              <div 
                key={day} 
                className={`aspect-square rounded-sm transition-all duration-1000 ${getOpacity(dailyIntensity[day] || 0)}`}
                title={`${dailyIntensity[day] || 0} echoes recorded`}
              />
            ))}
          </div>
          <p className="text-center text-text-dim italic font-extralight text-sm px-4">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
          </p>
        </div>
      )}
    </div>
  );
};