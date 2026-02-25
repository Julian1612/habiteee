import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Habit, HabitStep, Priority, PriorityTime } from '../types';

interface HabitFormProps {
  initialData?: Habit;
  onSave: (data: Omit<Habit, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  onDelete?: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ initialData, onSave, onClose, onDelete }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'normal');
  const [time, setTime] = useState<PriorityTime>(initialData?.priorityTime || 'all-day');
  const [steps, setSteps] = useState<HabitStep[]>(initialData?.steps || []);
  const [customDays, setCustomDays] = useState<number[]>(initialData?.customDays || [1,2,3,4,5]);

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const toggleDay = (index: number) => {
    setCustomDays(prev => prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index]);
  };

  return (
    <div className="p-6 bg-base-card rounded-ios border border-border-thin space-y-8 animate-in fade-in zoom-in-95">
      <header className="flex justify-between items-center">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-accent-primary font-medium">Configure Echo</h2>
        <button onClick={onClose} className="text-text-dim hover:text-text-vivid"><X size={18} /></button>
      </header>

      <input 
        value={name} onChange={e => setName(e.target.value)}
        placeholder="Name of the habit..."
        className="w-full bg-transparent border-b border-border-thin py-2 text-lg focus:outline-none focus:border-accent-primary font-light"
      />

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[9px] uppercase tracking-widest text-text-dim">Priority</label>
          <div className="flex gap-2">
            {(['high', 'normal', 'low'] as Priority[]).map(p => (
              <button key={p} type="button" onClick={() => setPriority(p)} className={`flex-1 py-2 rounded-xl text-[10px] border transition-all ${priority === p ? 'border-accent-primary text-accent-primary bg-accent-soft' : 'border-border-thin text-text-dim'}`}>{p}</button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-[9px] uppercase tracking-widest text-text-dim">Timeframe</label>
          <div className="flex gap-2">
            {(['morning', 'afternoon', 'evening', 'all-day'] as PriorityTime[]).map(t => (
              <button key={t} type="button" onClick={() => setTime(t)} className={`flex-1 py-2 rounded-xl text-[10px] border transition-all ${time === t ? 'border-accent-primary text-accent-primary bg-accent-soft' : 'border-border-thin text-text-dim'}`}>
                {t === 'all-day' ? '∞' : t[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[9px] uppercase tracking-widest text-text-dim">Schedule</label>
        <div className="flex justify-between">
          {days.map((d, i) => (
            <button key={i} type="button" onClick={() => toggleDay(i)} className={`w-8 h-8 rounded-full text-[10px] border transition-all ${customDays.includes(i) ? 'bg-accent-primary border-accent-primary text-base-bg' : 'border-border-thin text-text-dim'}`}>{d}</button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[9px] uppercase tracking-widest text-text-dim">Steps</label>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex gap-3">
              <input 
                value={step.text} 
                onChange={e => {
                  const newSteps = [...steps];
                  newSteps[i].text = e.target.value;
                  setSteps(newSteps);
                }}
                className="flex-1 bg-white/5 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 ring-accent-primary/30 outline-none"
                placeholder="Task description..."
              />
              <button type="button" onClick={() => setSteps(steps.filter(s => s.id !== step.id))} className="text-text-dim/30 hover:text-red-900"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setSteps([...steps, { id: crypto.randomUUID(), text: '', isCompleted: false }])} className="text-[10px] text-accent-primary flex items-center gap-2 mt-2 opacity-70 hover:opacity-100 transition-opacity"><Plus size={14} /> Add Step</button>
      </div>

      <div className="pt-4 flex gap-3">
        {initialData && (
          <button type="button" onClick={onDelete} className="p-3 rounded-xl border border-red-900/20 text-red-900 hover:bg-red-900/10 transition-colors"><Trash2 size={18} /></button>
        )}
        <button 
          type="button"
          onClick={() => onSave({ name, priority, priorityTime: time, steps, frequencyType: 'custom', customDays, targetCount: 1 })}
          className="flex-1 py-4 bg-accent-primary text-base-bg text-[10px] uppercase tracking-[0.3em] font-bold rounded-xl active:scale-[0.98] transition-all"
        >
          Commit Changes
        </button>
      </div>
    </div>
  );
};