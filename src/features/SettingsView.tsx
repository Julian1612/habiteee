import React, { useRef } from 'react';
import { Download, Upload, Info, RotateCw, Database, List } from 'lucide-react';
import { useHabitStore } from '../store/useHabitStore';
import { exportData, exportHabits, importData, importHabits } from '../utils/exportUtils';

export const SettingsView: React.FC = () => {
  const { state, setState } = useHabitStore();
  const userDataInputRef = useRef<HTMLInputElement>(null);
  const habitsInputRef = useRef<HTMLInputElement>(null);

  // Lädt die Webseite neu, um den State frisch zu initialisieren
  const handleRefresh = () => window.location.reload();

  const onImportUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importData(file, (data) => {
      setState(data);
      alert('Vollständiges Backup erfolgreich eingespielt.');
    }, (err) => alert(err.message));
    e.target.value = '';
  };

  const onImportHabits = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importHabits(file, (habits) => {
      // Fügt nur die Habits zum bestehenden State hinzu oder ersetzt diese
      setState(prev => ({ ...prev, habits }));
      alert('Habit-Konfigurationen erfolgreich importiert.');
    }, (err) => alert(err.message));
    e.target.value = '';
  };

  return (
    <div className="pt-4 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-10 px-1">
        <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase text-text-vivid">Optionen</h1>
        <button 
          onClick={handleRefresh}
          className="p-4 bg-base-card border border-border-thin rounded-full text-text-dim active:text-accent-primary active:scale-90 transition-all shadow-lg"
          title="App neu laden"
        >
          <RotateCw size={22} />
        </button>
      </header>

      <div className="space-y-10">
        {/* Sektion: Gesamte Nutzerdaten (Habits + Journey-Historie) */}
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

        {/* Sektion: Nur Habit-Konfigurationen */}
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

        {/* Info-Bereich mit hohem Kontrast */}
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