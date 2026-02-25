import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import type { FrequencyType } from '../types';

export const HabitsView: React.FC = () => {
  const { state, addHabit } = useHabitStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  return (
    <div className="pt-8 animate-in fade-in duration-700">
      <header className="mb-12 flex justify-between items-center">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase">Echoes</h1>
        <button onClick={() => setOpen(!open)} className="text-accent-primary p-2">
          {open ? <X size={20} strokeWidth={1} /> : <Plus size={20} strokeWidth={1} />}
        </button>
      </header>

      {open && (
        <div className="mb-12 p-6 bg-base-card rounded-ios border border-border-thin animate-in slide-in-from-top-4">
          <input 
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Define a new echo..."
            className="w-full bg-transparent border-b border-border-thin py-2 text-text-vivid focus:outline-none focus:border-accent-primary font-light"
          />
          <button 
            onClick={() => { addHabit({ name, frequencyType: 'daily', targetCount: 1 }); setOpen(false); setName(''); }}
            className="mt-6 w-full py-3 text-[10px] uppercase tracking-[0.2em] border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-base-bg transition-all"
          >
            Commit to existence
          </button>
        </div>
      )}

      <div className="space-y-4">
        {state.habits.map(h => (
          <div key={h.id} className="text-text-dim text-sm font-extralight tracking-widest border-l border-border-thin pl-4 py-2">
            {h.name}
          </div>
        ))}
      </div>
    </div>
  );
};