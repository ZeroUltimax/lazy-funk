import { cmpBy, cmpNatural, cmpNum } from "../funk/comparators";
import {
  max,
  maxBy,
  maxOrDefault,
  maxOrDefaultBy,
  min,
  minBy,
  minOrDefault,
  minOrDefaultBy,
} from "./minMax";

interface Thing {
  word: string;
  level: number;
}

describe("Min Max", () => {
  const words: Thing[] = [
    { word: "strain", level: 6 },
    { word: "nominate", level: 8 },
    { word: "correspondence", level: 3 },
    { word: "pet", level: 2 },
    { word: "hostage", level: 1 },
  ];
  const selectWord = (w: Thing) => w.word;
  const selectLevel = (w: Thing) => w.level;
  const cmpStringLength = cmpBy((s: string) => s.length, cmpNum);
  const defaultThing = { word: "default", level: 0 };
  const defaultSeed = () => defaultThing;
  it("Picks min element", () => {
    const actual = minBy(selectWord, cmpStringLength)(words);
    const expected = { word: "pet", level: 2 };
    expect(actual).toEqual(expected);
  });
  it("Min throws on empty", () => {
    expect(() => minBy(selectWord, cmpStringLength)([])).toThrow();
  });
  it("Returns default min on empty sequence", () => {
    const actual = minOrDefaultBy(selectWord, cmpStringLength, defaultSeed)([]);
    const expected = defaultThing;
    expect(actual).toEqual(expected);
  });
  it("Picks max element", () => {
    const actual = maxBy(selectLevel, cmpNatural)(words);
    const expected = { word: "nominate", level: 8 };
    expect(actual).toEqual(expected);
  });
  it("Max throws on empty", () => {
    expect(() => maxBy(selectWord, cmpStringLength)([])).toThrow();
  });
  it("Returns default max on empty sequence", () => {
    const actual = maxOrDefaultBy(selectWord, cmpStringLength, defaultSeed)([]);
    const expected = defaultThing;
    expect(actual).toEqual(expected);
  });
  it("Maxes", () => {
    const numbers = [3, 2, 5, 4, 1];
    const actual = max(numbers);
    const expected = 5;
    expect(actual).toEqual(expected);
  });
  it("Default Max", () => {
    const actual = maxOrDefault(() => 10)([]);
    const expected = 10;
    expect(actual).toEqual(expected);
  });
  it("Min", () => {
    const numbers = [3, 2, 5, 4, 1];
    const actual = min(numbers);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Default Min", () => {
    const actual = minOrDefault(() => -1)([]);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
});
