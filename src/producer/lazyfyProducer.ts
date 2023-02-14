import { GenProducer, LazyProducer } from "../coreTypes";

export const lazyfyProducer =
  <A extends any[], E>(p: GenProducer<A, E>): LazyProducer<A, E> =>
  (...args: A) => ({ [Symbol.iterator]: () => p(...args) });
