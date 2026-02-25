import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Habit, HabitState } from '../types';

const initialState: HabitState = {
  habits: [],
  records: [],
};

export function useHabitStore() {
  const [state, setState] = useLocalStorage<HabitState>('habit-data', initialState);

  const safeState: HabitState = {
    habits: Array.isArray(state?.habits) ? state.habits : [],
    records: Array.isArray(state?.records) ? state.records : [],
  };

  const setRawState = (newState: HabitState) => {
    setState({
      habits: Array.isArray(newState.habits) ? newState.habits : [],
      records: Array.isArray(newState.records) ? newState.records : [],
    });
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
      const dayStart = new Date(timestamp).setHours(0, 0, 0, 0);
      
      const lastIndex = [...records].reverse().findIndex(
        (r) => r.habitId === habitId && 
               new Date(r.timestamp).setHours(0, 0, 0, 0) === dayStart &&
               r.value > 0
      );
      
      if (lastIndex === -1) return prev;
      
      const actualIndex = records.length - 1 - lastIndex;
      const targetRecord = records[actualIndex];

      if (targetRecord.completedSteps && targetRecord.completedSteps.length > 0) {
         const newRecords = [...records];
         newRecords[actualIndex] = { ...targetRecord, value: 0 };
         return { ...prev, records: newRecords };
      }

      return {
        ...prev,
        records: records.filter((_, i) => i !== actualIndex)
      };
    });
  };

  const toggleStepRecord = (habitId: string, stepId: string, timestamp: number) => {
    setState((prev) => {
      const records = prev.records || [];
      const targetDay = new Date(timestamp).setHours(0, 0, 0, 0);
      
      const todaysRecords = records.filter((r) => {
        const rDay = new Date(r.timestamp).setHours(0, 0, 0, 0);
        return r.habitId === habitId && rDay === targetDay;
      });

      if (todaysRecords.length > 0) {
        const baseRecord = todaysRecords[0];
        const currentSteps = baseRecord.completedSteps || [];
        
        const newSteps = currentSteps.includes(stepId)
          ? currentSteps.filter(id => id !== stepId)
          : [...currentSteps, stepId];
        
        return {
          ...prev,
          records: records.map(r => r === baseRecord ? { ...r, completedSteps: newSteps } : r)
        };
      } else {
        return {
          ...prev,
          records: [...records, { 
            habitId, 
            timestamp, 
            value: 0, 
            completedSteps: [stepId] 
          }]
        };
      }
    });
  };

  return { 
    state: safeState, 
    setState, 
    setRawState,
    addHabit, 
    updateHabit, 
    deleteHabit, 
    addRecordValue, 
    removeLastRecord,
    toggleStepRecord 
  };
}