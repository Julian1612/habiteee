import { useState, useEffect } from 'react'
import { BottomNav, type TabType } from './components/BottomNav';
import { TodayView } from './features/TodayView';
import { HabitsView } from './features/HabitsView';
import { JourneyView } from './features/JourneyView';
import { getStartOfDay } from './utils/dateUtils';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('presence');
  const [isVaultMode, setIsVaultMode] = useState(false);
  
  // State für den "heutigen" Tag, um bei Datumswechsel einen globalen Re-Render zu erzwingen
  const [todayTimestamp, setTodayTimestamp] = useState(getStartOfDay(Date.now()));

  // 1. Überprüfung auf Backup-Schnittstelle beim Start
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('vault') === 'access') {
      setIsVaultMode(true);
    }
  }, []);

  // 2. Automatischer Reset um 00:00 Uhr und beim App-Wakeup
  useEffect(() => {
    let midnightTimeout: ReturnType<typeof setTimeout>;

    const scheduleMidnightReset = () => {
      const now = Date.now();
      const nextMidnight = new Date();
      nextMidnight.setHours(24, 0, 0, 1); // Kurz nach Mitternacht
      
      const msUntilMidnight = nextMidnight.getTime() - now;

      midnightTimeout = setTimeout(() => {
        const newToday = getStartOfDay(Date.now());
        setTodayTimestamp(newToday);
        console.log("Midnight Reset: New day started", new Date(newToday).toLocaleDateString());
        scheduleMidnightReset(); // Nächsten Reset planen
      }, msUntilMidnight);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentToday = getStartOfDay(Date.now());
        if (currentToday !== todayTimestamp) {
          setTodayTimestamp(currentToday);
          console.log("Wakeup Reset: New day detected");
        }
      }
    };

    scheduleMidnightReset();
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      clearTimeout(midnightTimeout);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [todayTimestamp]);

  // 3. Backup-Ansicht für Apple Shortcuts (Minimal-Output)
  if (isVaultMode) {
    const rawData = localStorage.getItem('habit-data') || '{"habits":[], "records":[]}';
    return (
      <div id="backup-vault" className="bg-black text-green-500 p-4 font-mono break-all text-xs">
        {rawData}
      </div>
    );
  }

  // 4. Standard-App-Logik
  const renderContent = () => {
    // Durch das Übergeben von todayTimestamp als Key erzwingen wir ein sauberes "Reset" der Komponenten
    switch (activeTab) {
      case 'presence': return <TodayView key={todayTimestamp} />;
      case 'echoes': return <HabitsView />;
      case 'journey': return <JourneyView />;
      default: return <TodayView key={todayTimestamp} />;
    }
  };

  return (
    /* Native Shell: Bleibt für iOS optimiert */
    <div className="h-full w-full bg-base-bg text-text-vivid flex flex-col overflow-hidden fixed inset-0">
      
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="max-w-md mx-auto px-6 pt-4">
          {renderContent()}
        </div>
        
        {/* Sicherheits-Abstand für Navigation */}
        <div className="h-[160px] w-full shrink-0" />
      </main>

      {/* Navigation: Immer fixiert */}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;