import { parseDate, formatDate } from './date.utils';

describe('Pruebas de  DateUtils', () => {
  describe('parseDate tests', () => {
    beforeEach(() => {
      vi.useRealTimers();
      vi.setSystemTime(new Date(2026, 1, 20, 0, 0)); // 20 de enero del 2026
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('debe retornar el string de fecha correctamente', () => {
      const parsed = parseDate('2026-01-15T00:00:00.000Z');
      expect(parsed.toISOString()).toContain('2026-01-15');
    });
  });

  describe('formatDate tests', () => {
    it('debe formatear el objeto fecha a string YYYY-MM-DD correctamente', () => {
      const date = new Date(2026, 0, 15); // 15 de enero de 2026
      expect(formatDate(date)).toBe('2026-01-15');
    });
  });
});
