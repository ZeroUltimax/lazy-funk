import { Gen, LazyCombiner, Seed, Selector } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { nullSeed } from "../funk/seed";
import { lazyValues, MemoKeyedIterator } from "../iterables/MemoKeyedIterator";
import { GroupResultSelector, invSel } from "./_selectors";

function* _innerGroupJoin<A, B, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  iterB: MemoKeyedIterator<B, K>,
  rSel: GroupResultSelector<A, never, B, never, K, R>
): Gen<R> {
  for (const key of iterA.iterateKeys())
    if (iterB.containsKey(key))
      yield rSel(lazyValues(iterA, key), lazyValues(iterB, key), key);
}

function* _halfGroupJoin<A, B, Bd, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  iterB: MemoKeyedIterator<B, K>,
  seedB: Seed<Bd>,
  rSel: GroupResultSelector<A, never, B, Bd, K, R>
): Gen<R> {
  for (const key of iterA.iterateKeys())
    if (iterB.containsKey(key))
      yield rSel(lazyValues(iterA, key), lazyValues(iterB, key), key);
    else yield rSel(lazyValues(iterA, key), seedB(), key);
}

function* _fullGroupJoin<A, Ad, B, Bd, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  seedA: Seed<Ad>,
  iterB: MemoKeyedIterator<B, K>,
  seedB: Seed<Bd>,
  rSel: GroupResultSelector<A, Ad, B, Bd, K, R>
): Gen<R> {
  for (const key of iterA.iterateKeys())
    if (iterB.containsKey(key))
      yield rSel(lazyValues(iterA, key), lazyValues(iterB, key), key);
    else yield rSel(lazyValues(iterA, key), seedB(), key);

  for (const key of iterB.iterateKeys())
    if (!iterA.containsKey(key))
      yield rSel(seedA(), lazyValues(iterB, key), key);
}

export const groupJoin =
  <A, B, K, R>(
    selA: Selector<A, K>,
    selB: Selector<B, K>,
    rSel: GroupResultSelector<A, never, B, never, K, R>
  ): LazyCombiner<A, B, R> =>
  (zb) => {
    const iterB = MemoKeyedIterator.FromLazy(zb, selB);
    return (za) => {
      const iterA = MemoKeyedIterator.FromLazy(za, selA);
      return lazyfy(_innerGroupJoin)(iterA, iterB, rSel);
    };
  };

export const leftGroupJoinWithDefault =
  <A, B, Bd, K, R>(
    selA: Selector<A, K>,
    selB: Selector<B, K>,
    defaultB: Seed<Bd>,
    rSel: GroupResultSelector<A, never, B, Bd, K, R>
  ): LazyCombiner<A, B, R> =>
  (zb) => {
    const iterB = MemoKeyedIterator.FromLazy(zb, selB);
    return (za) => {
      const iterA = MemoKeyedIterator.FromLazy(za, selA);
      return lazyfy(_halfGroupJoin)(iterA, iterB, defaultB, rSel);
    };
  };
export const leftGroupJoin = <A, B, K, R>(
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: GroupResultSelector<A, never, B, null, K, R>
) => leftGroupJoinWithDefault(selA, selB, nullSeed, rSel);
export const rightGroupJoinWithDefault =
  <A, Ad, B, K, R>(
    selA: Selector<A, K>,
    selB: Selector<B, K>,
    defaultA: Seed<Ad>,
    rSel: GroupResultSelector<A, Ad, B, never, K, R>
  ): LazyCombiner<A, B, R> =>
  (zb) =>
  (za) =>
    leftGroupJoinWithDefault(selB, selA, defaultA, invSel(rSel))(za)(zb);

export const rightGroupJoin =
  <A, B, K, R>(
    selA: Selector<A, K>,
    selB: Selector<B, K>,
    rSel: GroupResultSelector<A, null, B, never, K, R>
  ): LazyCombiner<A, B, R> =>
  (zb) =>
  (za) =>
    leftGroupJoinWithDefault(selB, selA, nullSeed, invSel(rSel))(za)(zb);

export const fullGroupJoinWithDefault =
  <A, Ad, B, Bd, K, R>(
    selA: Selector<A, K>,
    selB: Selector<B, K>,
    defaultA: Seed<Ad>,
    defaultB: Seed<Bd>,
    rSel: GroupResultSelector<A, Ad, B, Bd, K, R>
  ): LazyCombiner<A, B, R> =>
  (zb) => {
    const iterB = MemoKeyedIterator.FromLazy(zb, selB);
    return (za) => {
      const iterA = MemoKeyedIterator.FromLazy(za, selA);
      return lazyfy(_fullGroupJoin)(iterA, defaultA, iterB, defaultB, rSel);
    };
  };
export const fullGroupJoin = <A, B, K, R>(
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: GroupResultSelector<A, null, B, null, K, R>
) => fullGroupJoinWithDefault(selA, selB, nullSeed, nullSeed, rSel);
