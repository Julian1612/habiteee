import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Habit, HabitState, HabitRecord } from '../types';

const initialState: HabitState = {
  habits: [],
  records: [],
};

export function useHabitStore() {
  const [state, setState] = useLocalStorage<HabitState>('habit-data', initialState);

  // Schutz vor korrupten Daten
  const safeState: HabitState = {
    habits: Array.isArray(state?.habits) ? state.habits : [],
    records: Array.isArray(state?.records) ? state.records : [],
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      steps: habitData.steps || [],
      // Standardwerte falls nicht gesetzt
      category: habitData.category || 'General',
      goalValue: habitData.goalValue || 1,
      unit: habitData.unit || 'count',
    };
    setState((prev) => ({
      ...prev,
      habits: [...(prev.habits || []), newHabit],
    }));
  };

  const updateHabit = (id: string, data: Partial<Habit>) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === id ? { ...h, ...data } : h)),
    }));
  };

  const deleteHabit = (id: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
      records: prev.records.filter((r) => r.habitId !== id),
    }));
  };

  /**
   * Erfasst einen Fortschrittswert. 
   * Bei "count" (z.B. 4x Sport) wird oft +1 gerechnet.
   * Bei "minutes" (z.B. 30 Min Meditation) kann ein spezifischer Wert übergeben werden.
   */
  const addRecordValue = (habitId: string, timestamp: number, value: number) => {
    setState((prev) => ({
      ...prev,
      records: [...(prev.records || []), { habitId, timestamp, value }]
    }));
  };

  // Löscht den letzten Record eines Tages (für "Undo"-Funktion)
  const removeLastRecord = (habitId: string, timestamp: number) => {
    setState((prev) => {
      const records = prev.records || [];
      // Finde den Index des letzten Eintrags für dieses Habit an diesem Tag
      const lastIndex = [...records].reverse().findIndex(
        (r) => r.habitId === habitId && r.timestamp === timestamp
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