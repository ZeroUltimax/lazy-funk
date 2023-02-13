import { take } from "./take";

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
