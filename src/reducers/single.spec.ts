import { single, singleOrDefault } from "./single";

describe("single", () => {
  it("Returns only element", () => {
    const numbers = [1];
    const actual = single(numbers);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Throws on empty", () => {
    const numbers: number[] = [];
    expect(() => single(numbers)).toThrow();
  });
  it("Throws on multiple", () => {
    const numbers: number[] = [1, 2];
    expect(() => single(numbers)).toThrow();
  });
});

describe("single or default", () => {
  it("Returns only element", () => {
    const numbers = [1];
    const seed = () => -1;
    const actual = singleOrDefault(numbers, seed);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Returns default on empty", () => {
    const numbers: number[] = [];
    const seed = () => -1;
    const actual = singleOrDefault(numbers, seed);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("Throws on multiple", () => {
    const numbers: number[] = [1, 2];
    expect(() => singleOrDefault(numbers)).toThrow();
  });
});
