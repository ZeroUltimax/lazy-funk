import { flat } from "./flat";

describe("Flat", () => {
  it("flattens a sequence", () => {
    const inputs = [
      [0, 1],
      [2, 3],
      [4, 5],
    ];
    const expected = [0, 1, 2, 3, 4, 5];
    const actual = [...flat(inputs)];
    expect(actual).toStrictEqual(expected);
  });
});
