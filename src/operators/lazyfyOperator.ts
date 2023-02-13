import { GenOperator, Lazy, LazyOperator } from "../coreTypes";

export const lazyfyOperator =
  <A extends any[], E, U>(_op: GenOperator<A, E, U>): LazyOperator<A, E, U> =>
  (z: Lazy<E>, ...args: A) => ({ [Symbol.iterator]: () => _op(z, ...args) });
