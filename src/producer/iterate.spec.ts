import { take } from "../operators/take";
import { iterate } from "./iterate";

describe("Iterate", () => {
  it("Repeatedly generate", () => {
    const succ = (s: string) => s + s[0];
    const seed = () => "x";
    const actual = [...take(5)(iterate(succ, seed))];
    const expected = ["x", "xx", "xxx", "xxxx", "xxxxx"];
    expect(actual).toEqual(expected);
  });
});
