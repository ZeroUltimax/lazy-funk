import { Gen, Lazy, Seed, Sorted, SortedCombiner } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { nullSeed } from "../funk/seed";
import {
  RawSortGroup,
  SortedResultSelector,
  invSortSel,
  rawSortSel,
} from "./_selectors";
import {
  sortedGroupJoin,
  sortedLeftGroupJoin,
  sortedFullGroupJoin,
} from "./sortedGroupJoin";

function* _sortedJoin<E, R>(
  zg: Lazy<RawSortGroup<E, never, never>>,
  rSel: SortedResultSelector<E, never, never, R>
): Gen<R> {
  for (const g of zg)
    for (const a of g.a) for (const b of g.b) yield rSel(a, b);
}

export const sortedJoin =
  <E, R>(
    rSel: SortedResultSelector<E, never, never, R>
  ): SortedCombiner<E, E, R> =>
  (szb) =>
  (sza) =>
    lazyfy(_sortedJoin)(
      sortedGroupJoin(rawSortSel<E, never, never>)(szb)(sza),
      rSel
    );

function* _sortedLeftJoin<E, Bd, R>(
  zg: Lazy<RawSortGroup<E, never, null>>,
  defaultB: Seed<Bd>,
  rSel: SortedResultSelector<E, never, Bd, R>
): Gen<R> {
  for (const g of zg)
    for (const a of g.a)
      if (g.b) for (const b of g.b) yield rSel(a, b);
      else yield rSel(a, defaultB());
}

export const sortedLeftJoinWithDefault =
  <E, Bd, R>(
    defaultB: Seed<Bd>,
    rSel: SortedResultSelector<E, never, Bd, R>
  ): SortedCombiner<E, E, R> =>
  (szb) =>
  (sza) =>
    lazyfy(_sortedLeftJoin)(
      sortedLeftGroupJoin(rawSortSel<E, never, null>)(szb)(sza),
      defaultB,
      rSel
    );
export const sortedLeftJoin = <E, R>(
  rSel: SortedResultSelector<E, never, null, R>
) => sortedLeftJoinWithDefault(nullSeed, rSel);

export const sortedRightJoinWithDefault =
  <E, Ad, R>(
    defaultA: Seed<Ad>,
    rSel: SortedResultSelector<E, Ad, never, R>
  ): SortedCombiner<E, E, R> =>
  (szb) =>
  (sza) =>
    sortedLeftJoinWithDefault(defaultA, invSortSel(rSel))(sza)(szb);
export const sortedRightJoin =
  <E, R>(
    rSel: SortedResultSelector<E, null, never, R>
  ): SortedCombiner<E, E, R> =>
  (szb) =>
  (sza) =>
    sortedLeftJoinWithDefault(nullSeed, invSortSel(rSel))(sza)(szb);

function* _sortedFullJoin<E, Ad, Bd, R>(
  zg: Lazy<RawSortGroup<E, null, null>>,
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

export const sortedFullJoinWithDefault =
  <E, Ad, Bd, R>(
    defaultA: Seed<Ad>,
    defaultB: Seed<Bd>,
    rSel: SortedResultSelector<E, Ad, Bd, R>
  ): SortedCombiner<E, E, R> =>
  (szb) =>
  (sza) =>
    lazyfy(_sortedFullJoin)(
      sortedFullGroupJoin(rawSortSel<E, null, null>)(szb)(sza),
      defaultA,
      defaultB,
      rSel
    );
export const sortedFullJoin = <E, R>(
  rSel: SortedResultSelector<E, null, null, R>
) => sortedFullJoinWithDefault(nullSeed, nullSeed, rSel);
