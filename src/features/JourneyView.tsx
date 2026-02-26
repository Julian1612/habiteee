import { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { SettingsView } from './SettingsView';
import { JourneyStats } from './JourneyStats';
import { JourneyHeatmap } from './JourneyHeatmap';
import { JourneyQuote } from './JourneyQuote';

export const JourneyView = () => {
  const [showSettings, setShowSettings] = useState(false);

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
            {/* Statistiken (Resonance & Active Echoes) */}
            <JourneyStats />
            
            {/* Die 28-Tage Grid-Ansicht */}
            <JourneyHeatmap />
            
            {/* Das täglich wechselnde Zitat */}
            <JourneyQuote />
          </div>
        </>
      )}
    </div>
  );
};