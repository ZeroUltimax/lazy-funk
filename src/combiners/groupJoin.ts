import { Lazy, Seed, Selector, Zipper } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { lazyValues, MemoKeyedIterator } from "../iterables/MemoKeyedIterator";

type GroupResultSelector<A, Ad, B, Bd, K, R> = (
  a: Lazy<A> | Ad,
  b: Lazy<B> | Bd,
  key: K
) => R;

const nullSeed = () => null;

const invertSel =
  <A, Ad, B, Bd, K, R>(
    rSel: GroupResultSelector<A, Ad, B, Bd, K, R>
  ): GroupResultSelector<B, Bd, A, Ad, K, R> =>
  (b, a, key) =>
    rSel(a, b, key);

function* _innerGroupJoin<A, B, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  iterB: MemoKeyedIterator<B, K>,
  rSel: GroupResultSelector<A, never, B, never, K, R>
) {
  for (const key of iterA.iterateKeys())
    if (iterB.containsKey(key))
      yield rSel(lazyValues(iterA, key), lazyValues(iterB, key), key);
}

function* _halfGroupJoin<A, B, Bd, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  iterB: MemoKeyedIterator<B, K>,
  seedB: Seed<Bd>,
  rSel: GroupResultSelector<A, never, B, Bd, K, R>
) {
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
) {
  for (const key of iterA.iterateKeys())
    if (iterB.containsKey(key))
      yield rSel(lazyValues(iterA, key), lazyValues(iterB, key), key);
    else yield rSel(lazyValues(iterA, key), seedB(), key);

  for (const key of iterB.iterateKeys())
    if (!iterA.containsKey(key))
      yield rSel(seedA(), lazyValues(iterB, key), key);
}

export function groupJoin<A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: GroupResultSelector<A, never, B, never, K, R>
) {
  const iterA = MemoKeyedIterator.FromLazy(za, selA);
  const iterB = MemoKeyedIterator.FromLazy(zb, selB);
  return lazyfy(() => _innerGroupJoin(iterA, iterB, rSel));
}

export function leftGroupJoinWithDefault<A, B, Bd, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultB: Seed<Bd>,
  rSel: GroupResultSelector<A, never, B, Bd, K, R>
) {
  const iterA = MemoKeyedIterator.FromLazy(za, selA);
  const iterB = MemoKeyedIterator.FromLazy(zb, selB);
  return lazyfy(() => _halfGroupJoin(iterA, iterB, defaultB, rSel));
}

export const leftGroupJoin = <A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: GroupResultSelector<A, never, B, null, K, R>
) => leftGroupJoinWithDefault(za, zb, selA, selB, nullSeed, rSel);

export const rightGroupJoinWithDefault = <A, Ad, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultA: Seed<Ad>,
  rSel: GroupResultSelector<A, Ad, B, never, K, R>
) => leftGroupJoinWithDefault(zb, za, selB, selA, defaultA, invertSel(rSel));

export const rightGroupJoin = <A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: GroupResultSelector<A, null, B, never, K, R>
) => leftGroupJoinWithDefault(zb, za, selB, selA, nullSeed, invertSel(rSel));

export function fullGroupJoinWithDefault<A, Ad, B, Bd, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultA: Seed<Ad>,
  defaultB: Seed<Bd>,
  rSel: GroupResultSelector<A, Ad, B, Bd, K, R>
) {
  const iterA = MemoKeyedIterator.FromLazy(za, selA);
  const iterB = MemoKeyedIterator.FromLazy(zb, selB);
  return lazyfy(() => _fullGroupJoin(iterA, defaultA, iterB, defaultB, rSel));
}

export const fullGroupJoin = <A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: GroupResultSelector<A, null, B, null, K, R>
) => fullGroupJoinWithDefault(za, zb, selA, selB, nullSeed, nullSeed, rSel);
