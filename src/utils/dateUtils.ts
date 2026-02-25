// src/utils/dateUtils.ts

export function getStartOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
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
  return new Intl.DateTimeFormat('de-DE', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(timestamp));
}