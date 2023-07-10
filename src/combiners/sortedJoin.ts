import { Gen, Lazy, Seed, Sorted } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import {
  sortedGroupJoin,
  sortedLeftGroupJoin,
  sortedFullGroupJoin,
} from "./sortedGroupJoin";

type SortedResultSelector<E, Ad, Bd, R> = (a: E | Ad, b: E | Bd) => R;

const nullSeed = () => null;

const invertSel =
  <E, Ad, Bd, R>(
    rSel: SortedResultSelector<E, Ad, Bd, R>
  ): SortedResultSelector<E, Bd, Ad, R> =>
  (b, a) =>
    rSel(a, b);

interface RawGroupResult<E, Ad, Bd> {
  a: Lazy<E> | Ad;
  b: Lazy<E> | Bd;
}

function rawGroupSelector<E, Ad, Bd>(
  a: Lazy<E> | Ad,
  b: Lazy<E> | Bd
): RawGroupResult<E, Ad, Bd> {
  return { a, b };
}

function* _sortedJoin<E, R>(
  zg: Lazy<RawGroupResult<E, never, never>>,
  rSel: SortedResultSelector<E, never, never, R>
): Gen<R> {
  for (const g of zg)
    for (const a of g.a) for (const b of g.b) yield rSel(a, b);
}

export function sortedJoin<E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedResultSelector<E, never, never, R>
) {
  const zg = sortedGroupJoin(sza, szb, rawGroupSelector<E, never, never>);
  return lazyfy(_sortedJoin)(zg, rSel);
}

function* _sortedLeftJoin<E, Bd, R>(
  zg: Lazy<RawGroupResult<E, never, null>>,
  defaultB: Seed<Bd>,
  rSel: SortedResultSelector<E, never, Bd, R>
): Gen<R> {
  for (const g of zg)
    for (const a of g.a)
      if (g.b) for (const b of g.b) yield rSel(a, b);
      else yield rSel(a, defaultB());
}

export function sortedLeftJoinWithDefault<E, Bd, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  defaultB: Seed<Bd>,
  rSel: SortedResultSelector<E, never, Bd, R>
) {
  const zg = sortedLeftGroupJoin(sza, szb, rawGroupSelector<E, never, null>);
  return lazyfy(_sortedLeftJoin)(zg, defaultB, rSel);
}

export const sortedLeftJoin = <E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedResultSelector<E, never, null, R>
) => sortedLeftJoinWithDefault(sza, szb, nullSeed, rSel);

export const sortedRightJoinWithDefault = <E, Ad, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  defaultA: Seed<Ad>,
  rSel: SortedResultSelector<E, Ad, never, R>
) => sortedLeftJoinWithDefault(szb, sza, defaultA, invertSel(rSel));

export const sortedRightJoin = <E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedResultSelector<E, null, never, R>
) => sortedLeftJoinWithDefault(szb, sza, nullSeed, invertSel(rSel));

function* _sortedFullJoin<E, Ad, Bd, R>(
  zg: Lazy<RawGroupResult<E, null, null>>,
  defaultA: Seed<Ad>,
  defaultB: Seed<Bd>,
  rSel: SortedResultSelector<E, Ad, Bd, R>
): Gen<R> {
  for (const g of zg)
    if (g.a)
      for (const a of g.a)
        if (g.b) for (const b of g.b) yield rSel(a, b);
        else yield rSel(a, defaultB());
    else for (const b of g.b!) yield rSel(defaultA(), b);
}

export function sortedFullJoinWithDefault<E, Ad, Bd, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  defaultA: Seed<Ad>,
  defaultB: Seed<Bd>,
  rSel: SortedResultSelector<E, Ad, Bd, R>
) {
  const zg = sortedFullGroupJoin(sza, szb, rawGroupSelector<E, null, null>);
  return lazyfy(_sortedFullJoin)(zg, defaultA, defaultB, rSel);
}

export const sortedFullJoin = <E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedResultSelector<E, null, null, R>
) => sortedFullJoinWithDefault(sza, szb, nullSeed, nullSeed, rSel);
