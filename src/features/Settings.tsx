import React, { useRef } from 'react';
import { useHabitStore } from '../store/useHabitStore';
import { exportData, importData } from '../utils/exportUtils';

export const Settings: React.FC = () => {
  const { state, setState } = useHabitStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportData(state);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importData(
      file,
      (parsedData) => {
        setState(parsedData);
        alert('Daten erfolgreich importiert!');
      },
      (error) => {
        alert(`Fehler beim Import: ${error.message}`);
      }
    );
    e.target.value = ''; // Input zurücksetzen
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#1a1a1a', borderRadius: '12px', marginTop: '24px' }}>
      <h3>Einstellungen & Backup</h3>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>
        Sichere deine Fortschritte lokal oder stelle ein Backup wieder her.
      </p>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={handleExport} style={{ flex: 1, backgroundColor: '#333', color: '#fff' }}>
          Exportieren (.json)
        </button>
        
        <button onClick={handleImportClick} style={{ flex: 1, backgroundColor: '#333', color: '#fff' }}>
          Importieren
        </button>
        <input 
          type="file" 
          accept=".json" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
      </div>
    </div>
  );
};