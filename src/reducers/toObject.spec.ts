import { toObject } from "./toObject";

describe("To Object", () => {
  it("Creates object from pairs", () => {
    const pairs = [
      ["Hello", 1],
      ["World", 2],
      ["!", 3],
    ] as const;
    const expected = {
      ["Hello"]: 1,
      ["World"]: 2,
      ["!"]: 3,
    };
    const actual = toObject(pairs);
    expect(actual).toEqual(expected);
  });
});
