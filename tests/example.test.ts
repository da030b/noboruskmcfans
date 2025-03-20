// tests/example.test.ts
import { describe, it, expect } from "vitest";

function sum(a: number, b: number): number {
  return a + b;
}

describe("sum 関数のテスト", () => {
  it("2 と 3 の合計は 5 になる", () => {
    expect(sum(2, 3)).toBe(5);
  });

  it("負の数も正しく計算できる", () => {
    expect(sum(-1, -1)).toBe(-2);
  });
});
