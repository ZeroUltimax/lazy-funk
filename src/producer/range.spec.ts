import { take } from "../operators/take";
import { iota, range } from "./range";

describe("Range", () => {
  it("Generates by steps", () => {
    const actual = [...range(0, 10, 2)];
    const expected = [0, 2, 4, 6, 8];
    expect(actual).toEqual(expected);
  });
  it("Is Empty if end LT start", () => {
    const actual = [...range(10, 0)];
    const expected: number[] = [];
    expect(actual).toEqual(expected);
  });
});

describe("iota", () => {
  it("Generates infinite numbers", () => {
    const actual = [...take(10)(iota())];
    const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(actual).toEqual(expected);
  });
});
