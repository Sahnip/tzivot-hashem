import { describe, expect, it } from "vitest";
import { habitNameSchema } from "@/lib/validations/habits";

describe("habitNameSchema", () => {
  it("accepts valid names", () => {
    expect(habitNameSchema.safeParse("Lire 20 minutes").success).toBe(true);
  });

  it("rejects empty names", () => {
    const result = habitNameSchema.safeParse("   ");
    expect(result.success).toBe(false);
  });

  it("rejects names over 100 characters", () => {
    const result = habitNameSchema.safeParse("a".repeat(101));
    expect(result.success).toBe(false);
  });

  it("trims whitespace", () => {
    const result = habitNameSchema.safeParse("  Méditer  ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("Méditer");
    }
  });
});
