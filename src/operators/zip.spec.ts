import { zip, zipWith } from "./zip";

describe("Zip", () => {
  it("Combines two streams of data", () => {
    const data1 = [1, 2, 3, 4];
    const data2 = ["a", "b", "c", "d"];
    const zipRepeat = (a: number, b: string) => b.repeat(a);
    const actual = [...zipWith(data1, data2, zipRepeat)];
    const expected = ["a", "bb", "ccc", "dddd"];
    expect(actual).toEqual(expected);
  });
  it("Stops when either is out of data", () => {
    const data1 = [1, 2, 3, 4];
    const data2 = ["a", "b"];
    const zipRepeat = (a: number, b: string) => b.repeat(a);
    const actual = [...zipWith(data1, data2, zipRepeat)];
    const expected = ["a", "bb"];
    expect(actual).toEqual(expected);
  });
  it("default zips with pairs", () => {
    const keys = ["a", "b", "c"];
    const values = [1, 2, 3];
    const actual = Object.fromEntries(zip(keys, values));
    const expected = { a: 1, b: 2, c: 3 };
    expect(actual).toEqual(expected);
  });
});
