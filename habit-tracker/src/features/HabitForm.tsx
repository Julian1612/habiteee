import React, { useState } from 'react';
import type { FrequencyType } from '../types';

interface HabitFormProps {
  onAdd: (data: { name: string; frequencyType: FrequencyType; targetCount: number }) => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [count, setCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd({ name: name.trim(), frequencyType: frequency, targetCount: count });
    setName('');
    setCount(1);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '16px', backgroundColor: '#1a1a1a', borderRadius: '12px', marginBottom: '24px' }}>
      <h3>Neuen Habit anlegen</h3>
      
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Name:</label>
        <input 
          value={name} onChange={(e) => setName(e.target.value)} 
          placeholder="z.B. Lesen, Sport..." required 
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Rhythmus:</label>
          <select 
            value={frequency} onChange={(e) => setFrequency(e.target.value as FrequencyType)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #444' }}
          >
            <option value="daily">Täglich</option>
            <option value="weekly">Wöchentlich</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Häufigkeit:</label>
          <input 
            type="number" min="1" value={count} onChange={(e) => setCount(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #444' }}
          />
        </div>
      </div>

      <button type="submit" style={{ width: '100%', backgroundColor: '#646cff', color: 'white', padding: '10px' }}>
        Habit hinzufügen
      </button>
    </form>
  );
};