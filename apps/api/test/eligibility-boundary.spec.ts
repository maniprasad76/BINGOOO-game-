import {
  getCurrentPeriodKey,
  getMonthBoundaries,
  normalizeIndianPhoneNumber,
  maskPhoneNumber
} from '../src/common/date-utils';

describe('Eligibility & Date Boundary Tests', () => {
  it('should compute exact periodKey in Asia/Kolkata timezone', () => {
    // 2026-11-16T18:00:00Z is 2026-11-16 23:30 IST -> "2026-11"
    const testDate = new Date('2026-11-16T18:00:00.000Z');
    expect(getCurrentPeriodKey(testDate)).toBe('2026-11');
  });

  it('should handle month-end boundary: Dec 31 18:30:00 UTC = Jan 1 00:00:00 IST', () => {
    // 18:29:59 UTC -> Dec 31 23:59:59 IST -> period "2026-12"
    const justBeforeMidnight = new Date('2026-12-31T18:29:59.000Z');
    expect(getCurrentPeriodKey(justBeforeMidnight)).toBe('2026-12');

    // 18:30:00 UTC -> Jan 1 00:00:00 IST -> period "2027-01"
    const exactlyMidnight = new Date('2026-12-31T18:30:00.000Z');
    expect(getCurrentPeriodKey(exactlyMidnight)).toBe('2027-01');
  });

  it('should handle leap year boundaries: Feb 28 vs Feb 29 in 2028', () => {
    const leapDate = new Date('2028-02-29T10:00:00.000Z');
    expect(getCurrentPeriodKey(leapDate)).toBe('2028-02');
  });

  it('should normalize Indian phone numbers to canonical E.164', () => {
    expect(normalizeIndianPhoneNumber('9876543210')).toBe('+919876543210');
    expect(normalizeIndianPhoneNumber('09876543210')).toBe('+919876543210');
    expect(normalizeIndianPhoneNumber('+91 98765 43210')).toBe('+919876543210');
    expect(normalizeIndianPhoneNumber('+91-98765-43210')).toBe('+919876543210');
    expect(normalizeIndianPhoneNumber('919876543210')).toBe('+919876543210');
  });

  it('should reject invalid mobile numbers', () => {
    expect(() => normalizeIndianPhoneNumber('12345')).toThrow();
    expect(() => normalizeIndianPhoneNumber('5876543210')).toThrow(); // Starts with 5 (invalid Indian mobile)
    expect(() => normalizeIndianPhoneNumber('abcdefghij')).toThrow();
  });

  it('should mask phone number correctly for customer privacy', () => {
    expect(maskPhoneNumber('+919876543210')).toBe('+91 98*** **210');
  });
});
