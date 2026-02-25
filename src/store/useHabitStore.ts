import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Habit, HabitState } from '../types'; // HabitRecord wurde hier entfernt, um den TS-Fehler zu beheben

const initialState: HabitState = {
  habits: [],
  records: [],
};

export function useHabitStore() {
  const [state, setState] = useLocalStorage<HabitState>('habit-data', initialState);

  // Sicherstellen, dass state immer valide Arrays hat (Schutz vor alten/korrupten Daten)
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
      category: habitData.category || 'Mind',
      goalValue: habitData.goalValue || 1,
      unit: habitData.unit || 'count',
      customDays: habitData.customDays || [0, 1, 2, 3, 4, 5, 6]
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
   * Erfasst einen Fortschrittswert (z.B. +1 mal Sport oder +15 Minuten).
   */
  const addRecordValue = (habitId: string, timestamp: number, value: number) => {
    setState((prev) => ({
      ...prev,
      records: [...(prev.records || []), { habitId, timestamp, value }]
    }));
  };

  /**
   * Löscht den letzten Eintrag für ein Habit (Undo-Funktion).
   */
  const removeLastRecord = (habitId: string, timestamp: number) => {
    setState((prev) => {
      const records = prev.records || [];
      const lastIndex = [...records].reverse().findIndex(
        (r) => r.habitId === habitId && r.timestamp <= timestamp + 86400000 // Sucht im Bereich des Tages
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