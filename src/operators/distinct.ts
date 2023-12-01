import { Lazy, Selector } from "../coreTypes";
import { id } from "../funk/id";
import { lazyfy } from "../funk/lazyfy";
import { MemoKeyedIterator, repMemo } from "../iterables/MemoKeyedIterator";

function* _distinct<E, CovE extends E, K>(iter: MemoKeyedIterator<E, CovE, K>) {
  for (const key of iter.iterateKeys()) yield repMemo(iter, key);
}

export const distinctBy =
  <E, K>(sel: Selector<E, K>) =>
  <CovE extends E>(z: Lazy<CovE>): Lazy<CovE> => {
    const iter = MemoKeyedIterator.FromLazy(z, sel);
    return lazyfy(_distinct)(iter);
  };

export const distinct = distinctBy(id);
