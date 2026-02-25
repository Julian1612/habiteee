import type { HabitState, Habit } from '../types';

/**
 * Exportiert den vollständigen App-Zustand (Habits + Fortschritte).
 * Dies ist die Grundlage für die Journey-Heatmap und alle Statistiken.
 */
export function exportData(data: HabitState): void {
  // Wir stellen sicher, dass wir nur die relevanten Felder exportieren
  const exportObject: HabitState = {
    habits: data.habits || [],
    records: data.records || []
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
 * Nützlich, um die Struktur ohne die persönliche Historie zu teilen.
 */
export function exportHabits(habits: Habit[]): void {
  const dataStr = JSON.stringify(habits, null, 2);
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
 * Validiert und importiert den vollständigen Zustand.
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
      const parsed = JSON.parse(content);
      
      // Validierung der Kernstruktur für Journey und Presence
      if (Array.isArray(parsed.habits) && Array.isArray(parsed.records)) {
        onSuccess(parsed as HabitState);
      } else {
        throw new Error('Die Datei hat kein gültiges Echoes-Format.');
      }
    } catch (err) {
      onError(err instanceof Error ? err : new Error('Fehler beim Lesen der Datei.'));
    }
  };
  reader.readAsText(file);
}

/**
 * Importiert nur Habits und stellt sicher, dass sie IDs haben.
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
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        onSuccess(parsed as Habit[]);
      } else {
        throw new Error('Ungültige Habit-Struktur.');
      }
    } catch (err) {
      onError(err instanceof Error ? err : new Error('Fehler beim Importieren der Habits.'));
    }
  };
  reader.readAsText(file);
}