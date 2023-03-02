import { setOperations, setOperationsBy } from "./set";

describe("Set Operations", () => {
  it("Gives set results", () => {
    const a = [0, 1, 2, 3];
    const b = [2, 3, 4, 5];
    const expectedADiffB = [0, 1];
    const expectedIntersect = [2, 3];
    const expectedBDiffA = [4, 5];
    const expectedUnion = [0, 1, 2, 3, 4, 5];

    const { aMinusB, intersection, bMinusA, union } = setOperations(a, b);
    expect([...aMinusB]).toEqual(expectedADiffB);
    expect([...intersection]).toEqual(expectedIntersect);
    expect([...bMinusA]).toEqual(expectedBDiffA);
    expect([...union]).toEqual(expectedUnion);
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

    const { aMinusB, intersection, bMinusA, union } = setOperationsBy(
      a,
      b,
      selCode
    );
    expect([...aMinusB]).toEqual(expectedADiffB);
    expect([...intersection]).toEqual(expectedIntersect);
    expect([...bMinusA]).toEqual(expectedBDiffA);
    expect([...union]).toEqual(expectedUnion);
  });
});
