import React from 'react';
import { useHabitStore } from './store/useHabitStore';
import { HabitForm } from './features/HabitForm';
import { HabitCard } from './components/HabitCard.tsx';
import { Settings } from './features/Settings';
import './App.css'; // Behält das generelle Vite-Styling bei

function App() {
  const { state, addHabit, toggleRecord } = useHabitStore();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Habit Tracker</h1>
      
      <HabitForm onAdd={addHabit} />
      
      <div style={{ marginBottom: '32px' }}>
        <h2>Meine Habits</h2>
        {state.habits.length === 0 ? (
          <p style={{ color: '#888' }}>Noch keine Habits angelegt. Starte jetzt!</p>
        ) : (
          state.habits.map(habit => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              // Filtern der Records für das spezifische Habit
              records={state.records
                .filter(r => r.habitId === habit.id)
                .map(r => r.timestamp)} 
              onToggle={toggleRecord} 
            />
          ))
        )}
      </div>

      <Settings />
    </div>
  );
}

export default App;