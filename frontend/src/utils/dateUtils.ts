import { format, isToday, isYesterday, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(d)) return 'Hoy';
  if (isYesterday(d)) return 'Ayer';
  
  return format(d, "d 'de' MMMM", { locale: es });
}

/**
 * Format date with year
 */
export function formatDateFull(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, "d 'de' MMMM 'de' yyyy", { locale: es });
}

/**
 * Format date for input
 */
export function formatDateInput(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
}

/**
 * Format month name
 */
export function formatMonth(month: number, year: number): string {
  const date = new Date(year, month - 1, 1);
  return format(date, "MMMM 'de' yyyy", { locale: es });
}

/**
 * Format short month name
 */
export function formatMonthShort(month: number): string {
  const date = new Date(2024, month - 1, 1);
  return format(date, 'MMM', { locale: es });
}

/**
 * Get day of week name
 */
export function formatWeekday(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEEE', { locale: es });
}

/**
 * Get start and end of month
 */
export function getMonthRange(year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

/**
 * Get previous month
 */
export function getPreviousMonth(year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  const prev = subMonths(date, 1);
  return {
    year: prev.getFullYear(),
    month: prev.getMonth() + 1,
  };
}

/**
 * Check if date is in the future
 */
export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
}

/**
 * Get relative time string
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Hoy';
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
  return formatDate(d);
}
