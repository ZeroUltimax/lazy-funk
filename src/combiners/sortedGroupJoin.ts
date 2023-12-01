import { Compare, Gen, Lazy, Seed, Sorted, SortedCombiner } from "../coreTypes";
import { accumulate, skipSeq } from "../funk/_sorted";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { nullSeed } from "../funk/seed";
import { throws } from "../funk/throws";
import { SortedGroupResultSelector, invSortSel } from "./_selectors";

const getCommonCompare = <E, A extends E, B extends E>(
  { cmp: cmpa }: Sorted<E, A>,
  { cmp: cmpb }: Sorted<E, B>
): Compare<E> =>
  Object.is(cmpa, cmpb) ? (cmpa as Compare<E>) : throws("Different compares");

function* _innerGroupJoin<E, A extends E, B extends E, R>(
  sza: Sorted<E, A>,
  szb: Sorted<E, B>,
  rSel: SortedGroupResultSelector<E, never, never, R>,
  cmp: Compare<E>
): Gen<R> {
  const sItA = nrgz(sza);
  const sItB = nrgz(szb);

  let nxA = sItA.next();
  let nxB = sItB.next();

  let rep: E;
  let accA: readonly E[];
  let accB: readonly E[];

  while (!nxA.done && !nxB.done) {
    const cmpRes = cmp(nxA.value, nxB.value);
    if (cmpRes < 0) {
      nxA = skipSeq(sItA, nxA.value, cmp);
      continue;
    }
    if (cmpRes > 0) {
      nxB = skipSeq(sItB, nxB.value, cmp);
      continue;
    }

    rep = nxA.value;

    [nxA, accA] = accumulate(sItA, nxA, rep, cmp);
    [nxB, accB] = accumulate(sItB, nxB, rep, cmp);

    yield rSel(accA, accB);
  }
}

function* _halfGroupJoin<E, A extends E, B extends E, Bd, R>(
  sza: Sorted<E, A>,
  szb: Sorted<E, B>,
  seedB: Seed<Bd>,
  rSel: SortedGroupResultSelector<E, never, Bd, R>,
  cmp: Compare<E>
): Gen<R> {
  const sItA = nrgz(sza);
  const sItB = nrgz(szb);

  let nxA = sItA.next();
  let nxB = sItB.next();

  let rep: E;
  let accA: readonly E[];
  let accB: readonly E[];

  while (!nxA.done && !nxB.done) {
    if (cmp(nxA.value, nxB.value) <= 0) {
      rep = nxA.value;
    } else {
      nxB = skipSeq(sItB, nxB.value, cmp);
      continue;
    }

    [nxA, accA] = accumulate(sItA, nxA, rep, cmp);
    [nxB, accB] = accumulate(sItB, nxB, rep, cmp);

    if (accB.length) yield rSel(accA, accB);
    else yield rSel(accA, seedB());
  }

  while (!nxA.done) {
    nxA.value = nxA.value;
    rep = nxA.value;
    [nxA, accA] = accumulate(sItA, nxA, rep, cmp);
    yield rSel(accA, seedB());
  }
}

function* _fullGroupJoin<E, A extends E, Ad, B extends E, Bd, R>(
  sza: Sorted<E, A>,
  seedA: Seed<Ad>,
  szb: Sorted<E, B>,
  seedB: Seed<Bd>,
  rSel: SortedGroupResultSelector<E, Ad, Bd, R>,
  cmp: Compare<E>
): Gen<R> {
  const sItA = nrgz(sza);
  const sItB = nrgz(szb);

  let nxA = sItA.next();
  let nxB = sItB.next();

  let rep: E;
  let accA: readonly E[];
  let accB: readonly E[];

  while (!nxA.done && !nxB.done) {
    if (cmp(nxA.value, nxB.value) <= 0) rep = nxA.value;
    else rep = nxB.value;

    [nxA, accA] = accumulate(sItA, nxA, rep, cmp);
    [nxB, accB] = accumulate(sItB, nxB, rep, cmp);

    if (accA.length && accB.length) yield rSel(accA, accB);
    else if (accA.length) yield rSel(accA, seedB());
    else yield rSel(seedA(), accB);
  }

  while (!nxA.done) {
    [nxA, accA] = accumulate(sItA, nxA, nxA.value, cmp);
    yield rSel(accA, seedB());
  }
  while (!nxB.done) {
    [nxB, accB] = accumulate(sItB, nxB, nxB.value, cmp);
    yield rSel(seedA(), accB);
  }
}

export const sortedGroupJoin =
  <E, R>(rSel: (a: Lazy<E>, b: Lazy<E>) => R): SortedCombiner<E, E, R> =>
  (szb) =>
  (sza) =>
    lazyfy(_innerGroupJoin)(sza, szb, rSel, getCommonCompare(sza, szb));

export const sortedLeftGroupJoinWithDefault =
  <E, Bd, R>(
    defaultB: Seed<Bd>,
    rSel: SortedGroupResultSelector<E, never, Bd, R>
  ): SortedCombiner<E, E, R> =>
  (szb) =>
  (sza) =>
    lazyfy(_halfGroupJoin)(
      sza,
      szb,
      defaultB,
      rSel,
      getCommonCompare(sza, szb)
    );
export const sortedLeftGroupJoin = <E, R>(
  rSel: SortedGroupResultSelector<E, never, null, R>
) => sortedLeftGroupJoinWithDefault(nullSeed, rSel);

export const sortedRightGroupJoinWithDefault =
  <E, Ad, R>(
    defaultA: Seed<Ad>,
    rSel: SortedGroupResultSelector<E, Ad, never, R>
  ): SortedCombiner<E, E, R> =>
  (szb) =>
  (sza) =>
    sortedLeftGroupJoinWithDefault(defaultA, invSortSel(rSel))(sza)(szb);
export const sortedRightGroupJoin =
  <E, R>(
    rSel: SortedGroupResultSelector<E, null, never, R>
  ): SortedCombiner<E, E, R> =>
  (szb) =>
  (sza) =>
    sortedLeftGroupJoinWithDefault(nullSeed, invSortSel(rSel))(sza)(szb);

export const sortedFullGroupJoinWithDefault =
  <E, Ad, Bd, R>(
    defaultA: Seed<Ad>,
    defaultB: Seed<Bd>,
    rSel: SortedGroupResultSelector<E, Ad, Bd, R>
  ): SortedCombiner<E, E, R> =>
  (szb) =>
  (sza) =>
    lazyfy(_fullGroupJoin)(
      sza,
      defaultA,
      szb,
      defaultB,
      rSel,
      getCommonCompare(sza, szb)
    );

export const sortedFullGroupJoin = <E, R>(
  rSel: SortedGroupResultSelector<E, null, null, R>
) => sortedFullGroupJoinWithDefault(nullSeed, nullSeed, rSel);
