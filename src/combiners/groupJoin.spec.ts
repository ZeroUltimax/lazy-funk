import { Lazy } from "../coreTypes";
import {
  fullGroupJoin,
  fullGroupJoinWithDefault,
  groupJoin,
  leftGroupJoin,
  leftGroupJoinWithDefault,
  rightGroupJoin,
  rightGroupJoinWithDefault,
} from "./groupJoin";

const wordsABC = ["activity", "concept", "basket", "bed", "analyst", "client"];
const wordsBCD = ["diamond", "beer", "country", "disk", "cell", "bird"];
const selFirstLetter = (s: string) => s[0];
const joinAsGroup = <A, Ad, B, Bd, K>(
  a: Lazy<A> | Ad,
  b: Lazy<B> | Bd,
  key: K
) => ({
  key,
  a: a && typeof a === "object" && Symbol.iterator in a ? [...a] : a,
  b: b && typeof b === "object" && Symbol.iterator in b ? [...b] : b,
});

describe("GroupJoin", () => {
  it("Joins two sequences", () => {
    const expected = [
      { key: "c", a: ["concept", "client"], b: ["country", "cell"] },
      { key: "b", a: ["basket", "bed"], b: ["beer", "bird"] },
    ];
    const actual = [
      ...groupJoin(
        wordsABC,
        wordsBCD,
        selFirstLetter,
        selFirstLetter,
        joinAsGroup
      ),
    ];
    expect(actual).toEqual(expected);
  });
});

describe("Left Join", () => {
  it("Joins two sequences with all of first", () => {
    const expected = [
      { key: "a", a: ["activity", "analyst"], b: null },
      { key: "c", a: ["concept", "client"], b: ["country", "cell"] },
      { key: "b", a: ["basket", "bed"], b: ["beer", "bird"] },
    ];

    const actual = [
      ...leftGroupJoin(
        wordsABC,
        wordsBCD,
        selFirstLetter,
        selFirstLetter,
        joinAsGroup
      ),
    ];
    expect(actual).toEqual(expected);
  });
  it("Uses default value", () => {
    const expected = [
      { key: "a", a: ["activity", "analyst"], b: "missing" },
      { key: "c", a: ["concept", "client"], b: ["country", "cell"] },
      { key: "b", a: ["basket", "bed"], b: ["beer", "bird"] },
    ];

    const actual = [
      ...leftGroupJoinWithDefault(
        wordsABC,
        wordsBCD,
        selFirstLetter,
        selFirstLetter,
        () => "missing",
        joinAsGroup
      ),
    ];
    expect(actual).toEqual(expected);
  });
});

describe("Right Join", () => {
  it("Joins two sequences with all of second", () => {
    const expected = [
      { key: "d", a: null, b: ["diamond", "disk"] },
      { key: "b", a: ["basket", "bed"], b: ["beer", "bird"] },
      { key: "c", a: ["concept", "client"], b: ["country", "cell"] },
    ];

    const actual = [
      ...rightGroupJoin(
        wordsABC,
        wordsBCD,
        selFirstLetter,
        selFirstLetter,
        joinAsGroup
      ),
    ];
    expect(actual).toEqual(expected);
  });
  it("Uses default value", () => {
    const expected = [
      { key: "d", a: "nowhere", b: ["diamond", "disk"] },
      { key: "b", a: ["basket", "bed"], b: ["beer", "bird"] },
      { key: "c", a: ["concept", "client"], b: ["country", "cell"] },
    ];
    const actual = [
      ...rightGroupJoinWithDefault(
        wordsABC,
        wordsBCD,
        selFirstLetter,
        selFirstLetter,
        () => "nowhere",
        joinAsGroup
      ),
    ];
    expect(actual).toEqual(expected);
  });
});

describe("Full Join", () => {
  it("Joins two sequences with all of first", () => {
    const expected = [
      { key: "a", a: ["activity", "analyst"], b: null },
      { key: "c", a: ["concept", "client"], b: ["country", "cell"] },
      { key: "b", a: ["basket", "bed"], b: ["beer", "bird"] },
      { key: "d", a: null, b: ["diamond", "disk"] },
    ];

    const actual = [
      ...fullGroupJoin(
        wordsABC,
        wordsBCD,
        selFirstLetter,
        selFirstLetter,
        joinAsGroup
      ),
    ];
    expect(actual).toEqual(expected);
  });
  it("Uses default value", () => {
    const expected = [
      { key: "a", a: ["activity", "analyst"], b: "missing" },
      { key: "c", a: ["concept", "client"], b: ["country", "cell"] },
      { key: "b", a: ["basket", "bed"], b: ["beer", "bird"] },
      { key: "d", a: "nowhere", b: ["diamond", "disk"] },
    ];

    const actual = [
      ...fullGroupJoinWithDefault(
        wordsABC,
        wordsBCD,
        selFirstLetter,
        selFirstLetter,
        () => "nowhere",
        () => "missing",
        joinAsGroup
      ),
    ];
    expect(actual).toEqual(expected);
  });
});
