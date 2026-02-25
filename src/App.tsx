import React, { useState } from 'react';
import { BottomNav, type TabType } from './components/BottomNav';
import { TodayView } from './features/TodayView'; // Rename internal labels to "Presence"
import { HabitsView } from './features/HabitsView'; // Rename internal labels to "Echoes"
import { JourneyView } from './features/JourneyView';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('presence');

  const renderContent = () => {
    switch (activeTab) {
      case 'presence': return <TodayView />;
      case 'echoes': return <HabitsView />;
      case 'journey': return <JourneyView />;
      default: return <TodayView />;
    }
  };

  return (
    <div className="min-h-screen bg-base-bg text-text-vivid pb-24">
      <main className="max-w-md mx-auto p-8 font-light">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;