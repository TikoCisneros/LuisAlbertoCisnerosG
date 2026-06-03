/**
 * Convert a date string to a date object
 * @param date
 * @returns Date
 */
export function parseDate(date: string): Date {
  return new Date(Date.parse(date));
}

/**
 * Convert a date to YYYY-MM-DD format
 * @param date
 * @returns YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Convert a date to a string in the YYYY-MM-DD format for “date” type controls
 * @param date
 * @returns Date
 */
export function toInputDateFormat(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a Date object representing today at 12:00:00 AM
 */
export function getTodayMidnight(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
