import { empty } from "./empty";

describe("Empty", () => {
  it("Is empty", () => {
    const actual = [...empty<number>()];
    const expected: number[] = [];
    expect(actual).toEqual(expected);
  });
});
