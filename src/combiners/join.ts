import { Lazy, Seed, Selector, Zipper } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { MemoKeyedIterator } from "../iterables/MemoKeyedIterator";

// This code is extremely similar to the group join, but when refactored, generates just as much code, but more confusing.
// Instead of implementing joins as a flat groupJoin with indirection, I opted for duplicated but readable code.
type ResultSelector<A, Ad, B, Bd, K, R> = (a: A | Ad, b: B | Bd, key: K) => R;

const nullSeed = () => null;

const invertSel =
  <A, Ad, B, Bd, K, R>(
    rSel: ResultSelector<A, Ad, B, Bd, K, R>
  ): ResultSelector<B, Bd, A, Ad, K, R> =>
  (b, a, key) =>
    rSel(a, b, key);

function* inner<A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  key: K,
  rSel: ResultSelector<A, never, B, never, K, R>
) {
  for (const a of za) for (const b of zb) yield rSel(a, b, key);
}

function* left<A, Bd, K, R>(
  za: Lazy<A>,
  seedB: Seed<Bd>,
  key: K,
  rSel: ResultSelector<A, never, never, Bd, K, R>
) {
  for (const a of za) yield rSel(a, seedB(), key);
}

function* right<Ad, B, K, R>(
  seedA: Seed<Ad>,
  zb: Lazy<B>,
  key: K,
  rSel: ResultSelector<never, Ad, B, never, K, R>
) {
  for (const b of zb) yield rSel(seedA(), b, key);
}

function* none() {}

interface JoinStrategy {
  inner: typeof inner;
  left: typeof left;
  right: typeof right;
}

const fullStrat: JoinStrategy = { inner, left, right };
const halfStrat: JoinStrategy = { inner, left, right: none };
const innerStrat: JoinStrategy = { inner, left: none, right: none };

function _universalJoin<A, Ad, B, Bd, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  seedA: Seed<Ad>,
  iterB: MemoKeyedIterator<B, K>,
  seedB: Seed<Bd>,
  rSel: ResultSelector<A, Ad, B, Bd, K, R>,
  key: K,
  strat: JoinStrategy
) {
  const zak = iterA.containsKey(key)
    ? lazyfy(() => iterA.iterateValues(key))
    : null;
  const zbk = iterB.containsKey(key)
    ? lazyfy(() => iterB.iterateValues(key))
    : null;

  if (zak) {
    if (zbk) {
      return strat.inner(zak, zbk, key, rSel);
    } else {
      return strat.left(zak, seedB, key, rSel);
    }
  } else {
    return strat.right(seedA, zbk!, key, rSel);
  }
}

function* _innerJoin<A, B, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  iterB: MemoKeyedIterator<B, K>,
  rSel: ResultSelector<A, never, B, never, K, R>
) {
  for (const key of iterA.iterateKeys())
    yield* _universalJoin(
      iterA,
      nullSeed as Seed<never>,
      iterB,
      nullSeed as Seed<never>,
      rSel,
      key,
      innerStrat
    );
}

function* _halfJoin<A, B, Bd, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  iterB: MemoKeyedIterator<B, K>,
  seedB: Seed<Bd>,
  rSel: ResultSelector<A, never, B, Bd, K, R>
) {
  for (const key of iterA.iterateKeys())
    yield* _universalJoin(
      iterA,
      nullSeed as Seed<never>,
      iterB,
      seedB,
      rSel,
      key,
      halfStrat
    );
}

function* _fullJoin<A, Ad, B, Bd, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  seedA: Seed<Ad>,
  iterB: MemoKeyedIterator<B, K>,
  seedB: Seed<Bd>,
  rSel: ResultSelector<A, Ad, B, Bd, K, R>
) {
  for (const key of iterA.iterateKeys())
    yield* _universalJoin(iterA, seedA, iterB, seedB, rSel, key, fullStrat);
  for (const key of iterB.iterateKeys())
    if (!iterA.containsKey(key))
      yield* _universalJoin(iterA, seedA, iterB, seedB, rSel, key, fullStrat);
}

export function join<A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, never, B, never, K, R>
) {
  const iterA = MemoKeyedIterator.FromLazy(za, selA);
  const iterB = MemoKeyedIterator.FromLazy(zb, selB);
  return lazyfy(() => _innerJoin(iterA, iterB, rSel));
}

export function leftJoinWithDefault<A, B, Bd, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultB: Seed<Bd>,
  rSel: ResultSelector<A, never, B, Bd, K, R>
) {
  const iterA = MemoKeyedIterator.FromLazy(za, selA);
  const iterB = MemoKeyedIterator.FromLazy(zb, selB);
  return lazyfy(() => _halfJoin(iterA, iterB, defaultB, rSel));
}

export const leftJoin = <A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, never, B, null, K, R>
) => leftJoinWithDefault(za, zb, selA, selB, nullSeed, rSel);

export const rightJoinWithDefault = <A, Ad, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultA: Seed<Ad>,
  rSel: ResultSelector<A, Ad, B, never, K, R>
) => leftJoinWithDefault(zb, za, selB, selA, defaultA, invertSel(rSel));

export const rightJoin = <A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, null, B, never, K, R>
) => leftJoinWithDefault(zb, za, selB, selA, nullSeed, invertSel(rSel));

export function fullJoinWithDefault<A, Ad, B, Bd, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultA: Seed<Ad>,
  defaultB: Seed<Bd>,
  rSel: ResultSelector<A, Ad, B, Bd, K, R>
) {
  const iterA = MemoKeyedIterator.FromLazy(za, selA);
  const iterB = MemoKeyedIterator.FromLazy(zb, selB);
  return lazyfy(() => _fullJoin(iterA, defaultA, iterB, defaultB, rSel));
}

export const fullJoin = <A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, null, B, null, K, R>
) => fullJoinWithDefault(za, zb, selA, selB, nullSeed, nullSeed, rSel);
