import { Lazy, Seed, Selector, Zipper } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { MemoKeyedIterator } from "../iterables/MemoKeyedIterator";

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

function* innerGroup<A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  key: K,
  rSel: GroupResultSelector<A, never, B, never, K, R>
) {
  yield rSel(za, zb, key);
}

function* leftGroup<A, Bd, K, R>(
  za: Lazy<A>,
  seedB: Seed<Bd>,
  key: K,
  rSel: GroupResultSelector<A, never, never, Bd, K, R>
) {
  yield rSel(za, seedB(), key);
}

function* rightGroup<Ad, B, K, R>(
  seedA: Seed<Ad>,
  zb: Lazy<B>,
  key: K,
  rSel: GroupResultSelector<never, Ad, B, never, K, R>
) {
  yield rSel(seedA(), zb, key);
}

function* none() {}

interface JoinStrategy {
  innerGroup: typeof innerGroup;
  leftGroup: typeof leftGroup;
  rightGroup: typeof rightGroup;
}

const fullStrat: JoinStrategy = {
  innerGroup,
  leftGroup,
  rightGroup,
};
const halfStrat: JoinStrategy = {
  innerGroup,
  leftGroup,
  rightGroup: none,
};
const innerStrat: JoinStrategy = {
  innerGroup,
  leftGroup: none,
  rightGroup: none,
};

function _universalGroupJoin<A, Ad, B, Bd, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  seedA: Seed<Ad>,
  iterB: MemoKeyedIterator<B, K>,
  seedB: Seed<Bd>,
  rSel: GroupResultSelector<A, Ad, B, Bd, K, R>,
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
      return strat.innerGroup(zak, zbk, key, rSel);
    } else {
      return strat.leftGroup(zak, seedB, key, rSel);
    }
  } else {
    return strat.rightGroup(seedA, zbk!, key, rSel);
  }
}

function* _innerGroupJoin<A, B, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  iterB: MemoKeyedIterator<B, K>,
  rSel: GroupResultSelector<A, never, B, never, K, R>
) {
  for (const key of iterA.iterateKeys())
    yield* _universalGroupJoin(
      iterA,
      nullSeed as Seed<never>,
      iterB,
      nullSeed as Seed<never>,
      rSel,
      key,
      innerStrat
    );
}

function* _halfGroupJoin<A, B, Bd, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  iterB: MemoKeyedIterator<B, K>,
  seedB: Seed<Bd>,
  rSel: GroupResultSelector<A, never, B, Bd, K, R>
) {
  for (const key of iterA.iterateKeys())
    yield* _universalGroupJoin(
      iterA,
      nullSeed as Seed<never>,
      iterB,
      seedB,
      rSel,
      key,
      halfStrat
    );
}

function* _fullGroupJoin<A, Ad, B, Bd, K, R>(
  iterA: MemoKeyedIterator<A, K>,
  seedA: Seed<Ad>,
  iterB: MemoKeyedIterator<B, K>,
  seedB: Seed<Bd>,
  rSel: GroupResultSelector<A, Ad, B, Bd, K, R>
) {
  for (const key of iterA.iterateKeys())
    yield* _universalGroupJoin(
      iterA,
      seedA,
      iterB,
      seedB,
      rSel,
      key,
      fullStrat
    );
  for (const key of iterB.iterateKeys())
    if (!iterA.containsKey(key))
      yield* _universalGroupJoin(
        iterA,
        seedA,
        iterB,
        seedB,
        rSel,
        key,
        fullStrat
      );
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
