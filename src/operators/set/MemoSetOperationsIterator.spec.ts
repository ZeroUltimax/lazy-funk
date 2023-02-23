import { Lazy } from "../../coreTypes";
import { id } from "../../funk/id";
import { lazyfy } from "../../funk/lazyfy";
import { nrgz } from "../../funk/nrgz";
import { MemoSetOperationsIterator } from "./MemoSetOperationsIterator";

describe("MemoSetOperationsIterator", () => {
  const iterOnce = <E>(z: Lazy<E>) => {
    let itered = false;
    return lazyfy(() => {
      if (itered) throw new Error("Iterated more that once");
      itered = true;
      return nrgz(z);
    });
  };

  it("Produces set results", () => {
    const a = [0, 1, 2, 3];
    const b = [2, 3, 4, 5];
    const aDiffB = [0, 1];
    const intersect = [2, 3];
    const bDiffA = [4, 5];
    const union = [0, 1, 2, 3, 4, 5];

    const ops = MemoSetOperationsIterator.FromLazy(a, b, id);
    const actualADiffB = [...ops.iterateDiff()];
    const actualIntersect = [...ops.iterateIntersection()];
    const actualBDiffA = [...ops.iterateInverseDiff()];
    const actualUnion = [...ops.iterateUnion()];
    expect(actualADiffB).toEqual(aDiffB);
    expect(actualIntersect).toEqual(intersect);
    expect(actualBDiffA).toEqual(bDiffA);
    expect(actualUnion).toEqual(union);
  });

  it("Iterates only once", () => {
    const ops = MemoSetOperationsIterator.FromLazy(
      iterOnce([1, 2, 3]),
      iterOnce([4, 5, 6]),
      id
    );

    const once = [...ops.iterateUnion()];
    expect(() => ops.iterateUnion()).not.toThrow();
  });

  it("Iterates Minimally", () => {
    const ita = nrgz([0, 1]);
    const itb = nrgz([-1, 0, 1, 2]);
    const ops = new MemoSetOperationsIterator(ita, itb, id);
    const intersection = [...ops.iterateIntersection()];
    const nxb = itb.next();
    expect(nxb.done).toEqual(false);
    expect(nxb.value).toEqual(2);
  });

  it("Returns elements of First preferentially", () => {
    const objA = [
      { code: 0, value: "a" },
      { code: 1, value: "b" },
    ];
    const objB = [
      { code: 1, value: "x" },
      { code: 2, value: "y" },
    ];
    const selCode = (x: any) => x.code;
    const ops = MemoSetOperationsIterator.FromLazy(objA, objB, selCode);
    const union = [...ops.iterateUnion()];

    expect(union[0]).toBe(objA[0]);
    expect(union[1]).toBe(objA[1]);
    expect(union[2]).toBe(objB[1]);
  });
});
