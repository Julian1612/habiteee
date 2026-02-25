export function getStartOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Berechnet den Startzeitpunkt für verschiedene Intervalle.
 * @param frequency 'daily', 'weekly' oder 'period'
 * @param startDay Der Wochentag (0=So, 1=Mo, ...) an dem der Zeitraum startet
 */
export function getStartOfPeriod(frequency: string, startDay: number = 1): number {
  const now = new Date();
  const todayTimestamp = getStartOfDay(now.getTime());
  
  if (frequency === 'daily') {
    return todayTimestamp;
  }
  
  // Logik für "Wöchentlich" oder "Flexible Zeiträume" (z.B. Mittwoch bis Mittwoch)
  const currentDay = now.getDay(); // 0 (So) bis 6 (Sa)
  // Berechne, wie viele Tage wir zurückgehen müssen, um zum letzten 'startDay' zu kommen
  const daysToSubtract = (currentDay - startDay + 7) % 7;
  
  const startDate = new Date(todayTimestamp);
  startDate.setDate(startDate.getDate() - daysToSubtract);
  
  return startDate.getTime();
}

export function getLastNDays(n: number): number[] {
  const days: number[] = [];
  const today = getStartOfDay(Date.now());
  
  for (let i = n - 1; i >= 0; i--) {
    days.push(today - i * 24 * 60 * 60 * 1000);
  }
  
  return days;
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(timestamp));
}