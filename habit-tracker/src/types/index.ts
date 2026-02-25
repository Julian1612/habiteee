// src/types/index.ts

export type FrequencyType = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  frequencyType: FrequencyType;
  // Ziel-Frequenz (z.B. 1x täglich, 3x pro Woche)
  targetCount: number; 
  // Optional: Spezifische Wochentage (0 = Sonntag, 1 = Montag, etc.)
  activeDays?: number[]; 
  createdAt: number;
}

export interface HabitRecord {
  id: string;
  habitId: string;
  // Zeitstempel der Ausführung
  timestamp: number; 
}

export interface HabitState {
  habits: Habit[];
  records: HabitRecord[];
}