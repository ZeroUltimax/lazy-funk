import { empty } from "../producer/empty";
import { fold, foldSeedless } from "./fold";

describe("Fold", () => {
  it("Reduces the input", () => {
    const input = [0, 1, 2, 3, 4];
    const acc = (acc: string, el: number) =>
      acc.length ? acc + "," + el : acc + el;
    const seed = () => "";
    const actual = fold(acc, seed)(input);
    const expected = "0,1,2,3,4";
    expect(actual).toEqual(expected);
  });
});

describe("Fold Seedless", () => {
  it("Seeds from first item", () => {
    const input = [1, 2, 3, 4];
    const acc = (acc: number, el: number) => acc + el;
    const actual = foldSeedless(acc)(input);
    const expected = 10;
    expect(actual).toEqual(expected);
  });

  it("Throws when seedless and emty input", () => {
    const input = empty<number>();
    const acc = (acc: number, el: number) => acc + el;

    expect(() => foldSeedless(acc)(input)).toThrow();
  });
});
