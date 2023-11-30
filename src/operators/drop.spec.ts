import { drop, dropWhile } from "./drop";

describe("Drop", () => {
  it("Drops none", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const count = 0;
    const expected = inputs;
    const actual = [...drop(count)(inputs)];
    expect(actual).toStrictEqual(expected);
  });
  it("Drops only some", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const count = 3;
    const expected = [3, 4, 5];
    const actual = [...drop(count)(inputs)];
    expect(actual).toStrictEqual(expected);
  });
  it("Drops more than available", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const count = 999;
    const expected: number[] = [];
    const actual = [...drop(count)(inputs)];
    expect(actual).toStrictEqual(expected);
  });
});

describe("Drop While", () => {
  it("Drops none", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const pred = (n: number) => n < 0;
    const expected = inputs;
    const actual = [...dropWhile(pred)(inputs)];
    expect(actual).toStrictEqual(expected);
  });
  it("Drops only some", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const pred = (n: number) => n < 3;
    const expected = [3, 4, 5];
    const actual = [...dropWhile(pred)(inputs)];
    expect(actual).toStrictEqual(expected);
  });
  it("Drops everything", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const pred = (n: number) => n < 999;
    const expected: number[] = [];
    const actual = [...dropWhile(pred)(inputs)];
    expect(actual).toStrictEqual(expected);
  });
});
