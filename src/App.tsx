import { useState } from 'react'
import { BottomNav, type TabType } from './components/BottomNav';
import { TodayView } from './features/TodayView';
import { HabitsView } from './features/HabitsView';
import { JourneyView } from './features/JourneyView';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('presence');

  // Zentraler Content-Renderer: Behält alle Features bei
  const renderContent = () => {
    switch (activeTab) {
      case 'presence': return <TodayView />;
      case 'echoes': return <HabitsView />;
      case 'journey': return <JourneyView />;
      default: return <TodayView />;
    }
  };

  return (
    /* Native Shell: flex flex-col h-full overflow-hidden 
       fixiert die App im Viewport des iPhones.
    */
    <div className="h-full w-full bg-base-bg text-text-vivid flex flex-col overflow-hidden fixed inset-0">
      
      {/* Scroll-Container: Hier scrollt nur der Inhalt. 
         Die no-scrollbar Klasse sorgt für den cleanen Look.
      */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="max-w-md mx-auto px-6 pt-4">
          {renderContent()}
        </div>
        
        {/* Sicherheits-Abstand: Verhindert, dass das unterste Element 
           hinter der massiven 110px Navbar klebt.
        */}
        <div className="h-[160px] w-full shrink-0" />
      </main>

      {/* Feste Navigation: Immer an derselben Stelle, unabhängig vom Scrollen */}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;