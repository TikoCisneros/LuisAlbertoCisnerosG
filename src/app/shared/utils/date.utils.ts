/**
 * Convierte un string de fecha a un objeto fecha
 * @param date
 * @returns objeto de fecha
 */
export function parseDate(date: string): Date {
  return new Date(Date.parse(date));
}

/**
 * Convierte una fecha a formato YYYY-MM-DD
 * @param date
 * @returns YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
