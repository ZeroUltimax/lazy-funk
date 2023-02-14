import { take } from "../operators/take";
import { iterate } from "./iterate";

describe("Iterate", () => {
  it("Repeatedly generate", () => {
    const succ = (s: string) => s + s[0];
    const seed = () => "x";
    const actual = [...take(iterate(succ, seed), 5)];
    const expected = ["x", "xx", "xxx", "xxxx", "xxxxx"];
    expect(actual).toEqual(expected);
  });
});
