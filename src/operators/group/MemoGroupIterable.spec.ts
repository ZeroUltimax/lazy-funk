import { lazyfy } from "../../funk/lazyfy";
import { MemoGroupIterable } from "./MemoGroupIterable";

describe("MemoGroupIterator", () => {
  const numbers = () => {
    let called = false;
    return lazyfy(function* () {
      if (called) throw new Error("Iterated more than once");
      called = true;
      yield* [0, 1, 2, 3, 4, 5];
    });
  };
  const sel = (n: number) => n % 3 | 0;

  it("Groups by key", () => {
    const grps = MemoGroupIterable.FromLazy(numbers(), sel);
    const actual: [number, number[]][] = [];
    for (const grp of grps) {
      actual.push([grp.key, [...grp]]);
    }
    const expected = [
      [0, [0, 3]],
      [1, [1, 4]],
      [2, [2, 5]],
    ];
    expect(actual).toEqual(expected);
  });

  it("Hands out iterators to existing keys", () => {
    const grps = MemoGroupIterable.FromLazy(numbers(), sel);
    const key = 2;
    const expected = [2, 5];
    const actual = [...grps.iterateValues(key)];
    expect(actual).toEqual(expected);
  });

  it("Hands out iterators to non-existant keys", () => {
    const grps = MemoGroupIterable.FromLazy(numbers(), sel);
    const key = -1;
    const expected: number[] = [];
    const actual = [...grps.iterateValues(key)];
    expect(actual).toEqual(expected);
  });

  it("Gives order-independant iterables", () => {
    const grps = MemoGroupIterable.FromLazy(numbers(), sel);
    const [iter0, iter1, iter2] = [...grps];
    const grp20 = [...iter2];
    const grp00 = [...iter0];
    const grp10 = [...iter1];
    const grp11 = [...iter1];
    const grp01 = [...iter0];
    const grp21 = [...iter2];

    const actual = [grp20, grp00, grp10, grp11, grp01, grp21];
    const expected = [
      [2, 5],
      [0, 3],
      [1, 4],
      [1, 4],
      [0, 3],
      [2, 5],
    ];

    expect(actual).toEqual(expected);
  });
});
