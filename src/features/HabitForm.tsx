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
  
  // Diese Zustände werden nun im UI verwendet
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
    <div className="flex flex-col h-full bg-base-card rounded-t-[32px] border-t border-border-thin animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <header className="flex justify-between items-center p-6 border-b border-border-thin/50 shrink-0">
        <h2 className="text-[11px] uppercase tracking-[0.3em] text-accent-primary font-bold">Soul Architecture</h2>
        <button 
          onClick={onClose} 
          className="p-2 -mr-2 text-text-dim active:text-text-vivid active:scale-90 transition-all"
        >
          <X size={22} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar pb-32">
        {/* Name Input */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-text-dim font-bold ml-1">Intent</label>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)}
            placeholder="What is the intention?"
            className="w-full bg-white/5 border border-border-thin rounded-2xl px-5 py-4 text-[16px] focus:outline-none focus:border-accent-primary font-light transition-all"
          />
        </div>

        {/* Kategorien */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategory(cat)} 
              className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all active:scale-95 ${
                category === cat ? 'bg-accent-primary text-white border-accent-primary font-bold' : 'text-text-dim border-border-thin'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Zyklus & Wochentage (Löst die TS-Fehler für setFreq, setStartDay, days und toggleDay) */}
        <div className="space-y-6">
          <label className="text-[10px] uppercase tracking-widest text-text-dim font-bold flex items-center gap-2 ml-1">
            <Clock size={14} /> Tracking Cycle & Days
          </label>
          <div className="grid grid-cols-2 gap-4">
            <select 
              value={freq} 
              onChange={e => setFreq(e.target.value as FrequencyType)}
              className="bg-white/5 border border-border-thin rounded-xl px-4 py-3 text-[16px] text-text-vivid outline-none focus:border-accent-primary"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="period">Flexible Period</option>
            </select>
            {freq === 'period' && (
              <select 
                value={startDay} 
                onChange={e => setStartDay(Number(e.target.value))}
                className="bg-white/5 border border-border-thin rounded-xl px-4 py-3 text-[16px] text-text-vivid outline-none focus:border-accent-primary animate-in fade-in"
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
                className={`w-10 h-10 rounded-full text-[10px] border transition-all active:scale-90 ${
                  customDays.includes(i) ? 'bg-accent-primary border-accent-primary text-white shadow-lg shadow-accent-primary/20' : 'border-border-thin text-text-dim'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Priorität & Zeit */}
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-text-dim font-bold flex items-center gap-2 ml-1">
              <Shield size={14} /> Priority
            </label>
            <div className="flex gap-2">
              {(['high', 'normal', 'low'] as Priority[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-3 rounded-xl border text-[10px] uppercase tracking-widest transition-all active:scale-95 ${
                    priority === p ? 'border-accent-primary bg-accent-soft text-accent-primary font-bold' : 'border-border-thin text-text-dim'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest text-text-dim font-bold flex items-center gap-2 ml-1">
              <Clock size={14} /> Temporal Focus
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeOptions.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTime(id)}
                  className={`flex flex-col items-center py-4 rounded-xl border transition-all active:scale-95 ${
                    time === id ? 'border-accent-primary bg-accent-soft text-accent-primary' : 'border-border-thin text-text-dim'
                  }`}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="text-[8px] uppercase tracking-tighter mt-2 font-bold">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Volumen & Ziel */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-text-dim font-bold flex items-center gap-2 ml-1">
            <Hash size={14} /> Target Volume
          </label>
          <div className="flex gap-3">
            <input 
              type="number" 
              inputMode="decimal"
              value={goalValue} 
              onChange={e => setGoalValue(Number(e.target.value))}
              className="w-24 bg-white/5 border border-border-thin rounded-2xl px-4 py-4 text-center text-[16px] outline-none focus:ring-1 ring-accent-primary"
            />
            <div className="flex flex-1 gap-1.5 overflow-x-auto no-scrollbar">
              {units.map(u => (
                <button 
                  key={u.id} 
                  onClick={() => setUnit(u.id)} 
                  className={`px-4 py-2 rounded-xl text-[9px] uppercase border transition-all shrink-0 active:scale-95 ${
                    unit === u.id ? 'border-accent-primary text-accent-primary bg-accent-soft font-bold' : 'border-border-thin text-text-dim'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Unteraufgaben */}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-text-dim font-bold flex items-center gap-2 ml-1">
            <Layers size={14} /> Incremental Steps
          </label>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={step.id} className="flex gap-3 items-center animate-in fade-in slide-in-from-left-2">
                <input 
                  value={step.text} 
                  onChange={e => {
                    const newSteps = [...steps];
                    newSteps[i].text = e.target.value;
                    setSteps(newSteps);
                  }}
                  className="flex-1 bg-white/5 border border-border-thin rounded-xl px-4 py-3 text-[16px] focus:ring-1 ring-accent-primary outline-none"
                  placeholder="Definition of Done..."
                />
                <button onClick={() => setSteps(steps.filter(s => s.id !== step.id))} className="p-2 text-text-dim/40 active:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button 
              onClick={() => setSteps([...steps, { id: crypto.randomUUID(), text: '', isCompleted: false }])} 
              className="w-full py-4 border border-dashed border-border-thin rounded-2xl text-[10px] text-accent-primary uppercase tracking-widest font-bold flex items-center justify-center gap-2 active:bg-accent-soft transition-all"
            >
              <Plus size={16} /> Add Step
            </button>
          </div>
        </div>
      </div>

      <footer className="p-6 bg-base-card border-t border-border-thin/50 flex gap-3 shrink-0 pb-[env(safe-area-inset-bottom,24px)]">
        {initialData && (
          <button 
            onClick={onDelete} 
            className="p-5 rounded-2xl border border-red-900/20 text-red-900 active:bg-red-900/10 transition-colors"
          >
            <Trash2 size={22} />
          </button>
        )}
        <button 
          onClick={() => onSave({ 
            name, category, priority, priorityTime: time, goalValue, unit, 
            frequencyType: freq, periodStartDay: startDay, customDays, steps 
          })}
          className="flex-1 py-5 bg-accent-primary text-white text-[11px] uppercase tracking-[0.3em] font-bold rounded-2xl active:scale-[0.98] shadow-lg shadow-accent-primary/20 transition-all"
        >
          Etch into Time
        </button>
      </footer>
    </div>
  );
};