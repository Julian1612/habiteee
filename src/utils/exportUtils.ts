import type { HabitState, Habit } from '../types';

/**
 * Hilfsfunktion zur Validierung, ob ein Objekt ein gültiges Habit ist.
 */
const isValidHabit = (h: any): h is Habit => {
  return typeof h === 'object' && h !== null && typeof h.id === 'string' && typeof h.name === 'string';
};

/**
 * Exportiert den vollständigen App-Zustand (Habits + Fortschritte).
 */
export function exportData(data: HabitState): void {
  const exportObject: HabitState = {
    habits: Array.isArray(data.habits) ? data.habits : [],
    records: Array.isArray(data.records) ? data.records : []
  };
  
  const dataStr = JSON.stringify(exportObject, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `echoes-full-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exportiert nur die Habit-Konfigurationen (Templates).
 */
export function exportHabits(habits: Habit[]): void {
  const dataStr = JSON.stringify(Array.isArray(habits) ? habits : [], null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `echoes-templates-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validiert und importiert den vollständigen Zustand (Backup).
 */
export function importData(
  file: File, 
  onSuccess: (data: HabitState) => void, 
  onError: (err: Error) => void
): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      if (!content) throw new Error('Datei ist leer.');
      
      const parsed = JSON.parse(content);
      
      // Validierung der Backup-Struktur
      const habits = Array.isArray(parsed.habits) ? parsed.habits : [];
      const records = Array.isArray(parsed.records) ? parsed.records : [];

      if (habits.length === 0 && records.length === 0 && !parsed.hasOwnProperty('habits')) {
        throw new Error('Ungültiges Backup-Format. "habits" Array fehlt.');
      }

      onSuccess({ habits, records });
    } catch (err) {
      console.error('Import Error:', err);
      onError(err instanceof Error ? err : new Error('Fehler beim Lesen der Datei.'));
    }
  };
  reader.onerror = () => onError(new Error('Dateifehler beim Lesen.'));
  reader.readAsText(file);
}

/**
 * Importiert nur Habits (Templates) und validiert diese.
 */
export function importHabits(
  file: File, 
  onSuccess: (habits: Habit[]) => void, 
  onError: (err: Error) => void
): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      if (!content) throw new Error('Datei ist leer.');
      
      const parsed = JSON.parse(content);
      
      // Falls ein Full-Backup in den Habit-Only-Import geladen wird, extrahieren wir die Habits
      const habitsArray = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.habits) ? parsed.habits : null);

      if (!habitsArray) {
        throw new Error('Kein gültiges Habit-Array gefunden.');
      }

      // Filtere nur valide Habit-Objekte heraus
      const validHabits = habitsArray.filter(isValidHabit);
      
      if (validHabits.length === 0) {
        throw new Error('Die Datei enthält keine gültigen Habits.');
      }

      onSuccess(validHabits);
    } catch (err) {
      console.error('Habit Import Error:', err);
      onError(err instanceof Error ? err : new Error('Fehler beim Importieren der Habits.'));
    }
  };
  reader.onerror = () => onError(new Error('Dateifehler beim Lesen.'));
  reader.readAsText(file);
}