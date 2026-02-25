import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Habit, HabitState } from '../types';

const initialState: HabitState = {
  habits: [],
  records: [],
};

export function useHabitStore() {
  const [state, setState] = useLocalStorage<HabitState>('habit-data', initialState);

  // Sicherstellen, dass state immer valide Arrays hat (Schutz vor alten Daten)
  const safeState: HabitState = {
    habits: Array.isArray(state?.habits) ? state.habits : [],
    records: Array.isArray(state?.records) ? state.records : [],
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      // Fallback für fehlende Felder
      steps: habitData.steps || [],
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

  const toggleRecord = (habitId: string, timestamp: number) => {
    setState((prev) => {
      const records = prev.records || [];
      const exists = records.find(
        (r) => r.habitId === habitId && r.timestamp === timestamp
      );
      if (exists) {
        return { ...prev, records: records.filter((r) => r !== exists) };
      }
      return { ...prev, records: [...records, { habitId, timestamp }] };
    });
  };

  return { state: safeState, setState, addHabit, updateHabit, deleteHabit, toggleRecord };
}