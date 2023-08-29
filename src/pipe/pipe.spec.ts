import { Lazy } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { pipe, spout } from "./pipe";

const numbers = [0, 1, 2, 3, 4];

const addN = (n: number) =>
  lazyfy(function* (z: Lazy<number>) {
    for (const e of z) yield e + n;
  });

const mulN = (n: number) =>
  lazyfy(function* (z: Lazy<number>) {
    for (const e of z) yield e * n;
  });

const join = (sep: string) => (z: Lazy<string | number>) => {
  let result = "";
  for (const e of z) {
    if (result.length === 0) result += e;
    else result += sep + e;
  }
  return result;
};

describe("Pipe", () => {
  it("Arity 0 Forwards lazy", () => {
    const piped = pipe();
    const actual = piped(numbers);
    expect(actual).toBe(numbers);
  });
  it("Arity 1 Applies Operator", () => {
    const piped = pipe(addN(1));
    const expected = [1, 2, 3, 4, 5];
    const actual = [...piped(numbers)];
    expect(actual).toEqual(expected);
  });
  it("Arity N Combines Operator", () => {
    const piped = pipe(addN(1), mulN(2), addN(2));
    const expected = [4, 6, 8, 10, 12];
    const actual = [...piped(numbers)];
    expect(actual).toEqual(expected);
  });
});

describe("Pipe", () => {
  it("Arity 0 Reduces", () => {
    const spouted = spout()(join(","));
    const expected = "0,1,2,3,4";
    const actual = spouted(numbers);
    expect(actual).toEqual(expected);
  });
  it("Arity 1 Applies and Reduces", () => {
    const spouted = spout(addN(10))(join(" "));
    const expected = "10 11 12 13 14";
    const actual = spouted(numbers);
    expect(actual).toEqual(expected);
  });
  it("Arity N Combines, Applies, and Reduces", () => {
    const spouted = spout(mulN(2), addN(10))(join("-"));
    const expected = "10-12-14-16-18";
    const actual = spouted(numbers);
    expect(actual).toEqual(expected);
  });
});
