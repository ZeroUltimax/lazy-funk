import { LazyOperator, Selector } from "../coreTypes";
import { id } from "../funk/id";
import { lazyfy } from "../funk/lazyfy";
import { MemoKeyedIterator, repMemo } from "../iterables/MemoKeyedIterator";

function* _distinct<E, K>(iter: MemoKeyedIterator<E, K>) {
  for (const key of iter.iterateKeys()) yield repMemo(iter, key);
}

export const distinctBy =
  <E, K>(sel: Selector<E, K>): LazyOperator<E, E> =>
  (z) => {
    const iter = MemoKeyedIterator.FromLazy(z, sel);
    return lazyfy(_distinct)(iter);
  };

export const distinct = distinctBy(id);
