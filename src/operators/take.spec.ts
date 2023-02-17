import { take, takeWhile } from "./take";

describe("Take", () => {
  it("Takes none", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const count = 0;
    const expected: number[] = [];
    const actual = [...take(inputs, count)];
    expect(actual).toStrictEqual(expected);
  });
  it("Takes only some", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const count = 3;
    const expected = [0, 1, 2];
    const actual = [...take(inputs, count)];
    expect(actual).toStrictEqual(expected);
  });
  it("Takes more than available", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const count = 999;
    const expected = inputs;
    const actual = [...take(inputs, count)];
    expect(actual).toStrictEqual(expected);
  });
});

describe("Take While", () => {
  it("Takes none", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const pred = (n: number) => n < 0;
    const expected: number[] = [];
    const actual = [...takeWhile(inputs, pred)];
    expect(actual).toStrictEqual(expected);
  });
  it("Takes only some", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const pred = (n: number) => n < 3;
    const expected = [0, 1, 2];
    const actual = [...takeWhile(inputs, pred)];
    expect(actual).toStrictEqual(expected);
  });
  it("Takes more than available", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const pred = (n: number) => n < 999;
    const expected = inputs;
    const actual = [...takeWhile(inputs, pred)];
    expect(actual).toStrictEqual(expected);
  });
});
