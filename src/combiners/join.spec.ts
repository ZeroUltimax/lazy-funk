import {
  fullJoin,
  fullJoinWithDefault,
  join,
  leftJoin,
  leftJoinWithDefault,
  rightJoin,
  rightJoinWithDefault,
} from "./join";

const wordsABC = ["activity", "concept", "basket", "bed", "analyst", "client"];
const wordsBCD = ["diamond", "beer", "country", "disk", "cell", "bird"];
const selFirstLetter = (s: string) => s[0];
const joinAsPair = <A, B>(a: A, b: B) => [a, b] as const;

describe("Join", () => {
  it("Joins two sequences", () => {
    const expected = [
      ["concept", "country"],
      ["concept", "cell"],
      ["client", "country"],
      ["client", "cell"],
      ["basket", "beer"],
      ["basket", "bird"],
      ["bed", "beer"],
      ["bed", "bird"],
    ];
    const actual = [
      ...join(selFirstLetter, selFirstLetter, joinAsPair)(wordsBCD)(wordsABC),
    ];
    expect(actual).toEqual(expected);
  });
});

describe("Left Join", () => {
  it("Joins two sequences with all of first", () => {
    const expected = [
      ["activity", null],
      ["analyst", null],
      ["concept", "country"],
      ["concept", "cell"],
      ["client", "country"],
      ["client", "cell"],
      ["basket", "beer"],
      ["basket", "bird"],
      ["bed", "beer"],
      ["bed", "bird"],
    ];
    const actual = [
      ...leftJoin(selFirstLetter, selFirstLetter, joinAsPair)(wordsBCD)(
        wordsABC
      ),
    ];
    expect(actual).toEqual(expected);
  });
  it("Uses default value", () => {
    const expected = [
      ["activity", "missing"],
      ["analyst", "missing"],
      ["concept", "country"],
      ["concept", "cell"],
      ["client", "country"],
      ["client", "cell"],
      ["basket", "beer"],
      ["basket", "bird"],
      ["bed", "beer"],
      ["bed", "bird"],
    ];
    const actual = [
      ...leftJoinWithDefault(
        selFirstLetter,
        selFirstLetter,
        () => "missing",
        joinAsPair
      )(wordsBCD)(wordsABC),
    ];
    expect(actual).toEqual(expected);
  });
});

describe("Right Join", () => {
  it("Joins two sequences with all of second", () => {
    const expected = [
      [null, "diamond"],
      [null, "disk"],
      ["basket", "beer"],
      ["bed", "beer"],
      ["basket", "bird"],
      ["bed", "bird"],
      ["concept", "country"],
      ["client", "country"],
      ["concept", "cell"],
      ["client", "cell"],
    ];
    const actual = [
      ...rightJoin(selFirstLetter, selFirstLetter, joinAsPair)(wordsBCD)(
        wordsABC
      ),
    ];
    expect(actual).toEqual(expected);
  });
  it("Uses default value", () => {
    const expected = [
      ["nowhere", "diamond"],
      ["nowhere", "disk"],
      ["basket", "beer"],
      ["bed", "beer"],
      ["basket", "bird"],
      ["bed", "bird"],
      ["concept", "country"],
      ["client", "country"],
      ["concept", "cell"],
      ["client", "cell"],
    ];
    const actual = [
      ...rightJoinWithDefault(
        selFirstLetter,
        selFirstLetter,
        () => "nowhere",
        joinAsPair
      )(wordsBCD)(wordsABC),
    ];
    expect(actual).toEqual(expected);
  });
});

describe("Full Join", () => {
  it("Joins two sequences with all of first", () => {
    const expected = [
      ["activity", null],
      ["analyst", null],
      ["concept", "country"],
      ["concept", "cell"],
      ["client", "country"],
      ["client", "cell"],
      ["basket", "beer"],
      ["basket", "bird"],
      ["bed", "beer"],
      ["bed", "bird"],
      [null, "diamond"],
      [null, "disk"],
    ];
    const actual = [
      ...fullJoin(selFirstLetter, selFirstLetter, joinAsPair)(wordsBCD)(
        wordsABC
      ),
    ];
    expect(actual).toEqual(expected);
  });
  it("Uses default value", () => {
    const expected = [
      ["activity", "missing"],
      ["analyst", "missing"],
      ["concept", "country"],
      ["concept", "cell"],
      ["client", "country"],
      ["client", "cell"],
      ["basket", "beer"],
      ["basket", "bird"],
      ["bed", "beer"],
      ["bed", "bird"],
      ["nowhere", "diamond"],
      ["nowhere", "disk"],
    ];
    const actual = [
      ...fullJoinWithDefault(
        selFirstLetter,
        selFirstLetter,
        () => "nowhere",
        () => "missing",
        joinAsPair
      )(wordsBCD)(wordsABC),
    ];
    expect(actual).toEqual(expected);
  });
});
