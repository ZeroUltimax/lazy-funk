import { Compare, Gen, Lazy, Sorted } from "../coreTypes";
import { makeSorted, skipSeq } from "../funk/_sorted";

import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

function* _sortedDistinct<E>(sz: Lazy<E>, cmp: Compare<E>): Gen<E> {
  const sIt = nrgz(sz);
  for (let nx = sIt.next(), rep: E; !nx.done; ) {
    yield (rep = nx.value);
    nx = skipSeq(sIt, rep, cmp);
  }
}

// Make E covariant
export const sortedDistinct = <E>(sz: Sorted<E>): Sorted<E> =>
  makeSorted(lazyfy(_sortedDistinct)(sz, sz.cmp), sz.cmp);
