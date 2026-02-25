import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Habit, HabitRecord, HabitState } from '../types';

const initialState: HabitState = {
  habits: [],
  records: [],
};

export function useHabitStore() {
  const [state, setState] = useLocalStorage<HabitState>('habit-data', initialState);

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setState((prev) => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const toggleRecord = (habitId: string, timestamp: number) => {
    setState((prev) => {
      const exists = prev.records.find(r => r.habitId === habitId && r.timestamp === timestamp);
      if (exists) {
        return {
          ...prev,
          records: prev.records.filter(r => r.id !== exists.id)
        };
      }
      const newRecord: HabitRecord = { id: crypto.randomUUID(), habitId, timestamp };
      return { ...prev, records: [...prev.records, newRecord] };
    });
  };

  return { state, setState, addHabit, toggleRecord };
}