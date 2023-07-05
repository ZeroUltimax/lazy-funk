import { Lazy, Seed, Selector, Sorted, Zipper } from "../coreTypes";
import { lazyfy, lazyfyFunk } from "../funk/lazyfy";
import { throws } from "../funk/throws";
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

function rawGroupSelector<A, Ad, B, Bd>(a: Lazy<A> | Ad, b: Lazy<B> | Bd) {
  return { a, b };
}

function _checkCommonCompare<E>(sza: Sorted<E>, szb: Sorted<E>): void {
  const { cmp: cmpa } = sza;
  const { cmp: cmpb } = szb;
  if (cmpa !== cmpb) return throws("Different compares");
  return;
}

function* _sortedJoin<E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedResultSelector<E, never, never, R>
) {
  const joins = sortedGroupJoin(sza, szb, rawGroupSelector);
  for (const j of joins)
    for (const a of j.a) for (const b of j.b) yield rSel(a, b);
}

export function sortedJoin<E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedResultSelector<E, never, never, R>
) {
  _checkCommonCompare(sza, szb);
  return lazyfy(() => _sortedJoin(sza, szb, rSel));
}

function* _sortedLeftJoin<E, Bd, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  defaultB: Seed<Bd>,
  rSel: SortedResultSelector<E, never, Bd, R>
) {
  const joins = sortedLeftGroupJoin(sza, szb, rawGroupSelector);
  for (const j of joins)
    for (const a of j.a)
      if (j.b) for (const b of j.b) yield rSel(a, b);
      else yield rSel(a, defaultB());
}

export function sortedLeftJoinWithDefault<E, Bd, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  defaultB: Seed<Bd>,
  rSel: SortedResultSelector<E, never, Bd, R>
) {
  _checkCommonCompare(sza, szb);
  return lazyfy(() => _sortedLeftJoin(sza, szb, defaultB, rSel));
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
  sza: Sorted<E>,
  szb: Sorted<E>,
  defaultA: Seed<Ad>,
  defaultB: Seed<Bd>,
  rSel: SortedResultSelector<E, Ad, Bd, R>
) {
  const joins = sortedFullGroupJoin(sza, szb, rawGroupSelector);
  for (const j of joins)
    if (j.a)
      for (const a of j.a)
        if (j.b) for (const b of j.b) yield rSel(a, b);
        else yield rSel(a, defaultB());
    else for (const b of j.b!) yield rSel(defaultA(), b);
}

export function sortedFullJoinWithDefault<E, Ad, Bd, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  defaultA: Seed<Ad>,
  defaultB: Seed<Bd>,
  rSel: SortedResultSelector<E, Ad, Bd, R>
) {
  _checkCommonCompare(sza, szb);
  return lazyfy(() => _sortedFullJoin(sza, szb, defaultA, defaultB, rSel));
}

export const sortedFullJoin = <E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedResultSelector<E, null, null, R>
) => sortedFullJoinWithDefault(sza, szb, nullSeed, nullSeed, rSel);
