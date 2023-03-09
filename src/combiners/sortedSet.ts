import { Compare, Gen, Sorted } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { throws } from "../funk/throws";

// I usually prefer not having guard values since it double the ammount of conditions.
// In this case though, without the sentinel, you'd need crazy gymnastics and duplicated code to ensure lEl is always initialized.
const $ = Symbol("Unyielded");
type T$ = typeof $;

const isNextEl = <E>(lEl: T$ | E, el: E, cmp: Compare<E>) =>
  lEl === $ || cmp(lEl, el) < 0;

function* _sortedUnion<E>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  cmp: Compare<E>
): Gen<E> {
  const sItA = nrgz(sza);
  const sItB = nrgz(szb);

  let nxA = sItA.next();
  let nxB = sItB.next();

  let lEl: E | T$ = $;

  outer: for (; !nxA.done && !nxB.done; nxA = sItA.next()) {
    const elA = nxA.value;
    if (!isNextEl(lEl, elA, cmp)) continue outer;
    inner: for (; !nxB.done; nxB = sItB.next()) {
      const elB = nxB.value;
      if (!isNextEl(lEl, elB, cmp)) continue inner;
      if (cmp(elA, elB) <= 0) {
        yield (lEl = elA);
        continue outer;
      }
      yield (lEl = elB);
    }
    // Important to not advance sItA if nxB.done
    if (nxB.done) break outer;
  }

  for (; !nxA.done; nxA = sItA.next()) {
    const elA = nxA.value;
    if (!isNextEl(lEl, elA, cmp)) continue;
    yield (lEl = elA);
  }

  for (; !nxB.done; nxB = sItB.next()) {
    const elB = nxB.value;
    if (!isNextEl(lEl, elB, cmp)) continue;
    yield (lEl = elB);
  }
}

export function sortedUnion<E>(sza: Sorted<E>, szb: Sorted<E>): Sorted<E> {
  const { cmp: cmpa } = sza;
  const { cmp: cmpb } = szb;
  if (cmpa !== cmpb) return throws("Different compares");
  const cmp = cmpa;
  return Object.assign(
    lazyfy(() => _sortedUnion(sza, szb, cmp)),
    { cmp }
  );
}

function* _sortedIntersection<E>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  cmp: Compare<E>
): Gen<E> {
  const sItA = nrgz(sza);
  const sItB = nrgz(szb);

  let nxA = sItA.next();
  let nxB = sItB.next();

  let lEl: E | T$ = $;

  outer: for (; !nxA.done && !nxB.done; nxA = sItA.next()) {
    const elA = nxA.value;
    if (!isNextEl(lEl, elA, cmp)) continue outer;
    inner: for (; !nxB.done; nxB = sItB.next()) {
      const elB = nxB.value;
      if (!isNextEl(lEl, elB, cmp)) continue inner;
      const cmpRes = cmp(elA, elB);
      if (cmpRes < 0) {
        lEl = elA;
        continue outer;
      }
      if (cmpRes === 0) {
        yield (lEl = elA);
        continue outer;
      }
      lEl = elB;
    }
    // Important to not advance sItA if nxB.done
    if (nxB.done) break outer;
  }
}

export function sortedIntersection<E>(
  sza: Sorted<E>,
  szb: Sorted<E>
): Sorted<E> {
  const { cmp: cmpa } = sza;
  const { cmp: cmpb } = szb;
  if (cmpa !== cmpb) return throws("Different compares");
  const cmp = cmpa;
  return Object.assign(
    lazyfy(() => _sortedIntersection(sza, szb, cmp)),
    { cmp }
  );
}

function* _sortedDifference<E>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  cmp: Compare<E>
): Gen<E> {
  const sItA = nrgz(sza);
  const sItB = nrgz(szb);

  let nxA = sItA.next();
  let nxB = sItB.next();

  let lEl: E | T$ = $;

  outer: for (; !nxA.done && !nxB.done; nxA = sItA.next()) {
    const elA = nxA.value;
    if (!isNextEl(lEl, elA, cmp)) continue outer;
    inner: for (; !nxB.done; nxB = sItB.next()) {
      const elB = nxB.value;
      if (!isNextEl(lEl, elB, cmp)) continue inner;
      const cmpRes = cmp(elA, elB);
      if (cmpRes < 0) {
        yield (lEl = elA);
        continue outer;
      }
      if (cmpRes === 0) {
        lEl = elA;
        continue outer;
      }
      lEl = elB;
    }
    // Important to not advance sItA if nxB.done
    if (nxB.done) break outer;
  }

  for (; !nxA.done; nxA = sItA.next()) {
    const elA = nxA.value;
    if (!isNextEl(lEl, elA, cmp)) continue;
    yield (lEl = elA);
  }
}

export function sortedDifference<E>(sza: Sorted<E>, szb: Sorted<E>): Sorted<E> {
  const { cmp: cmpa } = sza;
  const { cmp: cmpb } = szb;
  if (cmpa !== cmpb) return throws("Different compares");
  const cmp = cmpa;
  return Object.assign(
    lazyfy(() => _sortedDifference(sza, szb, cmp)),
    { cmp }
  );
}
