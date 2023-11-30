import {
  difference,
  differenceBy,
  intersection,
  intersectionBy,
  setOperations,
  setOperationsBy,
  union,
  unionBy,
} from "./set";

describe("Set Operations", () => {
  it("Gives set results", () => {
    const a = [0, 1, 2, 3];
    const b = [2, 3, 4, 5];
    const expectedADiffB = [0, 1];
    const expectedIntersect = [2, 3];
    const expectedBDiffA = [4, 5];
    const expectedUnion = [0, 1, 2, 3, 4, 5];

    const {
      aMinusB: aDiffB,
      intersection: inter,
      bMinusA: bDiffA,
      union: un,
    } = setOperations(b)(a);
    const opADiffB = difference(b)(a);
    const opInter = intersection(b)(a);
    const opUn = union(b)(a);
    expect([...aDiffB]).toEqual(expectedADiffB);
    expect([...opADiffB]).toEqual(expectedADiffB);
    expect([...inter]).toEqual(expectedIntersect);
    expect([...opInter]).toEqual(expectedIntersect);
    expect([...bDiffA]).toEqual(expectedBDiffA);
    expect([...un]).toEqual(expectedUnion);
    expect([...opUn]).toEqual(expectedUnion);
  });

  it("Gives set results with key selector", () => {
    const _0a = { code: 0, value: "a" };
    const _1b = { code: 1, value: "b" };
    const _1x = { code: 1, value: "x" };
    const _2y = { code: 2, value: "y" };

    const selCode = (x: any) => x.code;

    const a = [_0a, _1b];
    const b = [_1x, _2y];

    const expectedADiffB = [_0a];
    const expectedIntersect = [_1b];
    const expectedBDiffA = [_2y];
    const expectedUnion = [_0a, _1b, _2y];

    const {
      aMinusB: aDiffB,
      intersection: inter,
      bMinusA: bDiffA,
      union: un,
    } = setOperationsBy(selCode)(b)(a);
    const opADiffB = differenceBy(selCode)(b)(a);
    const opInter = intersectionBy(selCode)(b)(a);
    const opUn = unionBy(selCode)(b)(a);
    expect([...aDiffB]).toEqual(expectedADiffB);
    expect([...opADiffB]).toEqual(expectedADiffB);
    expect([...inter]).toEqual(expectedIntersect);
    expect([...opInter]).toEqual(expectedIntersect);
    expect([...bDiffA]).toEqual(expectedBDiffA);
    expect([...un]).toEqual(expectedUnion);
    expect([...opUn]).toEqual(expectedUnion);
  });
});
