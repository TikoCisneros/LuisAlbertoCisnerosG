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
export function formatDate(date: Date | string): string {
  if (!date) return '';
  if (typeof date === 'string') {
    return date.includes('T') ? date.split('T')[0] : date;
  }
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  return '';
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

/**
 * Returns a YYYY-MM-DD string representing today
 */
export function getTodayString(): string {
  const today = getTodayMidnight();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Simply check whether a date is today or later.
 */
export function isTodayOrFuture(dateValue: string): boolean {
  if (!dateValue) return false;
  return dateValue >= getTodayString();
}

/**
 * Takes a date string (YYYY-MM-DD), adds exactly one year to it, and returns the result in the same format.
 */
export function addOneYear(dateString: string): string {
  if (!dateString) return '';

  const date = new Date(`${dateString}T00:00:00`);
  if (isNaN(date.getTime())) return '';

  date.setFullYear(date.getFullYear() + 1);
  return toInputDateFormat(date);
}
