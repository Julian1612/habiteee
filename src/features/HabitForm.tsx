import React, { useState } from 'react';
import { X, Hash, Shield, Trash2 } from 'lucide-react';
import type { Habit, Priority, PriorityTime, FrequencyType, UnitType } from '../types';
import { FormSection, SelectGroup, CycleSettings } from './FormSections';
import { StepSection } from './StepSection';

export const HabitForm: React.FC<{ initialData?: Habit; onSave: (d: any) => void; onClose: () => void; onDelete?: () => void }> = 
  ({ initialData, onSave, onClose, onDelete }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Mind');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'normal');
  const [time, setTime] = useState<PriorityTime>(initialData?.priorityTime || 'all-day');
  const [goalValue, setGoalValue] = useState(initialData?.goalValue || 1);
  const [unit, setUnit] = useState<UnitType>(initialData?.unit || 'count');
  const [freq, setFreq] = useState<FrequencyType>(initialData?.frequencyType || 'daily');
  const [startDay, setStartDay] = useState(initialData?.periodStartDay || 1); 
  const [customDays, setCustomDays] = useState<number[]>(initialData?.customDays || [0,1,2,3,4,5,6]);
  const [steps, setSteps] = useState(initialData?.steps || []);

  const tOpts = [{id:'morning',label:'Morning'},{id:'afternoon',label:'Day'},{id:'evening',label:'Evening'},{id:'all-day',label:'Always'}];

  return (
    <div className="flex flex-col h-full bg-base-card rounded-t-[32px] border-t border-border-thin animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <header className="flex justify-between items-center p-6 border-b border-border-thin/50 shrink-0">
        <button onClick={onClose} className="text-accent-primary text-sm font-medium active:opacity-50">Abbrechen</button>
        <h2 className="text-[11px] uppercase tracking-[0.3em] text-text-dim font-bold">Edit Echo</h2>
        <button onClick={onClose} className="p-2 -mr-2 text-text-dim/20"><X size={20} /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-40">
        <FormSection label="Intent">
          <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-border-thin rounded-2xl px-5 py-4 text-[16px] outline-none" placeholder="What is the intention?" />
        </FormSection>

        <SelectGroup options={['Mind', 'Body', 'Soul', 'Work', 'Growth']} active={category} onClick={setCategory} />
        
        <CycleSettings freq={freq} setFreq={setFreq} startDay={startDay} setStartDay={setStartDay} customDays={customDays} 
          toggleDay={(i: number) => setCustomDays(d => d.includes(i) ? d.filter(x => x !== i) : [...d, i])} days={['S','M','T','W','T','F','S']} />

        <div className="grid grid-cols-1 gap-8">
          <FormSection label="Priority" icon={<Shield size={14} />}>
            <SelectGroup options={['high', 'normal', 'low']} active={priority} onClick={setPriority} />
          </FormSection>
          <FormSection label="Temporal Focus">
            <SelectGroup options={tOpts} active={time} onClick={setTime} />
          </FormSection>
        </div>

        <FormSection label="Target Volume" icon={<Hash size={14} />}>
          <div className="flex gap-3">
            <input type="number" inputMode="decimal" value={goalValue} onChange={e => setGoalValue(Number(e.target.value))} className="w-24 bg-white/5 border border-border-thin rounded-2xl px-4 py-4 text-center text-[16px] outline-none" />
            <SelectGroup options={['count', 'minutes', 'hours', 'pages']} active={unit} onClick={setUnit} extraClass="flex-1 overflow-x-auto no-scrollbar" />
          </div>
        </FormSection>

        <StepSection steps={steps} setSteps={setSteps} />
      </div>

      <footer className="p-6 bg-base-card border-t border-border-thin/50 flex flex-col gap-3 shrink-0 pb-[env(safe-area-inset-bottom,24px)]">
        <div className="flex gap-3">
          {initialData && <button onClick={onDelete} className="p-5 rounded-2xl border border-red-900/20 text-red-900 active:bg-red-900/10"><Trash2 size={22} /></button>}
          <button onClick={() => onSave({ name, category, priority, priorityTime: time, goalValue, unit, frequencyType: freq, periodStartDay: startDay, customDays, steps })}
            className="flex-1 py-5 bg-accent-primary text-white text-[11px] uppercase tracking-[0.3em] font-bold rounded-2xl active:scale-[0.98] shadow-lg">
            Save Echo
          </button>
        </div>
        <button onClick={onClose} className="w-full py-3 text-text-dim text-[10px] uppercase tracking-widest font-bold active:opacity-50">Abbrechen</button>
      </footer>
    </div>
  );
};