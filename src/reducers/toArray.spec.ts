import { range } from "../producer/range";
import { toArray } from "./toArray";

describe("To Array", () => {
  it("Makes it into an array", () => {
    const actual = toArray(range(0, 6));
    const expected = [0, 1, 2, 3, 4, 5];
    expect(actual).toEqual(expected);
  });
});
