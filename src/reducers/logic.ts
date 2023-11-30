import { Lazy, Predicate, Seed } from "../coreTypes";
import { curryReducer } from "../funk/lazyfy";
import { isTruthy } from "../funk/predicates";

function _areAll<E>(z: Lazy<E>, pred: Predicate<E> = isTruthy) {
  for (const el of z) if (!pred(el)) return false;
  return true;
}

export const areAll = curryReducer(_areAll);

function _areAny<E>(z: Lazy<E>, pred: Predicate<E> = isTruthy) {
  for (const el of z) if (pred(el)) return true;
  return false;
}

export const areAny = curryReducer(_areAny);
