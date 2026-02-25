import React from 'react';
import { Sprout, BarChart3, Fingerprint } from 'lucide-react';

export type TabType = 'presence' | 'echoes' | 'journey';

interface BottomNavProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChange }) => {
  const tabs = [
    { id: 'presence', label: 'Presence', icon: Fingerprint },
    { id: 'echoes', label: 'Echoes', icon: Sprout },
    { id: 'journey', label: 'Journey', icon: BarChart3 },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-bg/70 backdrop-blur-3xl border-t border-border-thin z-50">
      {/* Massive Höhe von 110px und großzügiges pb-10 für maximale Ergonomie */}
      <div className="flex justify-around items-center h-[110px] pb-10 max-w-md mx-auto px-10">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center gap-2 transition-all duration-500 active:scale-90 ${
                isActive ? 'text-accent-primary scale-110' : 'text-text-dim'
              }`}
            >
              <Icon size={26} strokeWidth={isActive ? 1.6 : 1.2} />
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold transition-colors ${
                isActive ? 'text-accent-primary' : 'text-text-dim'
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};