import { Lazy } from "../coreTypes";
import { cmpNum } from "../funk/comparators";
import { asSorted } from "../operators/sort";
import {
  sortedFullGroupJoin,
  sortedFullGroupJoinWithDefault,
  sortedGroupJoin,
  sortedLeftGroupJoin,
  sortedLeftGroupJoinWithDefault,
  sortedRightGroupJoin,
  sortedRightGroupJoinWithDefault,
} from "./sortedGroupJoin";

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

const joinNums = (a: Lazy<number> | any, b: Lazy<number> | any) =>
  [a, b] as const;

describe("Incompatible sorts", () => {
  it("Checks for incompatible sorts", () => {
    const simpleNums = asSorted(cmpNum)([0, 1, 2, 3]);
    expect(() => {
      sortedGroupJoin(joinNums)(numsA)(simpleNums);
    }).toThrow();
  });
});

describe("Sorted Group Join", () => {
  it("Joins sorted sequences", () => {
    const expectedAB = [
      [
        [300, 299],
        [301, 298],
      ],
      [[600], [600]],
      [
        [900, 901],
        [902, 903],
      ],
    ];

    const expectedBA = [
      [
        [301, 298],
        [300, 299],
      ],
      [[600], [600]],
      [
        [902, 903],
        [900, 901],
      ],
    ];

    const actualAB = [...sortedGroupJoin(joinNums)(numsB)(numsA)];
    const actualBA = [...sortedGroupJoin(joinNums)(numsA)(numsB)];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
});

describe("Sorted Left Group  Join", () => {
  it("Joins sorted sequences", () => {
    const expectedAB = [
      [[100, 99], null],
      [
        [300, 299],
        [301, 298],
      ],
      [[600], [600]],
      [[700, 701], null],
      [[800, 801], null],
      [
        [900, 901],
        [902, 903],
      ],
      [[1000, 1001], null],
      [[1100], null],
    ];
    const expectedBA = [
      [[200, 201], null],
      [
        [301, 298],
        [300, 299],
      ],
      [[400, 401], null],
      [[500, 501], null],
      [[600], [600]],
      [
        [902, 903],
        [900, 901],
      ],
    ];
    const actualAB = [...sortedLeftGroupJoin(joinNums)(numsB)(numsA)];
    const actualBA = [...sortedLeftGroupJoin(joinNums)(numsA)(numsB)];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
  it("Uses Default Values", () => {
    const expectedAB = [
      [[100, 99], "defaultB"],
      [
        [300, 299],
        [301, 298],
      ],
      [[600], [600]],
      [[700, 701], "defaultB"],
      [[800, 801], "defaultB"],
      [
        [900, 901],
        [902, 903],
      ],
      [[1000, 1001], "defaultB"],
      [[1100], "defaultB"],
    ];
    const expectedBA = [
      [[200, 201], "defaultA"],
      [
        [301, 298],
        [300, 299],
      ],
      [[400, 401], "defaultA"],
      [[500, 501], "defaultA"],
      [[600], [600]],
      [
        [902, 903],
        [900, 901],
      ],
    ];
    const actualAB = [
      ...sortedLeftGroupJoinWithDefault(defaultB, joinNums)(numsB)(numsA),
    ];
    const actualBA = [
      ...sortedLeftGroupJoinWithDefault(defaultA, joinNums)(numsA)(numsB),
    ];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
});

describe("Sorted Right Group Join", () => {
  it("Joins sorted sequences", () => {
    const expectedAB = [
      [null, [200, 201]],
      [
        [300, 299],
        [301, 298],
      ],
      [null, [400, 401]],
      [null, [500, 501]],
      [[600], [600]],
      [
        [900, 901],
        [902, 903],
      ],
    ];
    const expectedBA = [
      [null, [100, 99]],
      [
        [301, 298],
        [300, 299],
      ],
      [[600], [600]],
      [null, [700, 701]],
      [null, [800, 801]],
      [
        [902, 903],
        [900, 901],
      ],
      [null, [1000, 1001]],
      [null, [1100]],
    ];
    const actualAB = [...sortedRightGroupJoin(joinNums)(numsB)(numsA)];
    const actualBA = [...sortedRightGroupJoin(joinNums)(numsA)(numsB)];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
  it("Uses default values", () => {
    const expectedAB = [
      ["defaultA", [200, 201]],
      [
        [300, 299],
        [301, 298],
      ],
      ["defaultA", [400, 401]],
      ["defaultA", [500, 501]],
      [[600], [600]],
      [
        [900, 901],
        [902, 903],
      ],
    ];
    const expectedBA = [
      ["defaultB", [100, 99]],
      [
        [301, 298],
        [300, 299],
      ],
      [[600], [600]],
      ["defaultB", [700, 701]],
      ["defaultB", [800, 801]],
      [
        [902, 903],
        [900, 901],
      ],
      ["defaultB", [1000, 1001]],
      ["defaultB", [1100]],
    ];
    const actualAB = [
      ...sortedRightGroupJoinWithDefault(defaultA, joinNums)(numsB)(numsA),
    ];
    const actualBA = [
      ...sortedRightGroupJoinWithDefault(defaultB, joinNums)(numsA)(numsB),
    ];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
});

describe("Sorted Full Group Join", () => {
  it("Joins sorted sequences", () => {
    const expectedAB = [
      [[100, 99], null],
      [null, [200, 201]],
      [
        [300, 299],
        [301, 298],
      ],
      [null, [400, 401]],
      [null, [500, 501]],
      [[600], [600]],
      [[700, 701], null],
      [[800, 801], null],
      [
        [900, 901],
        [902, 903],
      ],
      [[1000, 1001], null],
      [[1100], null],
    ];
    const expectedBA = [
      [null, [100, 99]],
      [[200, 201], null],
      [
        [301, 298],
        [300, 299],
      ],
      [[400, 401], null],
      [[500, 501], null],
      [[600], [600]],
      [null, [700, 701]],
      [null, [800, 801]],
      [
        [902, 903],
        [900, 901],
      ],
      [null, [1000, 1001]],
      [null, [1100]],
    ];
    const actualAB = [...sortedFullGroupJoin(joinNums)(numsB)(numsA)];
    const actualBA = [...sortedFullGroupJoin(joinNums)(numsA)(numsB)];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
  it("Uses default values", () => {
    const expectedAB = [
      [[100, 99], "defaultB"],
      ["defaultA", [200, 201]],
      [
        [300, 299],
        [301, 298],
      ],
      ["defaultA", [400, 401]],
      ["defaultA", [500, 501]],
      [[600], [600]],
      [[700, 701], "defaultB"],
      [[800, 801], "defaultB"],
      [
        [900, 901],
        [902, 903],
      ],
      [[1000, 1001], "defaultB"],
      [[1100], "defaultB"],
    ];
    const expectedBA = [
      ["defaultB", [100, 99]],
      [[200, 201], "defaultA"],
      [
        [301, 298],
        [300, 299],
      ],
      [[400, 401], "defaultA"],
      [[500, 501], "defaultA"],
      [[600], [600]],
      ["defaultB", [700, 701]],
      ["defaultB", [800, 801]],
      [
        [902, 903],
        [900, 901],
      ],
      ["defaultB", [1000, 1001]],
      ["defaultB", [1100]],
    ];
    const actualAB = [
      ...sortedFullGroupJoinWithDefault(defaultA, defaultB, joinNums)(numsB)(
        numsA
      ),
    ];
    const actualBA = [
      ...sortedFullGroupJoinWithDefault(defaultB, defaultA, joinNums)(numsA)(
        numsB
      ),
    ];

    expect(actualAB).toEqual(expectedAB);
    expect(actualBA).toEqual(expectedBA);
  });
});
