import { Gen, Lazy, Seed, Selector } from "../coreTypes";
import { lazyfyFunk } from "../funk/lazyfy";
import { fullGroupJoin, groupJoin, leftGroupJoin } from "./groupJoin";

type ResultSelector<A, Ad, B, Bd, K, R> = (a: A | Ad, b: B | Bd, key: K) => R;

const nullSeed = () => null;

const invertSel =
  <A, Ad, B, Bd, K, R>(
    rSel: ResultSelector<A, Ad, B, Bd, K, R>
  ): ResultSelector<B, Bd, A, Ad, K, R> =>
  (b, a, key) =>
    rSel(a, b, key);

function rawGroupSelector<A, Ad, B, Bd, K>(
  a: Lazy<A> | Ad,
  b: Lazy<B> | Bd,
  k: K
) {
  return { a, b, k };
}

function* _join<A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, never, B, never, K, R>
): Gen<R> {
  const joins = groupJoin(za, zb, selA, selB, rawGroupSelector);
  for (const j of joins)
    for (const a of j.a) for (const b of j.b) yield rSel(a, b, j.k);
}

export const join = lazyfyFunk(_join);

function* _leftJoin<A, B, Bd, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultB: Seed<Bd>,
  rSel: ResultSelector<A, never, B, Bd, K, R>
): Gen<R> {
  const joins = leftGroupJoin(za, zb, selA, selB, rawGroupSelector);
  for (const j of joins)
    for (const a of j.a)
      if (j.b) for (const b of j.b) yield rSel(a, b, j.k);
      else yield rSel(a, defaultB(), j.k);
}

export const leftJoinWithDefault = lazyfyFunk(_leftJoin);

export const leftJoin = <A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, never, B, null, K, R>
) => leftJoinWithDefault(za, zb, selA, selB, nullSeed, rSel);

export const rightJoinWithDefault = <A, Ad, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultA: Seed<Ad>,
  rSel: ResultSelector<A, Ad, B, never, K, R>
) => leftJoinWithDefault(zb, za, selB, selA, defaultA, invertSel(rSel));

export const rightJoin = <A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, null, B, never, K, R>
) => leftJoinWithDefault(zb, za, selB, selA, nullSeed, invertSel(rSel));

function* _fullJoin<A, Ad, B, Bd, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  defaultA: Seed<Ad>,
  defaultB: Seed<Bd>,
  rSel: ResultSelector<A, Ad, B, Bd, K, R>
): Gen<R> {
  const joins = fullGroupJoin(za, zb, selA, selB, rawGroupSelector);
  for (const j of joins)
    if (j.a)
      for (const a of j.a)
        if (j.b) for (const b of j.b) yield rSel(a, b, j.k);
        else yield rSel(a, defaultB(), j.k);
    else for (const b of j.b!) yield rSel(defaultA(), b, j.k);
}

export const fullJoinWithDefault = lazyfyFunk(_fullJoin);

export const fullJoin = <A, B, K, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  selA: Selector<A, K>,
  selB: Selector<B, K>,
  rSel: ResultSelector<A, null, B, null, K, R>
) => fullJoinWithDefault(za, zb, selA, selB, nullSeed, nullSeed, rSel);
