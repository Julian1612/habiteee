import React, { useState, useMemo } from 'react';
import { Plus, Edit3, Target } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { HabitForm } from './HabitForm';
import type { Habit } from '../types';

export const HabitsView: React.FC = () => {
  const { state, addHabit, updateHabit, deleteHabit } = useHabitStore();
  const [editingHabit, setEditingHabit] = useState<Habit | null | 'new'>(null);

  // Gruppierung der Echoes nach Kategorien für mehr Struktur
  const categorizedEchoes = useMemo(() => {
    const groups: Record<string, Habit[]> = {};
    (state.habits || []).forEach(h => {
      if (!groups[h.category]) groups[h.category] = [];
      groups[h.category].push(h);
    });
    return groups;
  }, [state.habits]);

  return (
    <div className="pt-8 animate-in fade-in duration-700 pb-12">
      <header className="mb-12 flex justify-between items-center">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase">Echoes</h1>
        <button 
          onClick={() => setEditingHabit('new')} 
          className="text-accent-primary p-2 active:scale-90 transition-transform"
        >
          <Plus size={24} strokeWidth={1} />
        </button>
      </header>

      {editingHabit && (
        <div className="mb-12">
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
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-text-dim/40 font-medium ml-1">
              {category}
            </h2>
            <div className="space-y-3">
              {habits.map(h => (
                <div 
                  key={h.id} 
                  className="group flex justify-between items-center border-l border-border-thin pl-4 py-3 hover:border-accent-primary transition-all duration-300"
                >
                  <div className="flex flex-col">
                    <span className={`text-sm tracking-widest ${h.priority === 'high' ? 'text-text-vivid font-medium' : 'text-text-dim'}`}>
                      {h.name}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Target size={10} className="text-accent-primary/40" />
                      <span className="text-[9px] uppercase tracking-tighter text-text-dim/40">
                        {h.goalValue} {h.unit} • {h.frequencyType}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEditingHabit(h)} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-text-dim hover:text-accent-primary p-2"
                  >
                    <Edit3 size={16} strokeWidth={1} />
                  </button>
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
    </div>
  );
};