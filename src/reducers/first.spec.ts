import { first, firstOrDefault } from "./first";

describe("first", () => {
  it("Returns fist element", () => {
    const numbers = [1, 2, 3];
    const actual = first(numbers);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Throws on empty", () => {
    const numbers: number[] = [];
    expect(() => first(numbers)).toThrow();
  });
});

describe("first or default", () => {
  it("Returns fist element", () => {
    const numbers = [1, 2, 3];
    const seed = () => -1;
    const actual = firstOrDefault(numbers, seed);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Returns default on empty", () => {
    const numbers: number[] = [];
    const seed = () => -1;
    const actual = firstOrDefault(numbers, seed);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
});
