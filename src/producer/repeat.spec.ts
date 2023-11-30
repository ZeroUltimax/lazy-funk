import { take } from "../operators/take";
import { repeat, repeatSequence } from "./repeat";

describe("Repeat", () => {
  it("Produces the same value", () => {
    const seed = () => 123;
    const actual = [...take(5)(repeat(seed))];
    const expected = [123, 123, 123, 123, 123];
    expect(actual).toEqual(expected);
  });
});

describe("Repeat Sequence", () => {
  it("Produces the same sequence", () => {
    const seed = () => [1, 2, 3];
    const actual = [...take(8)(repeatSequence(seed))];
    const expected = [1, 2, 3, 1, 2, 3, 1, 2];
    expect(actual).toEqual(expected);
  });
});
