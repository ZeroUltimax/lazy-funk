import { Lazy } from "../coreTypes";

export type ResultSelector<A, Ad, B, Bd, K, R> = (
  a: A | Ad,
  b: B | Bd,
  key: K
) => R;
export type GroupResultSelector<A, Ad, B, Bd, K, R> = ResultSelector<
  Lazy<A>,
  Ad,
  Lazy<B>,
  Bd,
  K,
  R
>;
export type SortedResultSelector<E, A extends E, Ad, B extends E, Bd, R> = (
  a: A | Ad,
  b: B | Bd
) => R;
export type SortedGroupResultSelector<
  E,
  A extends E,
  Ad,
  B extends E,
  Bd,
  R
> = SortedResultSelector<Lazy<E>, Lazy<A>, Ad, Lazy<B>, Bd, R>;

// Fixme: types are out of hands. I need an easier way.
export const invSel =
  <A, Ad, B, Bd, K, R>(
    rSel: ResultSelector<A, Ad, B, Bd, K, R>
  ): ResultSelector<B, Bd, A, Ad, K, R> =>
  (b, a, key) =>
    rSel(a, b, key);
export const invSortSel =
  <E, Ad, Bd, R>(
    rSel: SortedResultSelector<E, Ad, Bd, R>
  ): SortedResultSelector<E, Bd, Ad, R> =>
  (b, a) =>
    rSel(a, b);

export type RawGroup<A, Ad, B, Bd, K> = {
  a: Lazy<A> | Ad;
  b: Lazy<B> | Bd;
  k: K;
};
export const rawSel = <A, Ad, B, Bd, K>(
  a: Lazy<A> | Ad,
  b: Lazy<B> | Bd,
  k: K
): RawGroup<A, Ad, B, Bd, K> => ({ a, b, k });

export type RawSortGroup<E, Ad, Bd> = { a: Lazy<E> | Ad; b: Lazy<E> | Bd };
export const rawSortSel = <E, Ad, Bd>(
  a: Lazy<E> | Ad,
  b: Lazy<E> | Bd
): RawSortGroup<E, Ad, Bd> => ({
  a,
  b,
});
