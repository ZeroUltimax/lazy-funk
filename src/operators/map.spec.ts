import { repeat } from "../producer/repeat";
import { flatMap, map } from "./map";
import { take } from "./take";

describe("Map", () => {
  it("transforms a sequence", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const proj = (x: number) => x * 11;
    const expected = [0, 11, 22, 33, 44, 55];
    const actual = [...map(proj)(inputs)];
    expect(actual).toStrictEqual(expected);
  });
  it("Transform a sequence of sequence into a flat sequence", () => {
    const inputs = [0, 1, 2, 3];
    const proj = (n: number) => take(n)(repeat(() => n));
    const actual = [...flatMap(proj)(inputs)];
    const expected = [1, 2, 2, 3, 3, 3];
    expect(actual).toEqual(expected);
  });
});
