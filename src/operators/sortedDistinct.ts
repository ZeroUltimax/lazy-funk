import { Compare, Gen, Lazy, Sorted } from "../coreTypes";

import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

function* _sortedDistinct<E>(sz: Lazy<E>, cmp: Compare<E>): Gen<E> {
  const sIt = nrgz(sz);
  for (let nx = sIt.next(), rep: E; !nx.done; ) {
    yield (rep = nx.value);
    for (; !nx.done; nx = sIt.next()) if (cmp(rep, nx.value) < 0) break;
  }
}

export function sortedDistinct<E>(sz: Sorted<E>): Sorted<E> {
  return Object.assign(
    lazyfy(() => _sortedDistinct(sz, sz.cmp)),
    { cmp: sz.cmp }
  );
}
