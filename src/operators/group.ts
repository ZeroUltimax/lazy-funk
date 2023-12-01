import { Gen, Group, Lazy, Predicate, Selector } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { lazyValues, MemoKeyedIterator } from "../iterables/MemoKeyedIterator";

const getGroup = <E, CovE extends E, K, Kk extends K>(
  iter: MemoKeyedIterator<E, CovE, K>,
  key: Kk
): Group<CovE, Kk> => Object.assign(lazyValues(iter, key), { key });

function* _groups<E, CovE extends E, K>(
  iter: MemoKeyedIterator<E, CovE, K>
): Gen<Group<CovE, K>> {
  for (const key of iter.iterateKeys()) yield getGroup(iter, key);
}

export const groupBy =
  <E, K>(sel: Selector<E, K>) =>
  <CovE extends E>(z: Lazy<CovE>): Lazy<Group<CovE, K>> => {
    const iter = MemoKeyedIterator.FromLazy(z, sel);
    return lazyfy(_groups)(iter);
  };

// Fixme make E covariant
export const partition =
  <E>(pred: Predicate<E>) =>
  <CovE extends E>(
    z: Lazy<CovE>
  ): readonly [Group<CovE, true>, Group<CovE, false>] => {
    const grps = MemoKeyedIterator.FromLazy(z, pred);
    return [
      getGroup(grps, true as const),
      getGroup(grps, false as const),
    ] as const;
  };
