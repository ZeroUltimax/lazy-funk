import { Lazy, Seed, Selector, Zipper } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { MemoKeyedIterator } from "../iterables/MemoKeyedIterator";

type ResultSelector<A, B, R> = Zipper<A, B, R>;

const nullSeed = () => null;

function* inner<A, B, R>(
  zA: Lazy<A>,
  zB: Lazy<B>,
  rSel: ResultSelector<A, B, R>
) {
  for (const a of zA) for (const b of zB) yield rSel(a, b);
}

function* left<A, Bd, R>(
  zA: Lazy<A>,
  seedB: Seed<Bd>,
  rSel: ResultSelector<A, Bd, R>
) {
  for (const a of zA) yield rSel(a, seedB());
}

function* right<Ad, B, R>(
  seedA: Seed<Ad>,
  zB: Lazy<B>,
  rSel: ResultSelector<Ad, B, R>
) {
  for (const b of zB) yield rSel(seedA(), b);
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
  rSel: ResultSelector<A | Ad, B | Bd, R>,
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
      return strat.inner(zak, zbk, rSel);
    } else {
      return strat.left(zak, seedB, rSel);
    }
  } else {
    return strat.right(seedA, zbk!, rSel);
  }
}

function* _innerJoin<A, B, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  iterB: MemoKeyedIterator<B, K>,
  rSel: ResultSelector<A, B, R>
) {
  for (const key of iterA.iterateKeys())
    yield* _universalJoin(
      iterA,
      nullSeed as Seed<A>,
      iterB,
      nullSeed as Seed<B>,
      rSel,
      key,
      innerStrat
    );
}

function* _halfJoin<A, B, Bd, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  iterB: MemoKeyedIterator<B, K>,
  seedB: Seed<Bd>,
  rSel: ResultSelector<A, B | Bd, R>
) {
  for (const key of iterA.iterateKeys())
    yield* _universalJoin(
      iterA,
      nullSeed as Seed<A>,
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
  rSel: ResultSelector<A | Ad, B | Bd, R>
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
  rSel: ResultSelector<A, B, R>
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
  rSel: ResultSelector<A, B | Bd, R>
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
  rSel: ResultSelector<A, B | null, R>
) => leftJoinWithDefault(za, zb, selA, selB, nullSeed, rSel);

export const rightJoinWithDefault = <A, Ad, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultA: Seed<Ad>,
  rSel: ResultSelector<A | Ad, B, R>
) =>
  leftJoinWithDefault(zb, za, selB, selA, defaultA, (b: B, a: A | Ad) =>
    rSel(a, b)
  );

export const rightJoin = <A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A | null, B, R>
) =>
  leftJoinWithDefault(zb, za, selB, selA, nullSeed, (b: B, a: A | null) =>
    rSel(a, b)
  );

export function fullJoinWithDefault<A, Ad, B, Bd, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultA: Seed<Ad>,
  defaultB: Seed<Bd>,
  rSel: ResultSelector<A | Ad, B | Bd, R>
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
  rSel: ResultSelector<A | null, B | null, R>
) => fullJoinWithDefault(za, zb, selA, selB, nullSeed, nullSeed, rSel);
