import { cmpNum } from "../funk/comparators";
import { asSorted } from "../operators/sort";
import {
  sortedDifference,
  sortedIntersection,
  sortedSetOperations,
  sortedUnion,
} from "./sortedSet";

const asCmpNumSorted = asSorted(cmpNum);

describe("Sorted Set", () => {
  const a = asCmpNumSorted([10, 9, 20, 19, 30, 29, 40, 39]);
  const b = asCmpNumSorted([20, 19, 30, 29, 40, 39, 50, 49]);
  const expectedADiffB = [10];
  const expectedIntersect = [20, 30, 40];
  const expectedBDiffA = [50];
  const expectedUnion = [10, 20, 30, 40, 50];
  it("Union", () => {
    const actual = [...sortedUnion(b)(a)];
    expect(actual).toEqual(expectedUnion);
  });
  it("Difference", () => {
    const actual = [...sortedDifference(b)(a)];
    expect(actual).toEqual(expectedADiffB);
  });
  it("Inverse Difference", () => {
    const actual = [...sortedDifference(a)(b)];
    expect(actual).toEqual(expectedBDiffA);
  });
  it("Intersect", () => {
    const actual = [...sortedIntersection(b)(a)];
    expect(actual).toEqual(expectedIntersect);
  });
  it("Set Operations", () => {
    const a = asCmpNumSorted([0, 1, 2, 3]);
    const b = asCmpNumSorted([2, 3, 4, 5]);
    const expectedADiffB = [0, 1];
    const expectedIntersect = [2, 3];
    const expectedBDiffA = [4, 5];
    const expectedUnion = [0, 1, 2, 3, 4, 5];

    const { aMinusB, intersection, bMinusA, union } = sortedSetOperations(b)(a);
    expect([...aMinusB]).toEqual(expectedADiffB);
    expect([...intersection]).toEqual(expectedIntersect);
    expect([...bMinusA]).toEqual(expectedBDiffA);
    expect([...union]).toEqual(expectedUnion);
  });
});
