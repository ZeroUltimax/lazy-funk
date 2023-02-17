import { Compare, Lazy } from "../coreTypes";
import { cmpNatural } from "../funk/comparators";
import { isEqual, isNever } from "../funk/predicates";
import { fold } from "./fold";
import { areAll, areAny } from "./logic";

const accCount = <E>(n: number, _el: E) => n + 1;
const seedCount = () => 0;
export const count = <E>(z: Lazy<E>) => fold(z, accCount, seedCount);

export const isEmpty = <E>(z: Lazy<E>) => areAll(z, isNever);

export const contains = <E>(
  z: Lazy<E>,
  el: E,
  cmp: Compare<E> = cmpNatural<E>
) => areAny(z, isEqual(el, cmp));
