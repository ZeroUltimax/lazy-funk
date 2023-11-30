import { range } from "../producer/range";
import { scan, scanSeedless } from "./scan";

describe("Scan", () => {
  it("Accumulates over numbers", () => {
    const numbers = [0, 1, 2, 3];
    const acc = (acc: string, el: number) => `${acc},${el}`;
    const seed = () => "";
    const actual = [...scan(acc, seed)(numbers)];
    const expected = ["", ",0", ",0,1", ",0,1,2", ",0,1,2,3"];
    expect(actual).toEqual(expected);
  });
});

describe("Scan Primed", () => {
  it("Automatically seeds from inputs", () => {
    const numbers = range(0, 5);
    const acc = (acc: number, el: number) => acc + el * el;
    const actual = [...scanSeedless(acc)(numbers)];
    const expected = [0, 1, 5, 14, 30];
    expect(actual).toEqual(expected);
  });
  it("Fails to sed from empty input", () => {
    const numbers = range(0, 0);
    const acc = (acc: number, el: number) => acc + el * el;
    expect(() => [...scanSeedless(acc)(numbers)]).toThrow();
  });
});
