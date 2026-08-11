import { describe, expect, it } from "vitest";
import { getNextStatus } from "@/types/habit";

describe("getNextStatus", () => {
  it("cycles null → positive → negative → null", () => {
    expect(getNextStatus(null)).toBe("positive");
    expect(getNextStatus("positive")).toBe("negative");
    expect(getNextStatus("negative")).toBe(null);
  });
});
