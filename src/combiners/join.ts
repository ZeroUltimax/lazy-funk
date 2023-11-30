import { Gen, Lazy, LazyCombiner, Seed, Selector } from "../coreTypes";
import { lazyfy, lazyfyCombo } from "../funk/lazyfy";
import { nullSeed } from "../funk/seed";
import { ResultSelector, invSel, rawSel } from "./_selectors";
import { fullGroupJoin, groupJoin, leftGroupJoin } from "./groupJoin";

function* _join<A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, never, B, never, K, R>
): Gen<R> {
  const joins = groupJoin(selA, selB, rawSel)(zb)(za);
  for (const j of joins)
    for (const a of j.a) for (const b of j.b) yield rSel(a, b, j.k);
}

export const join =
  <A, B, K, R>(
    selA: Selector<A, K>,
    selB: Selector<B, K>,
    rSel: ResultSelector<A, never, B, never, K, R>
  ): LazyCombiner<A, B, R> =>
  (zb) =>
  (za) =>
    lazyfy(_join)(za, zb, selA, selB, rSel);

function* _leftJoin<A, B, Bd, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultB: Seed<Bd>,
  rSel: ResultSelector<A, never, B, Bd, K, R>
): Gen<R> {
  const joins = leftGroupJoin(selA, selB, rawSel)(zb)(za);
  for (const j of joins)
    for (const a of j.a)
      if (j.b) for (const b of j.b) yield rSel(a, b, j.k);
      else yield rSel(a, defaultB(), j.k);
}

export const leftJoinWithDefault = lazyfyCombo(_leftJoin);
export const leftJoin = <A, B, K, R>(
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, never, B, null, K, R>
) => leftJoinWithDefault(selA, selB, nullSeed, rSel);

export const rightJoinWithDefault =
  <A, Ad, B, K, R>(
    selA: Selector<A, K>,
    selB: Selector<B, K>,
    defaultA: Seed<Ad>,
    rSel: ResultSelector<A, Ad, B, never, K, R>
  ): LazyCombiner<A, B, R> =>
  (zb) =>
  (za) =>
    leftJoinWithDefault(selB, selA, defaultA, invSel(rSel))(za)(zb);
export const rightJoin =
  <A, B, K, R>(
    selA: Selector<A, K>,
    selB: Selector<B, K>,
    rSel: ResultSelector<A, null, B, never, K, R>
  ): LazyCombiner<A, B, R> =>
  (zb) =>
  (za) =>
    leftJoinWithDefault(selB, selA, nullSeed, invSel(rSel))(za)(zb);

function* _fullJoin<A, Ad, B, Bd, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultA: Seed<Ad>,
  defaultB: Seed<Bd>,
  rSel: ResultSelector<A, Ad, B, Bd, K, R>
): Gen<R> {
  const joins = fullGroupJoin(selA, selB, rawSel)(zb)(za);
  for (const j of joins)
    if (j.a)
      for (const a of j.a)
        if (j.b) for (const b of j.b) yield rSel(a, b, j.k);
        else yield rSel(a, defaultB(), j.k);
    else for (const b of j.b!) yield rSel(defaultA(), b, j.k);
}

export const fullJoinWithDefault = lazyfyCombo(_fullJoin);
export const fullJoin = <A, B, K, R>(
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, null, B, null, K, R>
) => fullJoinWithDefault(selA, selB, nullSeed, nullSeed, rSel);
