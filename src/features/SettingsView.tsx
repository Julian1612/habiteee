import React, { useRef } from 'react';
import { Download, Upload, Info, RotateCw, Database, List, X } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { exportData, exportHabits, importData, importHabits } from '../utils/exportUtils';

interface SettingsViewProps {
  onClose: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onClose }) => {
  const { state, setState } = useHabitStore();
  const userDataInputRef = useRef<HTMLInputElement>(null);
  const habitsInputRef = useRef<HTMLInputElement>(null);

  const handleRefresh = () => window.location.reload();

  const onImportUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importData(file, (data) => {
      setState(data);
      alert('Vollständiges Backup erfolgreich eingespielt.');
      onClose(); // Schließt die Settings automatisch nach erfolgreichem Import
    }, (err) => alert(err.message));
    e.target.value = '';
  };

  const onImportHabits = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importHabits(file, (habits) => {
      setState(prev => ({ ...prev, habits }));
      alert('Habit-Konfigurationen erfolgreich importiert.');
      onClose(); // Schließt die Settings automatisch nach erfolgreichem Import
    }, (err) => alert(err.message));
    e.target.value = '';
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-500">
      
      {/* Neuer Header im Design der restlichen App */}
      <header className="flex justify-between items-start mb-12 px-1">
        <div>
          <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase text-text-vivid">System</h1>
          <p className="text-text-dim text-[10px] uppercase tracking-widest mt-2 font-bold">Data Architecture</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className="p-2 text-text-dim hover:text-accent-primary active:scale-90 transition-all duration-300"
            title="App neu laden"
          >
            <RotateCw size={22} strokeWidth={1.5} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-text-dim hover:text-accent-primary active:scale-90 transition-all duration-300"
          >
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="space-y-10">
        <section>
          <h2 className="text-text-dim text-[10px] font-bold uppercase tracking-[0.25em] mb-4 ml-4">
            Volles Daten-Backup (Journey + Echoes)
          </h2>
          <div className="bg-base-card rounded-ios border border-border-thin overflow-hidden shadow-sm">
            <button 
              onClick={() => exportData(state)}
              className="w-full flex items-center gap-4 p-6 border-b border-border-thin active:bg-white/5 transition-colors"
            >
              <div className="bg-accent-primary/20 p-3 rounded-2xl text-accent-primary">
                <Database size={22} />
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-text-vivid font-bold text-sm">Export UserData JSON</span>
                <span className="text-[10px] text-text-dim uppercase tracking-tighter mt-0.5">Sichert alles inklusive Historie</span>
              </div>
              <Download size={18} className="text-text-dim/30" />
            </button>

            <button 
              onClick={() => userDataInputRef.current?.click()}
              className="w-full flex items-center gap-4 p-6 active:bg-white/5 transition-colors"
            >
              <div className="bg-accent-primary/20 p-3 rounded-2xl text-accent-primary">
                <Upload size={22} />
              </div>
              <span className="text-text-vivid font-bold text-sm flex-1 text-left">Import UserData JSON</span>
            </button>
            <input type="file" accept=".json" ref={userDataInputRef} className="hidden" onChange={onImportUserData} />
          </div>
        </section>

        <section>
          <h2 className="text-text-dim text-[10px] font-bold uppercase tracking-[0.25em] mb-4 ml-4">
            Struktur-Export (Nur Habits)
          </h2>
          <div className="bg-base-card rounded-ios border border-border-thin overflow-hidden shadow-sm">
            <button 
              onClick={() => exportHabits(state.habits)}
              className="w-full flex items-center gap-4 p-6 border-b border-border-thin active:bg-white/5 transition-colors"
            >
              <div className="bg-indigo-500/20 p-3 rounded-2xl text-indigo-400">
                <List size={22} />
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-text-vivid font-bold text-sm">Export Habits JSON</span>
                <span className="text-[10px] text-text-dim uppercase tracking-tighter mt-0.5">Sichert nur deine Habit-Ziele</span>
              </div>
              <Download size={18} className="text-text-dim/30" />
            </button>

            <button 
              onClick={() => habitsInputRef.current?.click()}
              className="w-full flex items-center gap-4 p-6 active:bg-white/5 transition-colors"
            >
              <div className="bg-indigo-500/20 p-3 rounded-2xl text-indigo-400">
                <Upload size={22} />
              </div>
              <span className="text-text-vivid font-bold text-sm flex-1 text-left">Import Habits JSON</span>
            </button>
            <input type="file" accept=".json" ref={habitsInputRef} className="hidden" onChange={onImportHabits} />
          </div>
        </section>

        <div className="bg-accent-soft border border-accent-primary/20 rounded-ios p-6 flex items-start gap-4">
          <Info size={24} className="text-accent-primary shrink-0" />
          <div className="flex flex-col">
            <span className="text-accent-primary text-xs font-bold uppercase tracking-widest mb-1.5">Daten-Integrität</span>
            <p className="text-text-vivid/80 text-[11px] leading-relaxed">
              Die <strong>UserData</strong> Datei ist dein heiliger Gral: Sie enthält die gesamte Architektur deiner Journey. Die <strong>Habits</strong> Datei dient lediglich als Vorlage für deine Echoes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};