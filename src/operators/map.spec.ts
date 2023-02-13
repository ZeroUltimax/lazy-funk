import { map } from "./map";

describe("Map", () => {
  it("transforms a sequence", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const proj = (x: number) => x * 11;
    const expected = [0, 11, 22, 33, 44, 55];
    const actual = [...map(inputs, proj)];
    expect(actual).toStrictEqual(expected);
  });
});
