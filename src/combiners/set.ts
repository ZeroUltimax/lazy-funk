import { Gen, Lazy, Selector } from "../coreTypes";
import { id } from "../funk/id";
import { lazyfy } from "../funk/lazyfy";
import { MemoKeyedIterator, repMemo } from "../iterables/MemoKeyedIterator";

// A type that takes two generic parameters A and B, who extends a third E and returns and array that can be any combination of A and B.
// The result type needs to be inferred from the the actual instance of the type.
function* _union<E, A extends E, B extends E, K>(
  iterA: MemoKeyedIterator<E, A, K>,
  iterB: MemoKeyedIterator<E, B, K>
): Gen<A | B> {
  for (const keyA of iterA.iterateKeys()) yield repMemo(iterA, keyA);
  for (const keyB of iterB.iterateKeys())
    if (!iterA.containsKey(keyB)) yield repMemo(iterB, keyB);
}

function* _intersection<E, A extends E, B extends E, K>(
  iterA: MemoKeyedIterator<E, A, K>,
  iterB: MemoKeyedIterator<E, B, K>
): Gen<A> {
  for (const keyA of iterA.iterateKeys())
    if (iterB.containsKey(keyA)) yield repMemo(iterA, keyA) as A;
}

function* _diff<E, A extends E, B extends E, K>(
  iterA: MemoKeyedIterator<E, A, K>,
  iterB: MemoKeyedIterator<E, B, K>
): Gen<A> {
  for (const keyA of iterA.iterateKeys())
    if (!iterB.containsKey(keyA)) yield repMemo(iterA, keyA);
}

function* _xor<E, A extends E, B extends E, K>(
  iterA: MemoKeyedIterator<E, A, K>,
  iterB: MemoKeyedIterator<E, B, K>
): Gen<A | B> {
  for (const keyA of iterA.iterateKeys())
    if (!iterB.containsKey(keyA)) yield repMemo(iterA, keyA);
  for (const keyB of iterB.iterateKeys())
    if (!iterA.containsKey(keyB)) yield repMemo(iterB, keyB);
}

interface SetOperations<E, A extends E, B extends E> {
  union: Lazy<A | B>;
  intersection: Lazy<A>;
  aMinusB: Lazy<A>;
  bMinusA: Lazy<B>;
  xor: Lazy<A | B>;
}

export const setOperationsBy =
  <E, K>(sel: Selector<E, K>) =>
  <B extends E>(zb: Lazy<B>) => {
    const iterB = MemoKeyedIterator.FromLazy(zb, sel);
    return <A extends E>(za: Lazy<A>): SetOperations<E, A, B> => {
      const iterA = MemoKeyedIterator.FromLazy(za, sel);
      return {
        union: lazyfy(_union)(iterA, iterB),
        intersection: lazyfy(_intersection)(iterA, iterB),
        aMinusB: lazyfy(_diff)(iterA, iterB),
        bMinusA: lazyfy(_diff)(iterB, iterA),
        xor: lazyfy(_xor)(iterA, iterB),
      };
    };
  };

export const setOperations = setOperationsBy(id);

const setOpBy =
  // Note: I had a hard time getting the type inference to work here.
  // I would like to be able to infer the return type of the setOp function,
  // but this seemed overly convuluted


    <R extends 1 | 2>(
      setOp: <E, A extends E, B extends E, K>(
        iterA: MemoKeyedIterator<E, A, K>,
        iterB: MemoKeyedIterator<E, B, K>
      ) => Gen<E>
    ) =>
    <E, K>(sel: Selector<E, K>) =>
    <B extends E>(zb: Lazy<B>) => {
      const iterB = MemoKeyedIterator.FromLazy(zb, sel);
      return <A extends E>(za: Lazy<A>): Gen<R extends 1 ? A : A | B> => {
        const iterA = MemoKeyedIterator.FromLazy(za, sel);
        return lazyfy(setOp)(iterA, iterB) as Gen<R extends 1 ? A : A | B>;
      };
    };

export const unionBy = setOpBy<2>(_union);
export const union = unionBy(id);

export const intersectionBy = setOpBy<1>(_intersection);
export const intersection = intersectionBy(id);

export const differenceBy = setOpBy<1>(_diff);
export const difference = differenceBy(id);

export const xorBy = setOpBy(_xor);
export const xor = xorBy(id);
