import {
  Gen,
  Lazy,
  LazyCombiner,
  LazyCombinerReducer,
  Selector,
} from "../coreTypes";
import { id } from "../funk/id";
import { lazyfy } from "../funk/lazyfy";
import { MemoKeyedIterator, repMemo } from "../iterables/MemoKeyedIterator";

function* _union<E, K>(
  iterA: MemoKeyedIterator<E, K>,
  iterB: MemoKeyedIterator<E, K>
): Gen<E> {
  for (const keyA of iterA.iterateKeys()) yield repMemo(iterA, keyA);
  for (const keyB of iterB.iterateKeys())
    if (!iterA.containsKey(keyB)) yield repMemo(iterB, keyB);
}

function* _intersection<E, K>(
  iterA: MemoKeyedIterator<E, K>,
  iterB: MemoKeyedIterator<E, K>
): Gen<E> {
  for (const keyA of iterA.iterateKeys())
    if (iterB.containsKey(keyA)) yield repMemo(iterA, keyA);
}

function* _diff<E, K>(
  iterA: MemoKeyedIterator<E, K>,
  iterB: MemoKeyedIterator<E, K>
): Gen<E> {
  for (const keyA of iterA.iterateKeys())
    if (!iterB.containsKey(keyA)) yield repMemo(iterA, keyA);
}

interface SetOperations<E> {
  union: Lazy<E>;
  intersection: Lazy<E>;
  aMinusB: Lazy<E>;
  bMinusA: Lazy<E>;
}

export const setOperationsBy =
  <E, K>(sel: Selector<E, K>): LazyCombinerReducer<E, E, SetOperations<E>> =>
  (zb) => {
    const iterB = MemoKeyedIterator.FromLazy(zb, sel);
    return (za) => {
      const iterA = MemoKeyedIterator.FromLazy(za, sel);
      return {
        union: lazyfy(_union)(iterA, iterB),
        intersection: lazyfy(_intersection)(iterA, iterB),
        aMinusB: lazyfy(_diff)(iterA, iterB),
        bMinusA: lazyfy(_diff)(iterB, iterA),
      };
    };
  };

export const setOperations = setOperationsBy(id);

const setOpBy =
  <E, K>(
    setOp: (
      iterA: MemoKeyedIterator<E, K>,
      iterB: MemoKeyedIterator<E, K>
    ) => Gen<E>
  ) =>
  (sel: Selector<E, K>): LazyCombiner<E, E, E> =>
  (zb) => {
    const iterB = MemoKeyedIterator.FromLazy(zb, sel);
    return (za) => {
      const iterA = MemoKeyedIterator.FromLazy(za, sel);
      return lazyfy(setOp)(iterA, iterB);
    };
  };

export const unionBy = setOpBy(_union);
export const union = unionBy(id);

export const intersectionBy = setOpBy(_intersection);
export const intersection = intersectionBy(id);

export const differenceBy = setOpBy(_diff);
export const difference = differenceBy(id);
