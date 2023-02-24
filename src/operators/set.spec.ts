import { distinct, distinctBy, setOperations, setOperationsBy } from "./set";

describe("Distinct", () => {
  it("Removes duplicates", () => {
    const numbers = [
      10, 20, 18, 4, 15, 11, 7, 7, 9, 9, 14, 6, 7, 13, 8, 20, 12, 15, 16, 14,
    ];
    const expectd = [10, 20, 18, 4, 15, 11, 7, 9, 14, 6, 13, 8, 12, 16];
    const actual = [...distinct(numbers)];
    expect(actual).toEqual(expectd);
  });
});

describe("Distinct By", () => {
  it("Removes duplicates", () => {
    const words = [
      "one",
      "heat",
      "crazy",
      "harsh",
      "resolute",
      "decorate",
      "bore",
      "hook",
      "grab",
      "run",
      "squalid",
      "shake",
    ];
    const selLength = (w: string) => w.length;
    const expectd = ["one", "heat", "crazy", "resolute", "squalid"];
    const actual = [...distinctBy(words, selLength)];
    expect(actual).toEqual(expectd);
  });
});

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
