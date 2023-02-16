import { GenOperator, Lazy, LazyOperator } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";

export const lazyfyOperator =
  <A extends any[], E, U>(_op: GenOperator<A, E, U>): LazyOperator<A, E, U> =>
  (z: Lazy<E>, ...args: A) =>
    lazyfy(() => _op(z, ...args));
