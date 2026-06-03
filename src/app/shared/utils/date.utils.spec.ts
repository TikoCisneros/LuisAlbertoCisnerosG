import { parseDate, formatDate } from './date.utils';

describe('DateUtils', () => {
  describe('parseDate', () => {
    beforeEach(() => {
      vi.useRealTimers();
      vi.setSystemTime(new Date(2026, 1, 20, 0, 0)); // 20 de enero del 2026
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return the correct Date object parsed from an ISO date string', () => {
      const parsed = parseDate('2026-01-15T00:00:00.000Z');
      expect(parsed.toISOString()).toContain('2026-01-15');
    });
  });

  describe('formatDate', () => {
    it('should correctly format a Date object into a YYYY-MM-DD string', () => {
      const date = new Date(2026, 0, 15); // 15 de enero de 2026
      expect(formatDate(date)).toBe('2026-01-15');
    });
  });
});
