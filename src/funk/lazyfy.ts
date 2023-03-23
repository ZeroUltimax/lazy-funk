import { Lazy } from "../coreTypes";

// I'm just lazy and I dont want the complicated iterator syntax every time.
export const lazyfy = <E>(genFunk: () => Iterator<E>): Lazy<E> => ({
  [Symbol.iterator]: genFunk,
});

export const lazyfyFunk =
  <A extends any[], E>(
    _genFunk: (...args: A) => Iterator<E>
  ): ((...args: A) => Lazy<E>) =>
  (...args: A) => ({ [Symbol.iterator]: () => _genFunk(...args) });
