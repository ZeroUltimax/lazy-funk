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

// Gives an ordering between two elements.
export type Compare<E> /* cmp */ = (a: E, b: E) => number;

// A single use sequence of elements.
export type Gen<E> /* it */ = Generator<E>;

// A re-useable sequence of elements.
export type Lazy<E> /* z */ = Iterable<E>;

// A sequence of grouped sequences, and their key.
export type LazyGroup<E, K> /* zz */ = Lazy<[K, Lazy<E>]>;

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
