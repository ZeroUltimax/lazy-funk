import { GenProducer, LazyProducer } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";

export const lazyfyProducer =
  <A extends any[], E>(p: GenProducer<A, E>): LazyProducer<A, E> =>
  (...args: A) =>
    lazyfy(() => p(...args));
