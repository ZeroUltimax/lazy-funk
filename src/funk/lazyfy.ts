import { __String } from "typescript";
import {
  Lazy,
  LazyCombiner,
  LazyCombinerReducer,
  LazyOperator,
  LazyReducer,
} from "../coreTypes";

// Ensures we create lazies the exact same way every time.
export const lazyfy =
  <Args extends any[], E>(_genFunk: (...args: Args) => Iterator<E>) =>
  (...args: Args): Lazy<E> => ({ [Symbol.iterator]: () => _genFunk(...args) });

export const lazyfyOp =
  <Args extends any[], E, F>(_op: (z: Lazy<E>, ...args: Args) => Iterator<F>) =>
  (...args: Args): LazyOperator<E, F> =>
  (z) =>
    lazyfy(_op)(z, ...args);

export const lazyfyCombo =
  <Args extends any[], A, B, R>(
    _combo: (za: Lazy<A>, zb: Lazy<B>, ...args: Args) => Iterator<R>
  ) =>
  (...args: Args): LazyCombiner<A, B, R> =>
  (zb) =>
  (za) =>
    lazyfy(_combo)(za, zb, ...args);

export const curryReducer =
  <Args extends any[], E, R>(_red: (z: Lazy<E>, ...args: Args) => R) =>
  (...args: Args): LazyReducer<E, R> =>
  (z) =>
    _red(z, ...args);

export const curryComboReducer =
  <Args extends any[], A, B, R>(
    _comboRed: (za: Lazy<A>, zb: Lazy<B>, ...args: Args) => R
  ) =>
  (...args: Args): LazyCombinerReducer<A, B, R> =>
  (zb) =>
  (za) =>
    _comboRed(za, zb, ...args);
