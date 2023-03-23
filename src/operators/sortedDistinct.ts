import { Compare, Gen, Sorted } from "../coreTypes";
import { $min, $MinType, cmpSentinelMin } from "../funk/comparators";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

function* _sortedDistinct<E>(sz: Sorted<E>, cmp: Compare<E>): Gen<E> {
  const sit = nrgz(sz);

  let nx = sit.next();

  let lEl: E | $MinType = $min;

  for (; !nx.done; nx = sit.next()) {
    const el = nx.value;
    if (cmpSentinelMin(lEl, el, cmp) >= 0) continue;
    yield (lEl = el);
  }
}

export function sortedDistinct<E>(sz: Sorted<E>): Sorted<E> {
  return Object.assign(
    lazyfy(() => _sortedDistinct(sz, sz.cmp)),
    { cmp: sz.cmp }
  );
}
