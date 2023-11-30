import { Compare, Lazy, Sorted } from "../coreTypes";
import { lazyfy } from "./lazyfy";

export function skipSeq<E, CovE extends E>(
  sIt: Iterator<CovE>,
  rep: E,
  cmp: Compare<E>
): IteratorResult<CovE> {
  let nx = sIt.next();
  for (; !nx.done; nx = sIt.next()) if (cmp(rep, nx.value) < 0) break;
  return nx;
}

export function accumulate<E, CovE extends E>(
  sIt: Iterator<CovE>,
  nx: IteratorResult<CovE>,
  rep: E,
  cmp: Compare<E>
) {
  const acc = [];
  for (; !nx.done; nx = sIt.next())
    if (cmp(rep, nx.value) < 0) break;
    else acc.push(nx.value);
  return [nx, acc] as const;
}

export const makeSorted = <E>(z: Lazy<E>, cmp: Compare<E>): Sorted<E> =>
  Object.assign(z, { cmp });

export const lazyfySortedOp =
  <E, F>(_op: (z: Lazy<E>, cmp: Compare<F>) => Iterator<F>) =>
  (cmp: Compare<F>) =>
  (z: Lazy<E>): Sorted<F> =>
    makeSorted(lazyfy(_op)(z, cmp), cmp);
