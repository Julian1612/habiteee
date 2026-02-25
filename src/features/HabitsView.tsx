import { useState, useMemo } from 'react';
import { Plus, Edit3, Target } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { HabitForm } from './HabitForm';
import type { Habit } from '../types';

export const HabitsView = () => {
  const { state, addHabit, updateHabit, deleteHabit } = useHabitStore();
  const [editingHabit, setEditingHabit] = useState<Habit | null | 'new'>(null);

  const categorizedEchoes = useMemo(() => {
    const groups: Record<string, Habit[]> = {};
    (state.habits || []).forEach(h => {
      const cat = h.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(h);
    });
    return groups;
  }, [state.habits]);

  return (
    <div className="pt-8 animate-in fade-in duration-700 pb-52"> {/* Erhöhtes Padding-Bottom (pb-52) für mehr Platz */}
      <header className="mb-12 px-1">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase">Echoes</h1>
        <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2 font-medium">The blueprint of your soul</p>
      </header>

      {editingHabit && (
        <div className="fixed inset-0 z-[60] bg-base-bg/95 backdrop-blur-md p-6 overflow-y-auto">
          <HabitForm 
            initialData={editingHabit === 'new' ? undefined : editingHabit}
            onClose={() => setEditingHabit(null)}
            onDelete={() => {
              if (editingHabit !== 'new') {
                deleteHabit(editingHabit.id);
                setEditingHabit(null);
              }
            }}
            onSave={(data) => {
              if (editingHabit === 'new') addHabit(data);
              else updateHabit(editingHabit.id, data);
              setEditingHabit(null);
            }}
          />
        </div>
      )}

      <div className="space-y-12">
        {Object.entries(categorizedEchoes).map(([category, habits]) => (
          <section key={category} className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-text-dim font-bold ml-1 px-1">
              {category}
            </h2>
            <div className="space-y-3">
              {habits.map(h => (
                <div 
                  key={h.id} 
                  onClick={() => setEditingHabit(h)}
                  className="group flex justify-between items-center border-l-2 border-border-thin pl-4 py-4 hover:border-accent-primary bg-base-card/30 rounded-r-xl transition-all duration-300 active:bg-white/5"
                >
                  <div className="flex flex-col">
                    <span className={`text-sm tracking-widest font-medium ${h.priority === 'high' ? 'text-accent-primary' : 'text-text-vivid'}`}>
                      {h.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Target size={12} className="text-accent-primary/60" />
                      <span className="text-[10px] uppercase tracking-wider text-text-dim font-bold">
                        {h.goalValue} {h.unit} • {h.frequencyType}
                      </span>
                    </div>
                  </div>
                  <Edit3 size={16} className="text-text-dim/40 mr-2" strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </section>
        ))}

        {state.habits.length === 0 && !editingHabit && (
          <p className="text-center text-text-dim text-xs italic opacity-50 py-20 tracking-widest">
            Silence... Define your first echo.
          </p>
        )}
      </div>

      {/* Primärer Aktions-Button: Jetzt links (left-6) und mit sicherem Abstand (bottom-[140px]) */}
      <div className="fixed bottom-[140px] left-6 z-40">
        <button 
          onClick={() => setEditingHabit('new')} 
          className="bg-accent-primary text-white p-5 rounded-full shadow-[0_8px_24px_rgba(99,102,241,0.4)] active:scale-90 transition-all duration-300"
        >
          <Plus size={28} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};