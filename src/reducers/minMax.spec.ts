import { cmpBy, cmpNum } from "../funk/comparators";
import { maxBy, minBy } from "./minMax";

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
  it("Picks min element", () => {
    const actual = minBy(words, selectWord, cmpStringLength);
    const expected = { word: "pet", level: 2 };
    expect(actual).toEqual(expected);
  });
  it("Picks max element", () => {
    const actual = maxBy(words, selectLevel);
    const expected = { word: "nominate", level: 8 };
    expect(actual).toEqual(expected);
  });
});
