import { Compare, Gen, Sorted } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

const $ = Symbol("Unyielded");
type T$ = typeof $;

const isNextEl = <E>(lEl: T$ | E, el: E, cmp: Compare<E>) =>
  lEl === $ || cmp(lEl, el) < 0;

function* _sortedDistinct<E>(sz: Sorted<E>, cmp: Compare<E>): Gen<E> {
  const sit = nrgz(sz);

  let nx = sit.next();

  let lEl: E | T$ = $;

  for (; !nx.done; nx = sit.next()) {
    const el = nx.value;
    if (!isNextEl(lEl, el, cmp)) continue;
    yield (lEl = el);
  }
}

export function sortedDistinct<E>(sz: Sorted<E>): Sorted<E> {
  return Object.assign(
    lazyfy(() => _sortedDistinct(sz, sz.cmp)),
    { cmp: sz.cmp }
  );
}
