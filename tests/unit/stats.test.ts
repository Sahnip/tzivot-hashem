import { describe, expect, it } from "vitest";
import { computeHabitStats, getYearDates } from "@/lib/dates/habit-calendar";

describe("computeHabitStats", () => {
  it("calculates positive rate and counts", () => {
    const dates = getYearDates(2026).slice(0, 10);
    const entries = {
      [dates[0]]: "positive" as const,
      [dates[1]]: "positive" as const,
      [dates[2]]: "negative" as const,
    };

    const stats = computeHabitStats(dates, entries, "UTC");

    expect(stats.positiveCount).toBe(2);
    expect(stats.negativeCount).toBe(1);
    expect(stats.blankCount).toBe(7);
    expect(stats.positiveRate).toBe(20);
  });
});

describe("getYearDates", () => {
  it("returns correct number of days for leap year", () => {
    expect(getYearDates(2024)).toHaveLength(366);
  });

  it("returns correct number of days for regular year", () => {
    expect(getYearDates(2025)).toHaveLength(365);
  });
});
