import { cmpNum } from "../funk/comparators";
import { asSorted } from "../operators/sort";
import { sortedFullJoin } from "./sortedJoin";

describe("Sorted Join", () => {
  it("Joins", () => {
    const cmpHundreds = (a: number, b: number) =>
      cmpNum((a / 100) | 0, (b / 100) | 0);
    const numsA = asSorted([100, 99, 200, 199, 400, 401], cmpHundreds);
    const numsB = asSorted(
      [201, 202, 300, 301, 402, 399, 500, 501, 600],
      cmpHundreds
    );

    const joinNums = (a: number | null, b: number | null) => [a, b];

    const expectedAB = [
      [100, null],
      [99, null],
      [200, 201],
      [200, 202],
      [199, 201],
      [199, 202],
      [null, 300],
      [null, 301],
      [400, 402],
      [400, 399],
      [401, 402],
      [401, 399],
      [null, 500],
      [null, 501],
      [null, 600],
    ];
    const actualAB = [...sortedFullJoin(numsA, numsB, joinNums)];
    const expectedBA = [
      [null, 100],
      [null, 99],
      [201, 200],
      [201, 199],
      [202, 200],
      [202, 199],
      [300, null],
      [301, null],
      [402, 400],
      [402, 401],
      [399, 400],
      [399, 401],
      [500, null],
      [501, null],
      [600, null],
    ];
    const actualBA = [...sortedFullJoin(numsB, numsA, joinNums)];
    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
});
