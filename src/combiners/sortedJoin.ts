import { Compare, Gen, Lazy, Seed, Sorted } from "../coreTypes";
import { $min, $MinType, cmpSentinelMin } from "../funk/comparators";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { throws } from "../funk/throws";

type ResultSelector<E, Ad, Bd, R> = (a: E | Ad, b: E | Bd) => R;

function* _fullJoin<E, Ad, Bd, R>(
  sza: Sorted<E>,
  seedA: Seed<Ad>,
  szb: Sorted<E>,
  seedB: Seed<Bd>,
  rSel: ResultSelector<E, Ad, Bd, R>,
  cmp: Compare<E>
): Gen<R> {
  const sItA = nrgz(sza);
  const sItB = nrgz(szb);

  let nxA = sItA.next();
  let nxB = sItB.next();

  let lEl: E | $MinType = $min;

  let accB: E[] = [];
  outer: for (; !nxA.done; nxA = sItA.next()) {
    const elA = nxA.value;

    if (cmpSentinelMin(lEl, elA, cmp) >= 0) {
      if (accB.length) for (const elB of accB) yield rSel(elA, elB);
      else yield rSel(elA, seedB());
      continue outer;
    }

    accB = [];
    inner: for (; !nxB.done; nxB = sItB.next()) {
      const elB = nxB.value;

      if (cmpSentinelMin(lEl, elB, cmp) >= 0) {
        if (accB.length) {
          accB.push(elB);
          yield rSel(elA, elB);
        } else {
          yield rSel(seedA(), elB);
        }
        continue inner;
      }

      const cmpRes = cmp(elA, elB);
      if (cmpRes < 0) {
        lEl = elA;
        if (accB.length === 0) yield rSel(elA, seedB());
        continue outer;
      }
      if (cmpRes === 0) {
        accB.push(elB);
        yield rSel(elA, elB);
      } else {
        yield rSel(seedA(), elB);
      }
      lEl = elB;
    }
    // Important to not advance sItA if nxB.done so out flush loop can handle it
    if (nxB.done && accB.length === 0) break outer;
  }

  // Use this for outer joins
  for (; !nxA.done; nxA = sItA.next()) {
    const elA = nxA.value;
    yield rSel(elA, seedB());
  }

  for (; !nxB.done; nxB = sItB.next()) {
    const elB = nxB.value;
    yield rSel(seedA(), elB);
  }
}

const tmpNullSeed = () => null;

export function sortedFullJoin<E, R>(
  sza: Sorted<E>,
  szb: Sorted<E>,
  rSel: ResultSelector<E, null, null, R>
): Lazy<R> {
  const { cmp: cmpa } = sza;
  const { cmp: cmpb } = szb;
  if (cmpa !== cmpb) return throws("Different compares");
  const cmp = cmpa;
  return lazyfy(() => _fullJoin(sza, tmpNullSeed, szb, tmpNullSeed, rSel, cmp));
}
