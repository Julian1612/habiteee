import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Hilfsfunktion zum sicheren Abrufen der Daten aus dem Speicher
  const readValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);
  
  // Ref, um den aktuellen Wert für den Effect-Cleanup oder Events ohne Re-Renders zu haben
  const valueRef = useRef<T>(storedValue);
  useEffect(() => {
    valueRef.current = storedValue;
  }, [storedValue]);

  // Verbessertes Setzen des Werts mit Event-Dispatching
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const newValue = value instanceof Function ? value(valueRef.current) : value;
      
      // 1. In localStorage speichern
      window.localStorage.setItem(key, JSON.stringify(newValue));
      
      // 2. Lokalen State aktualisieren
      setStoredValue(newValue);
      
      // 3. Ein Custom-Event auslösen, damit andere Instanzen im selben Tab reagieren
      window.dispatchEvent(new CustomEvent('local-storage-sync', { detail: { key, newValue } }));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      // Reagiere nur auf Änderungen, die unseren Key betreffen
      if (e instanceof StorageEvent) {
        if (e.key === key) {
          setStoredValue(readValue());
        }
      } else if (e instanceof CustomEvent) {
        if (e.detail.key === key) {
          setStoredValue(e.detail.newValue);
        }
      }
    };

    // 'storage' feuert bei Änderungen in ANDEREN Tabs
    window.addEventListener('storage', handleStorageChange);
    // 'local-storage-sync' feuert bei Änderungen im AKTUELLEN Tab
    window.addEventListener('local-storage-sync', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-sync', handleStorageChange as EventListener);
    };
  }, [key, readValue]);

  return [storedValue, setValue] as const;
}