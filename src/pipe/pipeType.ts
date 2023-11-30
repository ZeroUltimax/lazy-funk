import { Lazy, LazyOperator, LazyReducer } from "../coreTypes";
type LO<E, F> = LazyOperator<E, F>;
type LR<E, R> = LazyReducer<E, R>;

// prettier-ignore
export interface Pipe {
  (): <A>(z: Lazy<A>) => Lazy<A>;
  <A, B>(aOp_0: LO<A, B>): (z: Lazy<A>) => Lazy<B>;
  <A, B, C>(aOp_0: LO<A, B>, aOp_1: LO<B, C>): (z: Lazy<A>) => Lazy<C>;
  <A, B, C, D>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>): (z: Lazy<A>) => Lazy<D>;
  <A, B, C, D, E>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>): (z: Lazy<A>) => Lazy<E>;
  <A, B, C, D, E, F>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>): (z: Lazy<A>) => Lazy<F>;
  <A, B, C, D, E, F, G>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>): (z: Lazy<A>) => Lazy<G>;
  <A, B, C, D, E, F, G, H>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>): (z: Lazy<A>) => Lazy<H>;
  <A, B, C, D, E, F, G, H, I>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>): (z: Lazy<A>) => Lazy<I>;
  <A, B, C, D, E, F, G, H, I, J>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>): (z: Lazy<A>) => Lazy<J>;
  <A, B, C, D, E, F, G, H, I, J, K>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>): (z: Lazy<A>) => Lazy<K>;
  <A, B, C, D, E, F, G, H, I, J, K, L>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>): (z: Lazy<A>) => Lazy<L>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>): (z: Lazy<A>) => Lazy<M>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>): (z: Lazy<A>) => Lazy<N>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>): (z: Lazy<A>) => Lazy<O>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>): (z: Lazy<A>) => Lazy<P>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>): (z: Lazy<A>) => Lazy<Q>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>): (z: Lazy<A>) => Lazy<R>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>): (z: Lazy<A>) => Lazy<S>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>): (z: Lazy<A>) => Lazy<T>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>): (z: Lazy<A>) => Lazy<U>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>, aOp_20: LO<U, V>): (z: Lazy<A>) => Lazy<V>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>, aOp_20: LO<U, V>, aOp_21: LO<V, W>): (z: Lazy<A>) => Lazy<W>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>, aOp_20: LO<U, V>, aOp_21: LO<V, W>, aOp_22: LO<W, X>): (z: Lazy<A>) => Lazy<X>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>, aOp_20: LO<U, V>, aOp_21: LO<V, W>, aOp_22: LO<W, X>, aOp_23: LO<X, Y>): (z: Lazy<A>) => Lazy<Y>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>, aOp_20: LO<U, V>, aOp_21: LO<V, W>, aOp_22: LO<W, X>, aOp_23: LO<X, Y>, aOp_24: LO<Y, Z>): (z: Lazy<A>) => Lazy<Z>;
}

// prettier-ignore
export interface Spout {
  (): <A, R>(aRed: LR<A, R>) => (z: Lazy<A>) => R;
  <A, B>(aOp_0: LO<A, B>): <R>(aRed: LR<B, R>) => (z: Lazy<A>) => R;
  <A, B, C>(aOp_0: LO<A, B>, aOp_1: LO<B, C>): <R>(aRed: LR<C, R>) => (z: Lazy<A>) => R;
  <A, B, C, D>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>): <R>(aRed: LR<D, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>): <R>(aRed: LR<E, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>): <R>(aRed: LR<F, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>): <R>(aRed: LR<G, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>): <R>(aRed: LR<H, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>): <R>(aRed: LR<I, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>): <R>(aRed: LR<J, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>): <R>(aRed: LR<K, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>): <R>(aRed: LR<L, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>): <R>(aRed: LR<M, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>): <R>(aRed: LR<N, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>): <R>(aRed: LR<O, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>): <R>(aRed: LR<P, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>): <R>(aRed: LR<Q, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>): <R>(aRed: LR<R, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>): <R>(aRed: LR<S, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>): <R>(aRed: LR<T, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>): <R>(aRed: LR<U, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>, aOp_20: LO<U, V>): <R>(aRed: LR<V, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>, aOp_20: LO<U, V>, aOp_21: LO<V, W>): <R>(aRed: LR<W, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>, aOp_20: LO<U, V>, aOp_21: LO<V, W>, aOp_22: LO<W, X>): <R>(aRed: LR<X, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>, aOp_20: LO<U, V>, aOp_21: LO<V, W>, aOp_22: LO<W, X>, aOp_23: LO<X, Y>): <R>(aRed: LR<Y, R>) => (z: Lazy<A>) => R;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z>(aOp_0: LO<A, B>, aOp_1: LO<B, C>, aOp_2: LO<C, D>, aOp_3: LO<D, E>, aOp_4: LO<E, F>, aOp_5: LO<F, G>, aOp_6: LO<G, H>, aOp_7: LO<H, I>, aOp_8: LO<I, J>, aOp_9: LO<J, K>, aOp_10: LO<K, L>, aOp_11: LO<L, M>, aOp_12: LO<M, N>, aOp_13: LO<N, O>, aOp_14: LO<O, P>, aOp_15: LO<P, Q>, aOp_16: LO<Q, R>, aOp_17: LO<R, S>, aOp_18: LO<S, T>, aOp_19: LO<T, U>, aOp_20: LO<U, V>, aOp_21: LO<V, W>, aOp_22: LO<W, X>, aOp_23: LO<X, Y>, aOp_24: LO<Y, Z>): <R>(aRed: LR<Z, R>) => (z: Lazy<A>) => R;
}