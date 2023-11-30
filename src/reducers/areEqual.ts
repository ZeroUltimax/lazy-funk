import { Compare, Lazy } from "../coreTypes";
import { cmpNatural } from "../funk/comparators";
import { curryComboReducer } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

function _areEqual<E>(za: Lazy<E>, zb: Lazy<E>, cmp: Compare<E> = cmpNatural) {
  let ita = nrgz(za);
  let itb = nrgz(zb);
  let nxa;
  let nxb;
  for (
    nxa = ita.next(), nxb = itb.next();
    !nxa.done && !nxb.done;
    nxa = ita.next(), nxb = itb.next()
  )
    if (cmp(nxa.value, nxb.value) !== 0) return false;

  return !!(nxa.done && nxb.done);
}

export const areEqual = curryComboReducer(_areEqual);
