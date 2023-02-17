import { Compare, Lazy } from "../coreTypes";
import { cmpNatural } from "../funk/comparators";
import { nrgz } from "../funk/nrgz";

export function areEqual<E>(
  za: Lazy<E>,
  zb: Lazy<E>,
  cmp: Compare<E> = cmpNatural
) {
  let ita = nrgz(za);
  let itb = nrgz(zb);
  let nxa;
  let nxb;
  for (
    nxa = ita.next(), nxb = itb.next();
    !nxa.done && !nxb.done;
    nxa = ita.next(), nxb = itb.next()
  ) {
    const ela = nxa.value;
    const elb = nxb.value;
    if (cmp(ela, elb) !== 0) return false;
  }

  return !!(nxa.done && nxb.done);
}
