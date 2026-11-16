import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { startOfMonth, addMonths } from 'date-fns';

export const IST_TIMEZONE = 'Asia/Kolkata';

export function getZonedNow(date: Date = new Date()): Date {
  return toZonedTime(date, IST_TIMEZONE);
}

/**
 * Returns canonical "YYYY-MM" string computed in Asia/Kolkata timezone.
 * Example: for Nov 16, 2026 -> "2026-11"
 */
export function getCurrentPeriodKey(date: Date = new Date()): string {
  return formatInTimeZone(date, IST_TIMEZONE, 'yyyy-MM');
}

/**
 * Computes exact start and end boundaries for a given period or current time in IST
 */
export function getMonthBoundaries(date: Date = new Date()) {
  const zoned = toZonedTime(date, IST_TIMEZONE);
  const currentMonthStart = startOfMonth(zoned);
  const nextMonthStart = startOfMonth(addMonths(zoned, 1));

  return {
    periodKey: formatInTimeZone(date, IST_TIMEZONE, 'yyyy-MM'),
    currentMonthStart,
    nextMonthStart,
    nextMonthIso: nextMonthStart.toISOString()
  };
}

/**
 * Normalizes an Indian phone number to canonical E.164 (+91XXXXXXXXXX)
 */
export function normalizeIndianPhoneNumber(input: string): string {
  if (!input) {
    throw new Error('Phone number is required');
  }

  // Remove spaces, dashes, parentheses
  let cleaned = input.replace(/[\s\-\(\)\.]/g, '');

  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  }

  // Valid Indian mobile numbers are 10 digits starting with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  if (!indianMobileRegex.test(cleaned)) {
    throw new Error('Invalid Indian mobile number. Please enter a valid 10-digit number.');
  }

  return `+91${cleaned}`;
}

/**
 * Masks phone number for display (+91 98*** **210)
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 13) return phone;
  // phone: +919876543210
  const country = phone.slice(0, 3);
  const start = phone.slice(3, 5);
  const end = phone.slice(10);
  return `${country} ${start}*** **${end}`;
}
