import { Compare, Lazy } from "../coreTypes";
import { cmpNatural } from "../funk/comparators";
import { isEqual, isNever } from "../funk/predicates";
import { fold } from "./fold";
import { areAll, areAny } from "./logic";

const accCount = <E>(n: number, _el: E) => n + 1;
const seedCount = () => 0;
export const count = fold<any, number>(accCount, seedCount);

export const isEmpty = areAll(isNever);

export const contains = <E>(el: E, cmp: Compare<E> = cmpNatural<E>) =>
  areAny(isEqual(el, cmp));
