export type Priority = 'high' | 'normal' | 'low';
export type PriorityTime = 'morning' | 'afternoon' | 'evening' | 'all-day';
export type FrequencyType = 'daily' | 'weekly' | 'custom';

export interface HabitStep {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Habit {
  id: string;
  name: string;
  frequencyType: FrequencyType;
  targetCount: number;
  priority: Priority;
  priorityTime: PriorityTime;
  customDays?: number[]; // 0 = Sonntag, 1 = Montag, etc.
  steps: HabitStep[];
  notes?: string;
  createdAt: number;
}

export interface HabitRecord {
  habitId: string;
  timestamp: number;
  // Speichert den Zustand der Steps zum Zeitpunkt des Check-ins
  completedSteps?: string[]; 
}

export interface HabitState {
  habits: Habit[];
  records: HabitRecord[];
}