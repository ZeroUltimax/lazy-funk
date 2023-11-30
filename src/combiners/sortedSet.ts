import { Lazy, Sorted } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { rep } from "../funk/_rep";
import { SortedSetOperations } from "../iterables/SortedSetOperations";
import { filter } from "../operators/filter";
import { map } from "../operators/map";
import {
  sortedFullGroupJoin,
  sortedGroupJoin,
  sortedLeftGroupJoin,
} from "./sortedGroupJoin";

type SetCombiner = <E>(szb: Sorted<E>) => <E>(sza: Sorted<E>) => Lazy<E>;

const unionGroupSelector = <A, B>(
  a: Lazy<A> | null,
  b: Lazy<B> | null
): A | B => rep<A | B>(a || b!);

export const sortedUnion = sortedFullGroupJoin(
  unionGroupSelector
) as SetCombiner;

const intersectionGroupSelector = <E>(a: Lazy<E>): E => rep(a);

export const sortedIntersection = sortedGroupJoin(
  intersectionGroupSelector
) as SetCombiner;

interface DiffGroup<E> {
  a: Lazy<E>;
  b: Lazy<E> | null;
}

const differenceSelector = <E>(
  a: Lazy<E>,
  b: Lazy<E> | null
): DiffGroup<E> => ({ a, b });
const differenceFilter = <E>({ b }: DiffGroup<E>) => b === null;
const differenceMap = <E>({ a }: DiffGroup<E>) => rep(a);

export const sortedDifference =
  <E>(szb: Sorted<E>) =>
  (sza: Sorted<E>) =>
    map(differenceMap)(
      filter(differenceFilter)(
        sortedLeftGroupJoin(differenceSelector<E>)(szb)(sza)
      )
    );

export const sortedSetOperations =
  <E>(szb: Sorted<E>) =>
  (sza: Sorted<E>) => {
    const sso = SortedSetOperations.FromSorted(sza, szb);
    const ssoIter = lazyfy(sso.iter.bind(sso));
    return {
      union: ssoIter("full"),
      intersection: ssoIter("inner"),
      aMinusB: ssoIter("left"),
      bMinusA: ssoIter("right"),
    };
  };
