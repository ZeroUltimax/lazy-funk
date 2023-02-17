import { Compare, Predicate } from "../coreTypes";
import { cmpNatural } from "./comparators";

export const isTruthy = <E>(el: E): boolean => !!el;
export const isNotNull = <E>(el: E): boolean => el != null;

export const isAlway = <E>(_el: E) => true;
export const isNever = <E>(_el: E) => false;
export const isNot =
  <E>(pred: Predicate<E>): Predicate<E> =>
  (el) =>
    !pred(el);

export const isLT =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>) =>
  (el: E) =>
    cmp(el, to) < 0;
export const isLTE =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>) =>
  (el: E) =>
    cmp(el, to) <= 0;
export const isGT =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>) =>
  (el: E) =>
    cmp(el, to) > 0;
export const isGTE =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>) =>
  (el: E) =>
    cmp(el, to) >= 0;
export const isEqual =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>) =>
  (el: E) =>
    cmp(el, to) === 0;
export const isNotEqual =
  <E>(to: E, cmp: Compare<E> = cmpNatural<E>) =>
  (el: E) =>
    cmp(el, to) !== 0;
