import React, { useState } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { HabitForm } from './HabitForm';
import type { Habit } from '../types';

export const HabitsView: React.FC = () => {
  const { state, addHabit, updateHabit, deleteHabit } = useHabitStore();
  const [editingHabit, setEditingHabit] = useState<Habit | null | 'new'>(null);

  return (
    <div className="pt-8 animate-in fade-in duration-700">
      <header className="mb-12 flex justify-between items-center">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase">Echoes</h1>
        <button onClick={() => setEditingHabit('new')} className="text-accent-primary p-2">
          <Plus size={20} strokeWidth={1} />
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

      <div className="space-y-4">
        {state.habits.map(h => (
          <div key={h.id} className="group flex justify-between items-center border-l border-border-thin pl-4 py-4 hover:border-accent-primary transition-all">
            <div className="flex flex-col">
              <span className={`text-sm tracking-widest ${h.priority === 'high' ? 'text-text-vivid font-medium' : 'text-text-dim'}`}>{h.name}</span>
              <span className="text-[8px] uppercase tracking-tighter text-text-dim/40">
                {h.priorityTime} • {(h.steps || []).length} steps
              </span>
            </div>
            <button onClick={() => setEditingHabit(h)} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-dim hover:text-accent-primary p-2">
              <Edit3 size={16} strokeWidth={1} />
            </button>
          </div>
        ))}
        {state.habits.length === 0 && (
          <p className="text-center text-text-dim text-xs italic opacity-50 py-10">No echoes defined yet...</p>
        )}
      </div>
    </div>
  );
};