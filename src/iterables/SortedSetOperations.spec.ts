import { Lazy } from "../coreTypes";
import { cmpNum } from "../funk/comparators";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { asSorted } from "../operators/sort";
import { SortedSetOperations } from "./SortedSetOperations";

const asCmpNumSorted = asSorted(cmpNum);

describe("Sorted Set Operations Iterator", () => {
  const iterOnce = <E>(z: Lazy<E>) => {
    let itered = false;
    return lazyfy(() => {
      if (itered) throw new Error("Iterated more that once");
      itered = true;
      return nrgz(z);
    })();
  };

  it("Iterates all values", () => {
    const numbersA = asCmpNumSorted([0, 1, 2]);
    const numbersB = asCmpNumSorted([1, 2, 3]);
    const ops = SortedSetOperations.FromSorted(numbersA, numbersB);
    const expected = [0, 1, 2, 3];
    const actual = [...ops.iter("full")];
    expect(actual).toEqual(expected);
  });

  it("Iterates Minimally", () => {
    const numbersA = asCmpNumSorted(iterOnce([0, 1, 2]));
    const numbersB = asCmpNumSorted(iterOnce([1, 2, 3]));
    const ops = SortedSetOperations.FromSorted(numbersA, numbersB);

    const expected = [0, 1, 2, 3];
    const actual = [...ops.iter("full")];
    expect(actual).toEqual(expected);
    expect(() => [...numbersA]).toThrow();
  });
});
