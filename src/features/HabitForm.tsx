import React, { useState } from 'react';
import { X, Plus, Trash2, Hash, Clock, Layers, Sun, SunDim, Moon, Infinity as AllDayIcon, Shield } from 'lucide-react';
import type { Habit, HabitStep, Priority, PriorityTime, UnitType, FrequencyType } from '../types';

interface HabitFormProps {
  initialData?: Habit;
  onSave: (data: Omit<Habit, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  onDelete?: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ initialData, onSave, onClose, onDelete }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Mind');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'normal');
  const [time, setTime] = useState<PriorityTime>(initialData?.priorityTime || 'all-day');
  const [goalValue, setGoalValue] = useState(initialData?.goalValue || 1);
  const [unit, setUnit] = useState<UnitType>(initialData?.unit || 'count');
  const [freq, setFreq] = useState<FrequencyType>(initialData?.frequencyType || 'daily');
  const [startDay, setStartDay] = useState(initialData?.periodStartDay || 1); 
  const [customDays, setCustomDays] = useState<number[]>(initialData?.customDays || [0,1,2,3,4,5,6]);
  const [steps, setSteps] = useState<HabitStep[]>(initialData?.steps || []);

  const units: { id: UnitType; label: string }[] = [
    { id: 'count', label: 'Times' }, { id: 'minutes', label: 'Min' },
    { id: 'hours', label: 'Hrs' }, { id: 'pages', label: 'Pages' }
  ];

  const timeOptions = [
    { id: 'morning', label: 'Morning', icon: Sun },
    { id: 'afternoon', label: 'Day', icon: SunDim },
    { id: 'evening', label: 'Evening', icon: Moon },
    { id: 'all-day', label: 'Always', icon: AllDayIcon },
  ] as const;

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const categories = ['Mind', 'Body', 'Soul', 'Work', 'Growth'];

  const toggleDay = (idx: number) => {
    setCustomDays(prev => prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx]);
  };

  return (
    <div className="p-6 bg-base-card rounded-ios border border-border-thin space-y-8 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto custom-scrollbar">
      <header className="flex justify-between items-center sticky top-0 bg-base-card pb-4 z-10 border-b border-border-thin/50 mb-2">
        <h2 className="text-[10px] uppercase tracking-[0.3em] text-accent-primary font-medium">Soul Architecture</h2>
        <button onClick={onClose} className="text-text-dim hover:text-text-vivid"><X size={18} /></button>
      </header>

      {/* Name & Category */}
      <div className="space-y-6">
        <input 
          value={name} onChange={e => setName(e.target.value)}
          placeholder="What is the intention?"
          className="w-full bg-transparent border-b border-border-thin py-2 text-xl focus:outline-none focus:border-accent-primary font-light"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border transition-all ${category === cat ? 'bg-accent-primary text-base-bg border-accent-primary' : 'text-text-dim border-border-thin'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Level Selection (Fix für setPriority) */}
      <div className="space-y-4">
        <label className="text-[9px] uppercase tracking-widest text-text-dim flex items-center gap-2">
          <Shield size={12} /> Priority Level
        </label>
        <div className="flex gap-2">
          {(['high', 'normal', 'low'] as Priority[]).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`flex-1 py-2 rounded-xl border text-[10px] uppercase tracking-widest transition-all ${
                priority === p ? 'border-accent-primary bg-accent-soft text-accent-primary font-bold' : 'border-border-thin text-text-dim'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Day Time Focus */}
      <div className="space-y-4">
        <label className="text-[9px] uppercase tracking-widest text-text-dim flex items-center gap-2">
          <Clock size={12} /> Temporal Focus
        </label>
        <div className="grid grid-cols-4 gap-2">
          {timeOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTime(id)}
              className={`flex flex-col items-center py-3 rounded-xl border transition-all ${
                time === id ? 'border-accent-primary bg-accent-soft text-accent-primary' : 'border-border-thin text-text-dim'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span className="text-[7px] uppercase tracking-tighter mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cycle & Days */}
      <div className="space-y-4">
        <label className="text-[9px] uppercase tracking-widest text-text-dim flex items-center gap-2">
          <Clock size={12} /> Cycle & Days
        </label>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select 
            value={freq} onChange={e => setFreq(e.target.value as FrequencyType)}
            className="bg-white/5 border-none rounded-xl px-4 py-2 text-xs outline-none text-text-vivid"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="period">Flexible Period</option>
          </select>
          {freq === 'period' && (
            <select 
              value={startDay} onChange={e => setStartDay(Number(e.target.value))}
              className="bg-white/5 border-none rounded-xl px-4 py-2 text-xs outline-none text-text-vivid"
            >
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <option key={i} value={i}>Starts {d}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex justify-between px-1">
          {days.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleDay(i)}
              className={`w-8 h-8 rounded-full text-[10px] border transition-all ${
                customDays.includes(i) ? 'bg-accent-primary border-accent-primary text-base-bg' : 'border-border-thin text-text-dim'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Target Volume */}
      <div className="space-y-4">
        <label className="text-[9px] uppercase tracking-widest text-text-dim flex items-center gap-2">
          <Hash size={12} /> Target Volume
        </label>
        <div className="flex gap-4 items-center">
          <input 
            type="number" value={goalValue} onChange={e => setGoalValue(Number(e.target.value))}
            className="w-20 bg-white/5 border-none rounded-xl px-4 py-2 text-center text-sm outline-none focus:ring-1 ring-accent-primary"
          />
          <div className="flex flex-1 gap-1">
            {units.map(u => (
              <button key={u.id} type="button" onClick={() => setUnit(u.id)} className={`flex-1 py-2 rounded-lg text-[8px] uppercase border transition-all ${unit === u.id ? 'border-accent-primary text-accent-primary bg-accent-soft' : 'border-border-thin text-text-dim'}`}>
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        <label className="text-[9px] uppercase tracking-widest text-text-dim flex items-center gap-2">
          <Layers size={12} /> Incremental Steps
        </label>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex gap-3 items-center group/step">
              <input 
                value={step.text} 
                onChange={e => {
                  const newSteps = [...steps];
                  newSteps[i].text = e.target.value;
                  setSteps(newSteps);
                }}
                className="flex-1 bg-white/5 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 ring-accent-primary/30 outline-none"
                placeholder="Definition of Done..."
              />
              <button type="button" onClick={() => setSteps(steps.filter(s => s.id !== step.id))} className="text-text-dim/30 hover:text-red-900 transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
          <button type="button" onClick={() => setSteps([...steps, { id: crypto.randomUUID(), text: '', isCompleted: false }])} className="text-[10px] text-accent-primary flex items-center gap-2 pt-2 opacity-60 hover:opacity-100 transition-opacity">
            <Plus size={14} /> Add Step
          </button>
        </div>
      </div>

      <div className="pt-6 flex gap-3 sticky bottom-0 bg-base-card border-t border-border-thin/50">
        {initialData && (
          <button type="button" onClick={onDelete} className="p-4 rounded-xl border border-red-900/20 text-red-900 hover:bg-red-900/10 transition-colors"><Trash2 size={18} /></button>
        )}
        <button 
          type="button"
          onClick={() => onSave({ 
            name, 
            category, 
            priority, 
            priorityTime: time, 
            goalValue, 
            unit, 
            frequencyType: freq, 
            periodStartDay: startDay, 
            customDays, 
            steps 
          })} // "targetCount" hier endgültig entfernt
          className="flex-1 py-4 bg-accent-primary text-base-bg text-[10px] uppercase tracking-[0.3em] font-bold rounded-xl active:scale-[0.98] transition-all"
        >
          Etch into Time
        </button>
      </div>
    </div>
  );
};