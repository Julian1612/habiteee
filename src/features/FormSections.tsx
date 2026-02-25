import React from 'react';
import { Clock } from 'lucide-react';

export const FormSection: React.FC<{ label: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => (
  <div className="space-y-4">
    <label className="text-[10px] uppercase tracking-widest text-text-dim font-bold flex items-center gap-2 ml-1">
      {icon} {label}
    </label>
    {children}
  </div>
);

export const SelectGroup = ({ options, active, onClick, extraClass = "" }: any) => (
  <div className={`flex flex-wrap gap-2 ${extraClass}`}>
    {options.map((opt: any) => (
      <button key={opt.id || opt} onClick={() => onClick(opt.id || opt)}
        className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all active:scale-95 ${
          (active === (opt.id || opt)) ? 'bg-accent-primary text-white border-accent-primary font-bold' : 'text-text-dim border-border-thin'
        }`}>
        {opt.label || opt}
      </button>
    ))}
  </div>
);

export const CycleSettings = ({ freq, setFreq, startDay, setStartDay, customDays, toggleDay, days }: any) => (
  <FormSection label="Tracking Cycle & Days" icon={<Clock size={14} />}>
    <div className="grid grid-cols-2 gap-4">
      <select value={freq} onChange={e => setFreq(e.target.value)} className="bg-white/5 border border-border-thin rounded-xl px-4 py-3 text-[16px] text-text-vivid outline-none">
        {['daily', 'weekly', 'period'].map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
      </select>
      {freq === 'period' && (
        <select value={startDay} onChange={e => setStartDay(Number(e.target.value))} className="bg-white/5 border border-border-thin rounded-xl px-4 py-3 text-[16px] text-text-vivid outline-none">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => <option key={i} value={i}>Starts {d}</option>)}
        </select>
      )}
    </div>
    <div className="flex justify-between px-1">
      {days.map((d: string, i: number) => (
        <button key={i} type="button" onClick={() => toggleDay(i)}
          className={`w-10 h-10 rounded-full text-[10px] border transition-all ${customDays.includes(i) ? 'bg-accent-primary text-white shadow-lg' : 'border-border-thin text-text-dim'}`}>
          {d}
        </button>
      ))}
    </div>
  </FormSection>
);