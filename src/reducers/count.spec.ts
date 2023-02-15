import { empty } from "../producer/empty";
import { range } from "../producer/range";
import { count } from "./count";

describe("Count", () => {
  it("Counts elements", () => {
    const numbers = range(0, 10);
    const actual = count(numbers);
    const expected = 10;
    expect(actual).toEqual(expected);
  });
  it("Counts empty sequence", () => {
    const numbers = empty();
    const actual = count(numbers);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
});
