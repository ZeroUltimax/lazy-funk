import { cmpBy } from "../funk/comparators";
import { areEqual } from "./areEqual";

describe("Are Equal", () => {
  it("Compares equal for equivalent sequences", () => {
    const a = ["aa", "bb", "cc"];
    const b = ["ab", "bc", "cd"];
    const cmpFirstLetter = cmpBy((s: string) => s[0]);
    const actual = areEqual(cmpFirstLetter)(b)(a);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("Compares not equal for different sequences", () => {
    const a = ["aa", "bb", "cc"];
    const b = ["ab", "cd", "ef"];
    const cmpFirstLetter = cmpBy((s: string) => s[0]);
    const actual = areEqual(cmpFirstLetter)(b)(a);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("Compares not equal sequences of different length", () => {
    const a = ["aa", "bb", "cc"];
    const b = ["aa", "bb", "cc", "dd"];
    const actual = areEqual()(b)(a);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});
