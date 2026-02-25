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
    <div className="fixed bottom-0 left-0 right-0 bg-base-bg/40 backdrop-blur-2xl border-t border-border-thin pb-safe">
      <div className="flex justify-around items-center h-[70px] max-w-md mx-auto px-6">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center space-y-1 transition-all duration-500 ${
                isActive ? 'text-accent-primary scale-110' : 'text-text-dim'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 1.5 : 1} />
              <span className="text-[9px] uppercase tracking-[0.2em] font-light">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};