import type { HabitState } from '../types';

export function exportData(data: HabitState): void {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `habit-backup-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importData(
  file: File, 
  onSuccess: (data: HabitState) => void, 
  onError: (err: Error) => void
): void {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsed = JSON.parse(content) as HabitState;
      
      if (parsed.habits && Array.isArray(parsed.records)) {
        onSuccess(parsed);
      } else {
        throw new Error('Ungültige Datenstruktur in der JSON-Datei.');
      }
    } catch (err) {
      onError(err instanceof Error ? err : new Error('Fehler beim Parsen'));
    }
  };
  
  reader.readAsText(file);
}