/**
 * Format number as Colombian Peso (COP)
 */
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with thousands separator only
 */
export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('es-CO').format(amount);
}

/**
 * Parse formatted currency string to number
 */
export function parseCurrency(value: string): number {
  // Remove currency symbol, dots, and other formatting
  const cleaned = value.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

/**
 * Format input value as currency while typing
 */
export function formatInputCurrency(value: string): string {
  const number = parseCurrency(value);
  if (number === 0) return '';
  return formatNumber(number);
}
