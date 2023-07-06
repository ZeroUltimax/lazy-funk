import { cmpNum } from "../funk/comparators";
import { asSorted } from "../operators/sort";
import {
  sortedDifference,
  sortedIntersection,
  sortedSetOperations,
  sortedUnion,
} from "./sortedSet";

describe("Sorted Set", () => {
  const a = asSorted([10, 9, 20, 19, 30, 29, 40, 39], cmpNum);
  const b = asSorted([20, 19, 30, 29, 40, 39, 50, 49], cmpNum);
  const expectedADiffB = [10];
  const expectedIntersect = [20, 30, 40];
  const expectedBDiffA = [50];
  const expectedUnion = [10, 20, 30, 40, 50];
  it("Union", () => {
    const actual = [...sortedUnion(a, b)];
    expect(actual).toEqual(expectedUnion);
  });
  it("Difference", () => {
    const actual = [...sortedDifference(a, b)];
    expect(actual).toEqual(expectedADiffB);
  });
  it("Intersect", () => {
    const actual = [...sortedIntersection(a, b)];
    expect(actual).toEqual(expectedIntersect);
  });
  it("Set Operations", () => {
    const a = asSorted([0, 1, 2, 3], cmpNum);
    const b = asSorted([2, 3, 4, 5], cmpNum);
    const expectedADiffB = [0, 1];
    const expectedIntersect = [2, 3];
    const expectedBDiffA = [4, 5];
    const expectedUnion = [0, 1, 2, 3, 4, 5];

    const { aMinusB, intersection, bMinusA, union } = sortedSetOperations(a, b);
    expect([...aMinusB]).toEqual(expectedADiffB);
    expect([...intersection]).toEqual(expectedIntersect);
    expect([...bMinusA]).toEqual(expectedBDiffA);
    expect([...union]).toEqual(expectedUnion);
  });
});
