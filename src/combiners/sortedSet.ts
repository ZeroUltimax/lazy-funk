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

const unionGroupSelector = <A, B>(
  a: Lazy<A> | null,
  b: Lazy<B> | null
): A | B => rep<A | B>(a || b!);

// Fixme: use proper types for return value
export const sortedUnion = sortedFullGroupJoin(
  unionGroupSelector
) as SetCombiner;

const intersectionGroupSelector = <E>(a: Lazy<E>): E => rep(a);

export const sortedIntersection = sortedGroupJoin(
  intersectionGroupSelector
) as SetCombiner;

interface DiffGroup<E, A extends E, B extends E> {
  a: Lazy<A>;
  b: Lazy<B> | null;
}

const differenceSelector = <E, A extends E, B extends E>(
  a: Lazy<A>,
  b: Lazy<B> | null
): DiffGroup<E, A, B> => ({ a, b });
const differenceFilter = <E, B extends E>({
  b,
}: DiffGroup<E, any, B>): boolean => b === null;

const differenceMap = <E, A extends E>({ a }: DiffGroup<E, A, any>): A =>
  rep(a);

export const sortedDifference =
  <E, B extends E>(szb: Sorted<E, B>) =>
  <A extends E>(sza: Sorted<E, A>) =>
    map(differenceMap)(
      filter(differenceFilter)(
        sortedLeftGroupJoin(differenceSelector<E, A, B>)(szb)(sza)
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
