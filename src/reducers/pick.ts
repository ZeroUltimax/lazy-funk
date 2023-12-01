import { Lazy, LazyReducer, Predicate, Seed } from "../coreTypes";
import { nrgz } from "../funk/nrgz";
import { isAlway } from "../funk/predicates";
import { nullSeed, throwsSeed } from "../funk/seed";
import { throws } from "../funk/throws";
import { filter } from "../operators/filter";

const noMatch = throwsSeed("No match");

function _firstOrDefaultBy<E, F>(
  z: Lazy<E>,
  pred: Predicate<E>,
  seed: Seed<F>
) {
  const fz = filter(pred)(z);
  const it = nrgz(fz);
  let nx = it.next();
  if (nx.done) return seed();
  return nx.value;
}

// Make E covariant
interface OrDefaultBy {
  <E>(pred: Predicate<E>): LazyReducer<E, E | null>;
  <E, F>(pred: Predicate<E>, seed: Seed<F>): LazyReducer<E, E | F>;
}

// Make E covariant
interface OrDefault {
  (): <E>(z: Lazy<E>) => E | null;
  <F>(seed: Seed<F>): <E>(z: Lazy<E>) => E | F;
}

// Make E covariant
export const firstOrDefaultBy: OrDefaultBy =
  <E, F>(pred: Predicate<E>, seed = nullSeed as Seed<F>) =>
  (z: Lazy<E>) =>
    _firstOrDefaultBy(z, pred, seed);
export const firstOrDefault: OrDefault = <E, F>(
  seed: Seed<F> = nullSeed as Seed<F>
) => firstOrDefaultBy<E, F>(isAlway, seed);
// Make E covariant
export const firstBy = <E>(pred: Predicate<E>) =>
  firstOrDefaultBy(pred, noMatch);
export const first = firstOrDefaultBy(isAlway, noMatch);

function _lastOrDefaultBy<E, F>(
  z: Lazy<E>,
  pred: Predicate<E>,
  seed: Seed<F>
): E | F {
  const fz = filter(pred)(z);
  const it = nrgz(fz);
  let nx = it.next();
  if (nx.done) return seed();
  let last = nx.value;
  for (; !nx.done; nx = it.next()) last = nx.value;
  return last;
}

// Make E covariant
export const lastOrDefaultBy: OrDefaultBy =
  <E, F>(pred: Predicate<E>, seed: Seed<F> = nullSeed as Seed<F>) =>
  (z: Lazy<E>) =>
    _lastOrDefaultBy(z, pred, seed);
export const lastOrDefault: OrDefault = <E, F>(
  seed: Seed<F> = nullSeed as Seed<F>
) => lastOrDefaultBy<E, F>(isAlway, seed);
// Make E covariant
export const lastBy = <E>(pred: Predicate<E>) => lastOrDefaultBy(pred, noMatch);
export const last = lastOrDefaultBy(isAlway, noMatch);

function _singleOrDefaultBy<E, F>(
  z: Lazy<E>,
  pred: Predicate<E>,
  seed: Seed<F>
): E | F {
  const fz = filter(pred)(z);
  const it = nrgz(fz);
  const nx = it.next();
  if (nx.done) return seed();
  const nxx = it.next();
  if (!nxx.done) return throws("Not single");
  return nx.value;
}

// Make E covariant
export const singleOrDefaultBy: OrDefaultBy =
  <E, F>(pred: Predicate<E>, seed: Seed<F> = nullSeed as Seed<F>) =>
  (z: Lazy<E>) =>
    _singleOrDefaultBy(z, pred, seed);
export const singleOrDefault: OrDefault = <E, F>(
  seed: Seed<F> = nullSeed as Seed<F>
) => singleOrDefaultBy<E, F>(isAlway, seed);
// Make E covariant
export const singleBy = <E>(pred: Predicate<E>) =>
  singleOrDefaultBy(pred, noMatch);
export const single = singleOrDefaultBy(isAlway, noMatch);
