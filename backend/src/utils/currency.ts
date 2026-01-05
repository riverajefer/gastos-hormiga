/**
 * Currency utilities for Colombian Peso (COP)
 */

// Convert display amount (e.g., 3500) to cents for storage
export function toCents(amount: number): number {
  return Math.round(amount);
}

// Convert cents to display amount
export function fromCents(cents: number): number {
  return cents;
}

// Format amount for display (e.g., $3.500)
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
