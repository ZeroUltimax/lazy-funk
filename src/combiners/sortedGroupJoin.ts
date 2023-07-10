import { Compare, Gen, Lazy, Seed, Sorted } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { throws } from "../funk/throws";

type SortedGroupResultSelector<E, Ad, Bd, R> = (
  a: Lazy<E> | Ad,
  b: Lazy<E> | Bd
) => R;

const nullSeed = () => null;
const invertSel =
  <E, Ad, Bd, R>(
    rSel: SortedGroupResultSelector<E, Ad, Bd, R>
  ): SortedGroupResultSelector<E, Bd, Ad, R> =>
  (b, a) =>
    rSel(a, b);

function _getCommonCompare<E>(sza: Sorted<E>, szb: Sorted<E>) {
  const { cmp: cmpa } = sza;
  const { cmp: cmpb } = szb;
  if (cmpa !== cmpb) return throws("Different compares");
  return cmpa;
}

function _skipSeq<E>(sIt: Iterator<E>, rep: E, cmp: Compare<E>) {
  let nx = sIt.next();
  let el: E;
  for (; !nx.done; nx = sIt.next()) {
    el = nx.value;
    if (cmp(rep, el) < 0) break;
  }
  return nx;
}

function* _innerGroupJoin<E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedGroupResultSelector<E, never, never, R>,
  cmp: Compare<E>
): Gen<R> {
  const sItA = nrgz(sza);
  const sItB = nrgz(szb);

  let nxA = sItA.next();
  let nxB = sItB.next();

  let rep: E;
  let elA: E;
  let elB: E;
  let accA: E[] = [];
  let accB: E[] = [];

  while (!nxA.done && !nxB.done) {
    elA = nxA.value;
    elB = nxB.value;

    const cmpRes = cmp(elA, elB);
    if (cmpRes < 0) {
      nxA = _skipSeq(sItA, elA, cmp);
      continue;
    }
    if (cmpRes > 0) {
      nxB = _skipSeq(sItB, elB, cmp);
      continue;
    }

    rep = elA;

    for (; !nxA.done; nxA = sItA.next()) {
      elA = nxA.value;
      if (cmp(rep, elA) < 0) break;
      accA.push(elA);
    }
    for (; !nxB.done; nxB = sItB.next()) {
      elB = nxB.value;
      if (cmp(rep, elB) < 0) break;
      accB.push(elB);
    }

    yield rSel(accA, accB);

    accA = [];
    accB = [];
  }
}

function* _halfGroupJoin<E, Bd, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  seedB: Seed<Bd>,
  rSel: SortedGroupResultSelector<E, never, Bd, R>,
  cmp: Compare<E>
): Gen<R> {
  const sItA = nrgz(sza);
  const sItB = nrgz(szb);

  let nxA = sItA.next();
  let nxB = sItB.next();

  let rep: E;
  let elA: E;
  let elB: E;
  let accA: E[] = [];
  let accB: E[] = [];

  while (!nxA.done && !nxB.done) {
    elA = nxA.value;
    elB = nxB.value;

    if (cmp(elA, elB) <= 0) {
      rep = elA;
    } else {
      nxB = _skipSeq(sItB, elB, cmp);
      continue;
    }

    for (; !nxA.done; nxA = sItA.next()) {
      elA = nxA.value;
      if (cmp(rep, elA) < 0) break;
      accA.push(elA);
    }
    for (; !nxB.done; nxB = sItB.next()) {
      elB = nxB.value;
      if (cmp(rep, elB) < 0) break;
      accB.push(elB);
    }
    if (accB.length) {
      yield rSel(accA, accB);
    } else {
      yield rSel(accA, seedB());
    }

    accA = [];
    accB = [];
  }

  while (!nxA.done) {
    elA = nxA.value;
    rep = elA;
    for (; !nxA.done; nxA = sItA.next()) {
      elA = nxA.value;
      if (cmp(rep, elA) < 0) break;
      accA.push(elA);
    }
    yield rSel(accA, seedB());
    accA = [];
  }
}

function* _fullGroupJoin<E, Ad, Bd, R>(
  sza: Sorted<E>,
  seedA: Seed<Ad>,
  szb: Sorted<E>,
  seedB: Seed<Bd>,
  rSel: SortedGroupResultSelector<E, Ad, Bd, R>,
  cmp: Compare<E>
): Gen<R> {
  const sItA = nrgz(sza);
  const sItB = nrgz(szb);

  let nxA = sItA.next();
  let nxB = sItB.next();

  let rep: E;
  let elA: E;
  let elB: E;
  let accA: E[] = [];
  let accB: E[] = [];

  while (!nxA.done && !nxB.done) {
    elA = nxA.value;
    elB = nxB.value;

    if (cmp(elA, elB) <= 0) {
      rep = elA;
    } else {
      rep = elB;
    }

    for (; !nxA.done; nxA = sItA.next()) {
      elA = nxA.value;
      if (cmp(rep, elA) < 0) break;
      accA.push(elA);
    }
    for (; !nxB.done; nxB = sItB.next()) {
      elB = nxB.value;
      if (cmp(rep, elB) < 0) break;
      accB.push(elB);
    }
    if (accA.length && accB.length) {
      yield rSel(accA, accB);
    } else if (accA.length) {
      yield rSel(accA, seedB());
    } else {
      yield rSel(seedA(), accB);
    }
    accA = [];
    accB = [];
  }

  while (!nxA.done) {
    elA = nxA.value;
    rep = elA;
    for (; !nxA.done; nxA = sItA.next()) {
      elA = nxA.value;
      if (cmp(rep, elA) < 0) break;
      accA.push(elA);
    }
    yield rSel(accA, seedB());
    accA = [];
  }
  while (!nxB.done) {
    elB = nxB.value;
    rep = elB;
    for (; !nxB.done; nxB = sItB.next()) {
      elB = nxB.value;
      if (cmp(rep, elB) < 0) break;
      accB.push(elB);
    }
    yield rSel(seedA(), accB);
    accB = [];
  }
}

export function sortedGroupJoin<E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedGroupResultSelector<E, never, never, R>
): Lazy<R> {
  const cmp = _getCommonCompare(sza, szb);
  return lazyfy(_innerGroupJoin)(sza, szb, rSel, cmp);
}

export function sortedLeftGroupJoinWithDefault<E, Bd, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  defaultB: Seed<Bd>,
  rSel: SortedGroupResultSelector<E, never, Bd, R>
): Lazy<R> {
  const cmp = _getCommonCompare(sza, szb);
  return lazyfy(_halfGroupJoin)(sza, szb, defaultB, rSel, cmp);
}

export const sortedLeftGroupJoin = <E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedGroupResultSelector<E, never, null, R>
) => sortedLeftGroupJoinWithDefault(sza, szb, nullSeed, rSel);

export const sortedRightGroupJoinWithDefault = <E, Ad, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  defaultA: Seed<Ad>,
  rSel: SortedGroupResultSelector<E, Ad, never, R>
) => sortedLeftGroupJoinWithDefault(szb, sza, defaultA, invertSel(rSel));

export const sortedRightGroupJoin = <E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedGroupResultSelector<E, null, never, R>
) => sortedLeftGroupJoinWithDefault(szb, sza, nullSeed, invertSel(rSel));

export function sortedFullGroupJoinWithDefault<E, Ad, Bd, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  defaultA: Seed<Ad>,
  defaultB: Seed<Bd>,
  rSel: SortedGroupResultSelector<E, Ad, Bd, R>
): Lazy<R> {
  const cmp = _getCommonCompare(sza, szb);
  return lazyfy(_fullGroupJoin)(sza, defaultA, szb, defaultB, rSel, cmp);
}

export const sortedFullGroupJoin = <E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: SortedGroupResultSelector<E, null, null, R>
) => sortedFullGroupJoinWithDefault(sza, szb, nullSeed, nullSeed, rSel);
