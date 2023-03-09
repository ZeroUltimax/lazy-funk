import { cmpNum } from "../funk/comparators";
import { asSorted } from "./sort";
import { sortedDistinct } from "./sortedDistinct";

describe("Sorted Distinct", () => {
  it("Gives distinct entries", () => {
    const numbers = asSorted([1, 1, 1, 2, 2, 3, 4, 4, 6, 9, 9], cmpNum);
    const expected = [1, 2, 3, 4, 6, 9];
    const actual = [...sortedDistinct(numbers)];
    expect(actual).toEqual(expected);
  });
  it("Intentionally ignores out of order elements", () => {
    const numbers = asSorted([3, 2, 1, 6, 5, 4, 9, 8, 7], cmpNum);
    const expected = [3, 6, 9];
    const actual = [...sortedDistinct(numbers)];
    expect(actual).toEqual(expected);
  });
});
