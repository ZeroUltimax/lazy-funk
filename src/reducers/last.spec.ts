import { last, lastOrDefault } from "./last";

describe("last", () => {
  it("Returns last element", () => {
    const numbers = [1, 2, 3];
    const actual = last(numbers);
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it("Throws on empty", () => {
    const numbers: number[] = [];
    expect(() => last(numbers)).toThrow();
  });
});

describe("last or default", () => {
  it("Returns last element", () => {
    const numbers = [1, 2, 3];
    const seed = () => -1;
    const actual = lastOrDefault(numbers, seed);
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it("Returns default on empty", () => {
    const numbers: number[] = [];
    const seed = () => -1;
    const actual = lastOrDefault(numbers, seed);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
});
