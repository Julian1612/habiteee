// src/types/index.ts

export type Priority = 'high' | 'normal' | 'low';
export type PriorityTime = 'morning' | 'afternoon' | 'evening' | 'all-day';
export type FrequencyType = 'daily' | 'weekly' | 'custom' | 'period';

// Neue Einheiten für flexibleres Tracking
export type UnitType = 'count' | 'minutes' | 'hours' | 'liters' | 'km' | 'pages';

export interface HabitStep {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface Habit {
  id: string;
  name: string;
  category: string;             // Neu: Zur Organisation (z.B. Health, Mind, Work)
  frequencyType: FrequencyType;
  
  // Flexibles Ziel-System
  goalValue: number;            // Wie oft/viel? (z.B. 4 mal oder 30 Minuten)
  unit: UnitType;               // Die Maßeinheit
  
  priority: Priority;
  priorityTime: PriorityTime;
  
  // Zeitfenster-Logik
  customDays?: number[];        // Spezifische Wochentage (0-6)
  periodStartDay?: number;      // Neu: Starttag für Zeiträume (z.B. 3 für Mittwoch)
  
  // Ästhetik
  color?: string;               // Individuelle Farbe für das "mysterische" Design
  icon?: string;                // Name des Lucide-Icons
  
  steps: HabitStep[];
  notes?: string;
  createdAt: number;
}

export interface HabitRecord {
  habitId: string;
  timestamp: number;
  value: number;                // Neu: Der tatsächlich erreichte Wert (z.B. 10 für 10 Min)
  completedSteps?: string[]; 
}

export interface HabitState {
  habits: Habit[];
  records: HabitRecord[];
}