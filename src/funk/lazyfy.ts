import { Lazy } from "../coreTypes";

// I'm just lazy and I dont want the complicated iterator syntax every time.
export const lazyfy = <E>(genFunk: () => Iterator<E>): Lazy<E> => ({
  [Symbol.iterator]: genFunk,
});
