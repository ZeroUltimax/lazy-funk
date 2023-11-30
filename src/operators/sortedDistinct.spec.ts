import { cmpNum } from "../funk/comparators";
import { asSorted } from "./sort";
import { sortedDistinct } from "./sortedDistinct";

const asCmpNumSorted = asSorted(cmpNum);

describe("Sorted Distinct", () => {
  it("Gives distinct entries", () => {
    const numbers = asCmpNumSorted([1, 1, 1, 2, 2, 3, 4, 4, 6, 9, 9]);
    const expected = [1, 2, 3, 4, 6, 9];
    const actual = [...sortedDistinct(numbers)];
    expect(actual).toEqual(expected);
  });
  it("Intentionally ignores out of order elements", () => {
    const numbers = asCmpNumSorted([3, 2, 1, 6, 5, 4, 9, 8, 7]);
    const expected = [3, 6, 9];
    const actual = [...sortedDistinct(numbers)];
    expect(actual).toEqual(expected);
  });
});
