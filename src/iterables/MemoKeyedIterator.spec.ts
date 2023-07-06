import { Lazy } from "../coreTypes";
import { id } from "../funk/id";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { MemoKeyedIterator } from "./MemoKeyedIterator";

describe("Memo Keyed Iterator", () => {
  const iterOnce = <E>(z: Lazy<E>) => {
    let itered = false;
    return lazyfy(() => {
      if (itered) throw new Error("Iterated more that once");
      itered = true;
      return nrgz(z);
    });
  };

  const numbers = [0, 1, 2, 3, 4, 5];
  const sel = (n: number) => n % 3 | 0;

  it("Finds all keys", () => {
    const iterable = MemoKeyedIterator.FromLazy(numbers, sel);
    const expected = [0, 1, 2];
    const actual = [...iterable.iterateKeys()];
    expect(actual).toEqual(expected);
  });

  it("Iterates existing key", () => {
    const iter = MemoKeyedIterator.FromLazy(numbers, sel);
    const key = 2;
    const expected = [2, 5];
    const actual = [...iter.iterateValues(key)];
    expect(actual).toEqual(expected);
  });

  it("Hands out iterators to non-existant keys", () => {
    const iter = MemoKeyedIterator.FromLazy(numbers, sel);
    const key = -1;
    const expected: number[] = [];
    const actual = [...iter.iterateValues(key)];
    expect(actual).toEqual(expected);
  });

  it("Iterates numbers only once", () => {
    const iter = MemoKeyedIterator.FromLazy(iterOnce(numbers), sel);
    const allKeys = [...iter.iterateKeys()];
    expect(() => [...iter.iterateKeys()]).not.toThrow();
  });

  it("Gives order-independant iterables", () => {
    const iter = MemoKeyedIterator.FromLazy(numbers, sel);

    const expected = [
      [2, 5],
      [0, 3],
      [1, 4],
      [1, 4],
      [0, 3],
      [2, 5],
    ];

    const it00 = iter.iterateValues(0);
    const it01 = iter.iterateValues(0);
    const it10 = iter.iterateValues(1);
    const it11 = iter.iterateValues(1);
    const it20 = iter.iterateValues(2);
    const it21 = iter.iterateValues(2);
    const vals20 = [...it20];
    const vals00 = [...it00];
    const vals10 = [...it10];
    const vals11 = [...it11];
    const vals01 = [...it01];
    const vals21 = [...it21];

    const actual = [vals20, vals00, vals10, vals11, vals01, vals21];

    expect(actual).toEqual(expected);
  });

  it("Iterates Minimally", () => {
    const ops = MemoKeyedIterator.FromLazy([-1, 0, 1, 2], id);
    const it = (ops as any).it;
    expect(it).not.toBeUndefined();
    const containsKey1 = ops.containsKey(1);
    const nxb = it.next();
    expect(nxb.done).toEqual(false);
    expect(nxb.value).toEqual(2);
  });
});
