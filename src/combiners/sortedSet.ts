import { Gen, Lazy, Sorted } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { SortedSetOperations } from "../iterables/SortedSetOperations";
import {
  sortedFullGroupJoin,
  sortedGroupJoin,
  sortedLeftGroupJoin,
} from "./sortedGroupJoin";

// Forcibly pull the first element of a lazy know to have at least one entry
function rep<E>(z: Lazy<E>): E {
  const it = nrgz(z);
  const nx = it.next() as IteratorYieldResult<E>;
  return nx.value;
}

const unionGroupSelector = <E>(a: Lazy<E> | null, b: Lazy<E> | null): E =>
  rep(a || b!);

export const sortedUnion = <E>(sza: Sorted<E>, szb: Sorted<E>) =>
  sortedFullGroupJoin(sza, szb, unionGroupSelector);

const intersectionGroupSelector = <E>(a: Lazy<E>): E => rep(a);

export const sortedIntersection = <E>(sza: Sorted<E>, szb: Sorted<E>) =>
  sortedGroupJoin(sza, szb, intersectionGroupSelector);

interface LeftGroupResultSelector<E> {
  a: Lazy<E>;
  b: Lazy<E> | null;
}

function differenceGroupSelector<E>(
  a: Lazy<E>,
  b: Lazy<E> | null
): LeftGroupResultSelector<E> {
  return { a, b };
}

function* _sortedDifference<E>(zg: Lazy<LeftGroupResultSelector<E>>): Gen<E> {
  for (const { a, b } of zg) if (!b) yield rep(a);
}

export function sortedDifference<E>(sza: Sorted<E>, szb: Sorted<E>) {
  const zg = sortedLeftGroupJoin(sza, szb, differenceGroupSelector);
  return lazyfy(() => _sortedDifference(zg));
}

export function sortedSetOperations<E>(sza: Sorted<E>, szb: Sorted<E>) {
  const sso = SortedSetOperations.FromSorted(sza, szb);

  return {
    union: lazyfy(() => sso.iter("full")),
    intersection: lazyfy(() => sso.iter("inner")),
    aMinusB: lazyfy(() => sso.iter("left")),
    bMinusA: lazyfy(() => sso.iter("right")),
  };
}
