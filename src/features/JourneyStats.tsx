import { useMemo } from 'react';
import { Shield, Wind } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';

export const JourneyStats = () => {
  const { state } = useHabitStore();

  const totalResonance = useMemo(() => {
    let score = 0;
    (state.records || []).forEach(r => {
      if (r.value && r.value > 0) score += 1;
      if (r.completedSteps) score += r.completedSteps.length;
    });
    return score;
  }, [state.records]);

  const activeEchoes = (state.habits || []).length;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-6 bg-base-card rounded-ios border border-border-thin flex flex-col items-center text-center shadow-sm">
        <Shield size={20} className="text-accent-primary/60 mb-3" />
        <span className="text-2xl font-light tracking-tighter text-text-vivid">{totalResonance}</span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-text-dim mt-1 font-bold">Total Resonance</span>
      </div>
      
      <div className="p-6 bg-base-card rounded-ios border border-border-thin flex flex-col items-center text-center shadow-sm">
        <Wind size={20} className="text-accent-primary/60 mb-3" />
        <span className="text-2xl font-light tracking-tighter text-text-vivid">{activeEchoes}</span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-text-dim mt-1 font-bold">Active Echoes</span>
      </div>
    </div>
  );
};