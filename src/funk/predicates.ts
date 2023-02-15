import { Predicate } from "../coreTypes";

export const isTruthy = <E>(el: E): boolean => !!el;
export const isNotNull = <E>(el: E): boolean => el != null;

export const isAlway = <E>(_el: E) => true;
export const isNever = <E>(_el: E) => false;
export const isNot =
  <E>(pred: Predicate<E>): Predicate<E> =>
  (el) =>
    !pred(el);
