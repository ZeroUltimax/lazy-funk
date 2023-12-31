import { Lazy } from "../coreTypes";
import { cmpNum } from "../funk/comparators";
import { asSorted } from "../operators/sort";
import {
  sortedFullJoin,
  sortedFullJoinWithDefault,
  sortedJoin,
  sortedLeftJoin,
  sortedLeftJoinWithDefault,
  sortedRightJoin,
  sortedRightJoinWithDefault,
} from "./sortedJoin";

const cmpHundreds = (a: number, b: number) =>
  cmpNum((a / 100) | 0, (b / 100) | 0);
const numsA = asSorted(cmpHundreds)([
  100, 99, 300, 299, 600, 700, 701, 800, 801, 900, 901, 1000, 1001, 1100,
]);
const numsB = asSorted(cmpHundreds)([
  200, 201, 301, 298, 400, 401, 500, 501, 600, 902, 903,
]);

const defaultA = () => "defaultA";
const defaultB = () => "defaultB";

const joinNums = (a: number | string | null, b: number | string | null) => [
  a,
  b,
];

describe("Incompatible sorts", () => {
  it("Checks for incompatible sorts", () => {
    const simpleNums = asSorted(cmpNum)([0, 1, 2, 3]);
    expect(() => sortedJoin(joinNums)(numsA)(simpleNums)).toThrow();
  });
});

describe("Sorted Join", () => {
  it("Joins sorted sequences", () => {
    const expectedAB = [
      [300, 301],
      [300, 298],
      [299, 301],
      [299, 298],
      [600, 600],
      [900, 902],
      [900, 903],
      [901, 902],
      [901, 903],
    ];

    const expectedBA = [
      [301, 300],
      [301, 299],
      [298, 300],
      [298, 299],
      [600, 600],
      [902, 900],
      [902, 901],
      [903, 900],
      [903, 901],
    ];

    const actualAB = [...sortedJoin(joinNums)(numsB)(numsA)];
    const actualBA = [...sortedJoin(joinNums)(numsA)(numsB)];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
});

describe("Sorted Left Join", () => {
  it("Joins sorted sequences", () => {
    const expectedAB = [
      [100, null],
      [99, null],
      [300, 301],
      [300, 298],
      [299, 301],
      [299, 298],
      [600, 600],
      [700, null],
      [701, null],
      [800, null],
      [801, null],
      [900, 902],
      [900, 903],
      [901, 902],
      [901, 903],
      [1000, null],
      [1001, null],
      [1100, null],
    ];
    const expectedBA = [
      [200, null],
      [201, null],
      [301, 300],
      [301, 299],
      [298, 300],
      [298, 299],
      [400, null],
      [401, null],
      [500, null],
      [501, null],
      [600, 600],
      [902, 900],
      [902, 901],
      [903, 900],
      [903, 901],
    ];
    const actualAB = [...sortedLeftJoin(joinNums)(numsB)(numsA)];
    const actualBA = [...sortedLeftJoin(joinNums)(numsA)(numsB)];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
  it("Uses Default Values", () => {
    const expectedAB = [
      [100, "defaultB"],
      [99, "defaultB"],
      [300, 301],
      [300, 298],
      [299, 301],
      [299, 298],
      [600, 600],
      [700, "defaultB"],
      [701, "defaultB"],
      [800, "defaultB"],
      [801, "defaultB"],
      [900, 902],
      [900, 903],
      [901, 902],
      [901, 903],
      [1000, "defaultB"],
      [1001, "defaultB"],
      [1100, "defaultB"],
    ];
    const expectedBA = [
      [200, "defaultA"],
      [201, "defaultA"],
      [301, 300],
      [301, 299],
      [298, 300],
      [298, 299],
      [400, "defaultA"],
      [401, "defaultA"],
      [500, "defaultA"],
      [501, "defaultA"],
      [600, 600],
      [902, 900],
      [902, 901],
      [903, 900],
      [903, 901],
    ];
    const actualAB = [
      ...sortedLeftJoinWithDefault(defaultB, joinNums)(numsB)(numsA),
    ];
    const actualBA = [
      ...sortedLeftJoinWithDefault(defaultA, joinNums)(numsA)(numsB),
    ];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
});

describe("Sorted Right Join", () => {
  it("Joins sorted sequences", () => {
    const expectedAB = [
      [null, 200],
      [null, 201],
      [300, 301],
      [299, 301],
      [300, 298],
      [299, 298],
      [null, 400],
      [null, 401],
      [null, 500],
      [null, 501],
      [600, 600],
      [900, 902],
      [901, 902],
      [900, 903],
      [901, 903],
    ];
    const expectedBA = [
      [null, 100],
      [null, 99],
      [301, 300],
      [298, 300],
      [301, 299],
      [298, 299],
      [600, 600],
      [null, 700],
      [null, 701],
      [null, 800],
      [null, 801],
      [902, 900],
      [903, 900],
      [902, 901],
      [903, 901],
      [null, 1000],
      [null, 1001],
      [null, 1100],
    ];
    const actualAB = [...sortedRightJoin(joinNums)(numsB)(numsA)];
    const actualBA = [...sortedRightJoin(joinNums)(numsA)(numsB)];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
  it("Uses default values", () => {
    const expectedAB = [
      ["defaultA", 200],
      ["defaultA", 201],
      [300, 301],
      [299, 301],
      [300, 298],
      [299, 298],
      ["defaultA", 400],
      ["defaultA", 401],
      ["defaultA", 500],
      ["defaultA", 501],
      [600, 600],
      [900, 902],
      [901, 902],
      [900, 903],
      [901, 903],
    ];
    const expectedBA = [
      ["defaultB", 100],
      ["defaultB", 99],
      [301, 300],
      [298, 300],
      [301, 299],
      [298, 299],
      [600, 600],
      ["defaultB", 700],
      ["defaultB", 701],
      ["defaultB", 800],
      ["defaultB", 801],
      [902, 900],
      [903, 900],
      [902, 901],
      [903, 901],
      ["defaultB", 1000],
      ["defaultB", 1001],
      ["defaultB", 1100],
    ];
    const actualAB = [
      ...sortedRightJoinWithDefault(defaultA, joinNums)(numsB)(numsA),
    ];
    const actualBA = [
      ...sortedRightJoinWithDefault(defaultB, joinNums)(numsA)(numsB),
    ];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
});

describe("Sorted Full Join", () => {
  it("Joins sorted sequences", () => {
    const expectedAB = [
      [100, null],
      [99, null],
      [null, 200],
      [null, 201],
      [300, 301],
      [300, 298],
      [299, 301],
      [299, 298],
      [null, 400],
      [null, 401],
      [null, 500],
      [null, 501],
      [600, 600],
      [700, null],
      [701, null],
      [800, null],
      [801, null],
      [900, 902],
      [900, 903],
      [901, 902],
      [901, 903],
      [1000, null],
      [1001, null],
      [1100, null],
    ];
    const expectedBA = [
      [null, 100],
      [null, 99],
      [200, null],
      [201, null],
      [301, 300],
      [301, 299],
      [298, 300],
      [298, 299],
      [400, null],
      [401, null],
      [500, null],
      [501, null],
      [600, 600],
      [null, 700],
      [null, 701],
      [null, 800],
      [null, 801],
      [902, 900],
      [902, 901],
      [903, 900],
      [903, 901],
      [null, 1000],
      [null, 1001],
      [null, 1100],
    ];
    const actualAB = [...sortedFullJoin(joinNums)(numsB)(numsA)];
    const actualBA = [...sortedFullJoin(joinNums)(numsA)(numsB)];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
  it("Uses default values", () => {
    const expectedAB = [
      [100, "defaultB"],
      [99, "defaultB"],
      ["defaultA", 200],
      ["defaultA", 201],
      [300, 301],
      [300, 298],
      [299, 301],
      [299, 298],
      ["defaultA", 400],
      ["defaultA", 401],
      ["defaultA", 500],
      ["defaultA", 501],
      [600, 600],
      [700, "defaultB"],
      [701, "defaultB"],
      [800, "defaultB"],
      [801, "defaultB"],
      [900, 902],
      [900, 903],
      [901, 902],
      [901, 903],
      [1000, "defaultB"],
      [1001, "defaultB"],
      [1100, "defaultB"],
    ];
    const expectedBA = [
      ["defaultB", 100],
      ["defaultB", 99],
      [200, "defaultA"],
      [201, "defaultA"],
      [301, 300],
      [301, 299],
      [298, 300],
      [298, 299],
      [400, "defaultA"],
      [401, "defaultA"],
      [500, "defaultA"],
      [501, "defaultA"],
      [600, 600],
      ["defaultB", 700],
      ["defaultB", 701],
      ["defaultB", 800],
      ["defaultB", 801],
      [902, 900],
      [902, 901],
      [903, 900],
      [903, 901],
      ["defaultB", 1000],
      ["defaultB", 1001],
      ["defaultB", 1100],
    ];
    const actualAB = [
      ...sortedFullJoinWithDefault(defaultA, defaultB, joinNums)(numsB)(numsA),
    ];
    const actualBA = [
      ...sortedFullJoinWithDefault(defaultB, defaultA, joinNums)(numsA)(numsB),
    ];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
});
