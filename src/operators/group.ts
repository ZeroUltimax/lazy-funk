import {
  Gen,
  Group,
  GroupOperator,
  Lazy,
  Predicate,
  Selector,
} from "../coreTypes";
import { id } from "../funk/id";
import { lazyfy } from "../funk/lazyfy";
import { lazyValues, MemoKeyedIterator } from "../iterables/MemoKeyedIterator";

const getGroup = <E, K, Kk extends K>(
  iter: MemoKeyedIterator<E, K>,
  key: Kk
): Group<E, Kk> => Object.assign(lazyValues(iter, key), { key });

function* _groups<E, K>(iter: MemoKeyedIterator<E, K>): Gen<Group<E, K>> {
  for (const key of iter.iterateKeys()) yield getGroup(iter, key);
}

export const groupBy =
  <E, K>(sel: Selector<E, K>): GroupOperator<E, E, K> =>
  (z) => {
    const iter = MemoKeyedIterator.FromLazy(z, sel);
    return lazyfy(_groups)(iter);
  };

export const partition =
  <E>(pred: Predicate<E>) =>
  (z: Lazy<E>): readonly [Group<E, true>, Group<E, false>] => {
    const grps = MemoKeyedIterator.FromLazy(z, pred);
    return [
      getGroup(grps, true as const),
      getGroup(grps, false as const),
    ] as const;
  };
