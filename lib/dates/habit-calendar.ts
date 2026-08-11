/**
 * Calendar utilities for habit tracking.
 *
 * Period: civil year (Jan 1 – Dec 31), with 365 or 366 days for leap years.
 * "Today" is computed in the user's profile timezone.
 * Future dates within the selected year are disabled (not clickable).
 */

import {
  addDays,
  format,
  getDaysInYear,
  isValid,
  parseISO,
  startOfYear,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function getDaysInYearCount(year: number): number {
  return getDaysInYear(new Date(year, 0, 1));
}

export function getYearDates(year: number): string[] {
  const start = startOfYear(new Date(year, 0, 1));
  const totalDays = getDaysInYearCount(year);
  const dates: string[] = [];

  for (let i = 0; i < totalDays; i++) {
    dates.push(format(addDays(start, i), "yyyy-MM-dd"));
  }

  return dates;
}

export function isValidCalendarDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const parsed = parseISO(dateStr);
  return isValid(parsed) && format(parsed, "yyyy-MM-dd") === dateStr;
}

export function isDateInYear(dateStr: string, year: number): boolean {
  if (!isValidCalendarDate(dateStr)) return false;
  return parseISO(dateStr).getFullYear() === year;
}

export function getTodayInTimezone(timezone: string): string {
  try {
    const now = toZonedTime(new Date(), timezone);
    return format(now, "yyyy-MM-dd");
  } catch {
    return format(new Date(), "yyyy-MM-dd");
  }
}

export function isFutureDate(dateStr: string, timezone: string): boolean {
  const today = getTodayInTimezone(timezone);
  return dateStr > today;
}

export function formatDisplayDate(dateStr: string, locale = "fr-FR"): string {
  const date = parseISO(dateStr);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getMonthLabels(year: number): { month: number; label: string; startIndex: number }[] {
  const dates = getYearDates(year);
  const labels: { month: number; label: string; startIndex: number }[] = [];
  let lastMonth = -1;

  dates.forEach((dateStr, index) => {
    const month = parseISO(dateStr).getMonth();
    if (month !== lastMonth) {
      labels.push({
        month,
        label: new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(parseISO(dateStr)),
        startIndex: index,
      });
      lastMonth = month;
    }
  });

  return labels;
}

export function computeHabitStats(
  dates: string[],
  entries: Record<string, "positive" | "negative">,
  timezone: string
) {
  const today = getTodayInTimezone(timezone);
  const eligibleDates = dates.filter((d) => d <= today);

  let positiveCount = 0;
  let negativeCount = 0;

  eligibleDates.forEach((date) => {
    const status = entries[date];
    if (status === "positive") positiveCount++;
    else if (status === "negative") negativeCount++;
  });

  const blankCount = eligibleDates.length - positiveCount - negativeCount;
  const positiveRate =
    eligibleDates.length > 0
      ? Math.round((positiveCount / eligibleDates.length) * 100)
      : 0;

  return { positiveCount, negativeCount, blankCount, positiveRate };
}

export function isLeapYear(year: number): boolean {
  return getDaysInYearCount(year) === 366;
}
