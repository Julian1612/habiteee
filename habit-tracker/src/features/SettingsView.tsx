import React, { useRef } from 'react';
import { Download, Upload, Info } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { exportData, importData } from '../utils/exportUtils';

export const SettingsView: React.FC = () => {
  const { state, setState } = useHabitStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importData(
      file,
      (parsedData) => {
        setState(parsedData);
        alert('Daten erfolgreich importiert!');
      },
      (error) => alert(`Fehler beim Import: ${error.message}`)
    );
    e.target.value = ''; 
  };

  return (
    <div className="pt-8 animate-in fade-in duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-apple-text">Optionen</h1>
      </header>

      <div className="mb-8">
        <h2 className="text-apple-textMuted text-xs font-semibold uppercase tracking-wider mb-2 ml-4">
          Daten & Backup
        </h2>
        <div className="bg-apple-card rounded-ios border border-apple-border overflow-hidden">
          <button 
            onClick={() => exportData(state)}
            className="w-full flex items-center gap-3 p-4 border-b border-apple-border active:bg-white/5 transition-colors"
          >
            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-500">
              <Download size={20} />
            </div>
            <span className="text-apple-text font-medium flex-1 text-left">Backup exportieren (.json)</span>
          </button>

          <button 
            onClick={handleImportClick}
            className="w-full flex items-center gap-3 p-4 active:bg-white/5 transition-colors"
          >
            <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500">
              <Upload size={20} />
            </div>
            <span className="text-apple-text font-medium flex-1 text-left">Backup importieren</span>
          </button>
          <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <div>
        <h2 className="text-apple-textMuted text-xs font-semibold uppercase tracking-wider mb-2 ml-4">
          Info
        </h2>
        <div className="bg-apple-card rounded-ios border border-apple-border overflow-hidden p-4 flex items-center gap-3">
          <div className="bg-gray-500/20 p-2 rounded-lg text-gray-400">
            <Info size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-apple-text font-medium">Habit Tracker App</span>
            <span className="text-apple-textMuted text-xs">Lokale WebApp (GitHub Pages)</span>
          </div>
        </div>
      </div>
    </div>
  );
};