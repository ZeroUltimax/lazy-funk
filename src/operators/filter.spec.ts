import { filter } from "./filter";

describe("Filter", () => {
  it("filters a sequence", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const pred = (x: number) => x % 2 == 0;
    const expected = [0, 2, 4];
    const actual = [...filter(inputs, pred)];
    expect(actual).toStrictEqual(expected);
  });
});
