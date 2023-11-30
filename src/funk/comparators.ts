import { Compare, GenCompare, Selector } from "../coreTypes";
import { throws } from "./throws";

export const cmpNum: Compare<number> = (a, b) => a - b;
export const cmpNatural: GenCompare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
export const cmpNaturalSafe: GenCompare = (a, b) =>
  a < b ? -1 : a > b ? 1 : a === b ? 0 : throws("Uncomparable");

export const cmpInverse =
  <E>(cmp: Compare<E>): Compare<E> =>
  (a, b) =>
    cmp(b, a);

export const cmpCompose =
  <E>(cmp1: Compare<E>, cmp2: Compare<E>): Compare<E> =>
  (a, b) =>
    cmp1(a, b) || cmp2(a, b);

export const cmpBy =
  <E, K>(
    selector: Selector<E, K>,
    keyCmp: Compare<K> = cmpNatural
  ): Compare<E> =>
  (a, b) =>
    keyCmp(selector(a), selector(b));
