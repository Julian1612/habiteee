import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Habit, HabitState } from '../types';

const initialState: HabitState = {
  habits: [],
  records: [],
};

export function useHabitStore() {
  const [state, setState] = useLocalStorage<HabitState>('habit-data', initialState);

  // Der safeState stellt sicher, dass alle Views (Journey, Presence) 
  // immer mit validen Arrays arbeiten, selbst wenn das JSON unvollständig war.
  const safeState: HabitState = {
    habits: Array.isArray(state?.habits) ? state.habits : [],
    records: Array.isArray(state?.records) ? state.records : [],
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      // Standardwerte setzen, falls sie im Formular fehlten
      steps: habitData.steps || [],
      category: habitData.category || 'Mind',
      goalValue: habitData.goalValue || 1,
      unit: habitData.unit || 'count',
      customDays: habitData.customDays || [0, 1, 2, 3, 4, 5, 6],
      priorityTime: habitData.priorityTime || 'all-day',
      priority: habitData.priority || 'normal'
    };
    setState((prev) => ({
      ...prev,
      habits: [...(prev.habits || []), newHabit],
    }));
  };

  const updateHabit = (id: string, data: Partial<Habit>) => {
    setState((prev) => ({
      ...prev,
      habits: (prev.habits || []).map((h) => (h.id === id ? { ...h, ...data } : h)),
    }));
  };

  const deleteHabit = (id: string) => {
    setState((prev) => ({
      ...prev,
      habits: (prev.habits || []).filter((h) => h.id !== id),
      records: (prev.records || []).filter((r) => r.habitId !== id),
    }));
  };

  const addRecordValue = (habitId: string, timestamp: number, value: number) => {
    setState((prev) => ({
      ...prev,
      records: [...(prev.records || []), { habitId, timestamp, value }]
    }));
  };

  const removeLastRecord = (habitId: string, timestamp: number) => {
    setState((prev) => {
      const records = prev.records || [];
      // Wir suchen den letzten Record für dieses Habit am selben Tag
      const lastIndex = [...records].reverse().findIndex(
        (r) => r.habitId === habitId && Math.abs(r.timestamp - timestamp) < 86400000
      );
      
      if (lastIndex === -1) return prev;
      
      const actualIndex = records.length - 1 - lastIndex;
      return {
        ...prev,
        records: records.filter((_, i) => i !== actualIndex)
      };
    });
  };

  return { 
    state: safeState, 
    setState, 
    addHabit, 
    updateHabit, 
    deleteHabit, 
    addRecordValue, 
    removeLastRecord 
  };
}