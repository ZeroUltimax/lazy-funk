import { Lazy, Predicate, Seed } from "../coreTypes";
import { isTruthy } from "../funk/predicates";

export function areAll<E>(z: Lazy<E>, pred: Predicate<E> = isTruthy) {
  for (const el of z) if (!pred(el)) return false;
  return true;
}

export function areAny<E>(z: Lazy<E>, pred: Predicate<E> = isTruthy) {
  for (const el of z) if (pred(el)) return true;
  return false;
}
