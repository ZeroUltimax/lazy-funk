// An ammount of things.
export type Count /* count */ = number;

// A position in a sequence.
export type Index /* idx */ = number;

// A generic thing we're working with.
export type Element<E> /* el */ = E;

// Generates an initial value.
export type Seed<E> /* seed */ = () => E;

// Generators the next value in a sequence.
export type Successor<E> /* succ */ = (e: E) => E;

// Decides if an element satisfies a condition.
export type Predicate<E> /* pred */ = (e: E) => boolean;

// Transforms an element into thing.
export type Projection<E, R> /* proj */ = (e: E) => R;

// Chooses a key representing the element.
export type Selector<E, K> /* sel */ = (e: E) => K;

// Creates sucessive values by accumulating elements
export type Accumulator<A, E> /* acc */ = (acc: A, e: E) => A;

// Gives an ordering between two elements.
export type Compare<E> /* cmp */ = (a: E, b: E) => number;

export type Sorted<E> /* grp */ = Lazy<E> & { readonly cmp: Compare<E> };

// Takes two elements and combines them into one.
export type Zipper<E, F, R> /* zip */ = (elA: E, elB: F) => R;

export type Group<E, K> /* grp */ = Lazy<E> & { readonly key: K };

// A single use sequence of elements.
export type Gen<E> /* it */ = Generator<E>;

// A re-useable sequence of elements.
export interface Lazy<E> /* z */ {
  [Symbol.iterator](): Iterator<E, unknown, undefined>;
}

// Produces new generator
export type GenProducer<A extends any[], E> /* _prod */ = (
  ...args: A
) => Gen<E>;

// Produces new lazies
export type LazyProducer<A extends any[], E> /* prod */ = (
  ...args: A
) => Lazy<E>;

// Does something to createa new genenrator
export type GenOperator<A extends any[], E, F> /* _op */ = (
  z: Lazy<E>,
  ...args: A
) => Gen<F>;

// Does something to createa new lazy
export type LazyOperator<A extends any[], E, F> /* op */ = (
  z: Lazy<E>,
  ...args: A
) => Lazy<F>;

// Transforms a lazy into a finalized value
export type LazyReducer<A extends any[], T, R> /* red */ = (
  z: Lazy<T>,
  ...args: A
) => R;
