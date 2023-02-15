import { Compare, Selector } from "../coreTypes";
import { throws } from "./throws";

export const cmpNum = (a: number, b: number) => a - b;
export const cmpNatural = <E>(a: E, b: E) => (a < b ? -1 : a > b ? 1 : 0);
export const cmpNaturalSafe = <E>(a: E, b: E) =>
  a < b ? -1 : a > b ? 1 : a === b ? 0 : throws("Uncomparable");

export const cmpInverse =
  <E>(cmp: Compare<E>) =>
  (a: E, b: E) =>
    cmp(b, a);

export const cmpCompose =
  <E>(cmp1: Compare<E>, cmp2: Compare<E>) =>
  (a: E, b: E) =>
    cmp1(a, b) || cmp2(a, b);

export const cmpByKey =
  <E, K>(selector: Selector<E, K>, keyCmp: Compare<K>) =>
  (a: E, b: E) =>
    keyCmp(selector(a), selector(b));
