import { prod, sum } from "./math";

describe("Math reducers", () => {
  const numbers = [3, 2, 5, 4, 1];
  it("Sums", () => {
    const actual = sum(numbers);
    const expected = 15;
    expect(actual).toEqual(expected);
  });
  it("Multiplies", () => {
    const actual = prod(numbers);
    const expected = 120;
    expect(actual).toEqual(expected);
  });
});
