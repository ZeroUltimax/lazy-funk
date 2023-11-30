import { Compare, GenPredicate, Predicate } from "../coreTypes";
import { cmpNatural } from "./comparators";

export const isTruthy: GenPredicate = (e) => !!e;
export const isNotNull: GenPredicate = (e) => e != null;

export const isAlway: GenPredicate = (_e) => true;
export const isNever: GenPredicate = (_e) => false;
export const isNot =
  <E>(pred: Predicate<E>): Predicate<E> =>
  (e) =>
    !pred(e);

export const isLT =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>): Predicate<E> =>
  (el) =>
    cmp(el, to) < 0;
export const isLTE =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>): Predicate<E> =>
  (el) =>
    cmp(el, to) <= 0;
export const isGT =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>): Predicate<E> =>
  (el) =>
    cmp(el, to) > 0;
export const isGTE =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>): Predicate<E> =>
  (el) =>
    cmp(el, to) >= 0;
export const isEqual =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>): Predicate<E> =>
  (el) =>
    cmp(el, to) === 0;
export const isNotEqual =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>): Predicate<E> =>
  (el) =>
    cmp(el, to) !== 0;
