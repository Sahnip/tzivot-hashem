import { describe, expect, it } from "vitest";
import {
  getDaysInYearCount,
  isDateInYear,
  isLeapYear,
  isValidCalendarDate,
} from "@/lib/dates/habit-calendar";

describe("date validation", () => {
  it("validates correct ISO dates", () => {
    expect(isValidCalendarDate("2026-03-12")).toBe(true);
  });

  it("rejects invalid dates", () => {
    expect(isValidCalendarDate("2026-02-30")).toBe(false);
    expect(isValidCalendarDate("invalid")).toBe(false);
  });

  it("checks date belongs to year", () => {
    expect(isDateInYear("2026-01-01", 2026)).toBe(true);
    expect(isDateInYear("2025-12-31", 2026)).toBe(false);
  });
});

describe("year length", () => {
  it("returns 365 for non-leap years", () => {
    expect(getDaysInYearCount(2025)).toBe(365);
  });

  it("returns 366 for leap years", () => {
    expect(getDaysInYearCount(2024)).toBe(366);
    expect(isLeapYear(2024)).toBe(true);
  });
});
