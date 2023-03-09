import { cmpNum } from "../funk/comparators";
import { asSorted } from "../operators/sort";
import { sortedDifference, sortedIntersection, sortedUnion } from "./sortedSet";

const numbersA = [150, 149, 250, 249, 350, 349];

// Possible start/end points: Before, Start, Middle,Last,After
const numbersBB = [50, 49, 100, 99];
const xpectedBB = [50, 100, 150, 250, 350];
const numbersBS = [50, 49, 150, 149];
const xpectedBS = [50, 150, 250, 350];
const numbersBM = [50, 49, 200, 199, 225, 224];
const xpectedBM = [50, 150, 200, 225, 250, 350];
const numbersBL = [50, 49, 350, 349];
const xpectedBL = [50, 150, 250, 350];
const numbersBA = [50, 49, 450, 449];
const xpectedBA = [50, 150, 250, 350, 450];

const numbersSS = [150, 149, 150, 149];
const xpectedSS = [150, 250, 350];
const numbersSM = [150, 149, 200, 199];
const xpectedSM = [150, 200, 250, 350];
const numbersSL = [150, 149, 275, 274, 350, 349];
const xpectedSL = [150, 250, 275, 350];
const numbersSA = [150, 149, 250, 249, 350, 349, 450, 449];
const xpectedSA = [150, 250, 350, 450];

const numbersMM = [200, 199, 275, 274];
const xpectedMM = [150, 200, 250, 275, 350];
const numbersML = [200, 199, 350, 349];
const xpectedML = [150, 200, 250, 350];
const numbersMA = [275, 274, 350, 349, 450, 449];
const xpectedMA = [150, 250, 275, 350, 450];

const numbersLL = [350, 349, 350, 349];
const xpectedLL = [150, 250, 350];
const numbersLA = [350, 349, 450, 449];
const xpectedLA = [150, 250, 350, 450];

const numbersAA = [450, 449, 550, 549];
const xpectedAA = [150, 250, 350, 450, 550];

const numbersE: number[] = [];
const xpectedE = [150, 250, 350];

describe("Union", () => {
  it("Returns all numbers", () => {
    const numsa = asSorted([1, 2, 3], cmpNum);
    const numsb = asSorted([3, 4, 5], cmpNum);

    const expected = [1, 2, 3, 4, 5];
    const actual = [...sortedUnion(numsa, numsb)];
    expect(actual).toEqual(expected);
  });
  it("Ignores out of order elements", () => {
    const numsa = asSorted([3, 2, 1, 6, 5, 4, 9, 8, 7], cmpNum);
    const numsb = asSorted([2, 1, 4, 3, 6, 5], cmpNum);

    const expected = [2, 3, 4, 6, 9];
    const actual = [...sortedUnion(numsa, numsb)];
    expect(actual).toEqual(expected);
  });
  it("Does", () => {
    const tests = [
      [numbersA, numbersBB, xpectedBB],
      [numbersA, numbersBS, xpectedBS],
      [numbersA, numbersBM, xpectedBM],
      [numbersA, numbersBL, xpectedBL],
      [numbersA, numbersBA, xpectedBA],
      [numbersA, numbersSS, xpectedSS],
      [numbersA, numbersSM, xpectedSM],
      [numbersA, numbersSL, xpectedSL],
      [numbersA, numbersSA, xpectedSA],
      [numbersA, numbersMM, xpectedMM],
      [numbersA, numbersML, xpectedML],
      [numbersA, numbersMA, xpectedMA],
      [numbersA, numbersLL, xpectedLL],
      [numbersA, numbersLA, xpectedLA],
      [numbersA, numbersAA, xpectedAA],
      [numbersA, numbersE, xpectedE],
      [numbersE, numbersA, xpectedE],
      [numbersE, numbersE, numbersE],
    ];
    for (const [numbersA, numbersB, expected] of tests) {
      const numsa = asSorted(numbersA, cmpNum);
      const numsb = asSorted(numbersB, cmpNum);
      const actual = [...sortedUnion(numsa, numsb)];
      expect(actual).toEqual(expected);
    }
  });
});

describe("Intersection", () => {
  it("Returns numbers in both", () => {
    const numsa = asSorted([1, 2, 3, 7], cmpNum);
    const numsb = asSorted([3, 4, 5, 7, 9], cmpNum);

    const expected = [3, 7];
    const actual = [...sortedIntersection(numsa, numsb)];
    expect(actual).toEqual(expected);
  });
  it("Ignores out of order elements", () => {
    const numsa = asSorted([3, 2, 1, 6, 5, 4, 9, 8, 7, 12, 11, 10], cmpNum);
    const numsb = asSorted([2, 1, 6, 5, 10, 9], cmpNum);

    const expected = [6];
    const actual = [...sortedIntersection(numsa, numsb)];
    expect(actual).toEqual(expected);
  });
});

describe("Difference", () => {
  it("Returns numbers only in A", () => {
    const numsa = asSorted([1, 2, 3, 7, 10], cmpNum);
    const numsb = asSorted([3, 4, 5, 7, 9], cmpNum);

    const expected = [1, 2, 10];
    const actual = [...sortedDifference(numsa, numsb)];
    expect(actual).toEqual(expected);
  });
  it("Ignores out of order elements", () => {
    const numsa = asSorted([3, 2, 1, 6, 5, 4, 9, 8, 7, 12, 11, 10], cmpNum);
    const numsb = asSorted([2, 1, 6, 5, 10, 9], cmpNum);

    const expected = [3, 9, 12];
    const actual = [...sortedDifference(numsa, numsb)];
    expect(actual).toEqual(expected);
  });
});
