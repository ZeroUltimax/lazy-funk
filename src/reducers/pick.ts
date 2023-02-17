import { Lazy, Predicate, Seed } from "../coreTypes";
import { nrgz } from "../funk/nrgz";
import { isAlway } from "../funk/predicates";
import { throws } from "../funk/throws";
import { filter } from "../operators/filter";

const nullSeed = <F>(): F => null as F;
const noMatchSeed = () => throws("No match");

function _firstOrDefault<E, F>(z: Lazy<E>, pred: Predicate<E>, seed: Seed<F>) {
  const fz = filter(z, pred);
  const it = nrgz(fz);
  let nx = it.next();
  if (nx.done) return seed();
  return nx.value;
}

export const firstOrDefault = <E, F = null>(
  z: Lazy<E>,
  seed: Seed<F> = nullSeed
) => _firstOrDefault(z, isAlway, seed);
export const firstOrDefaultBy = <E, F = null>(
  z: Lazy<E>,
  pred: Predicate<E>,
  seed: Seed<F> = nullSeed
) => _firstOrDefault(z, pred, seed);
export const first = <E>(z: Lazy<E>) =>
  _firstOrDefault(z, isAlway, noMatchSeed);
export const firstBy = <E>(z: Lazy<E>, pred: Predicate<E>) =>
  _firstOrDefault(z, pred, noMatchSeed);

function _lastOrDefault<E, F>(z: Lazy<E>, pred: Predicate<E>, seed: Seed<F>) {
  const fz = filter(z, pred);
  const it = nrgz(fz);
  let nx = it.next();
  if (nx.done) return seed();
  let last = nx.value;
  for (; !nx.done; nx = it.next()) last = nx.value;
  return last;
}

export const lastOrDefault = <E, F = null>(
  z: Lazy<E>,
  seed: Seed<F> = nullSeed
) => _lastOrDefault(z, isAlway, seed);
export const lastOrDefaultBy = <E, F = null>(
  z: Lazy<E>,
  pred: Predicate<E>,
  seed: Seed<F> = nullSeed
) => _lastOrDefault(z, pred, seed);
export const last = <E>(z: Lazy<E>) => _lastOrDefault(z, isAlway, noMatchSeed);
export const lastBy = <E>(z: Lazy<E>, pred: Predicate<E>) =>
  _lastOrDefault(z, pred, noMatchSeed);

function _singleOrDefault<E, F>(
  z: Lazy<E>,
  pred: Predicate<E>,
  seed: Seed<F>
): E | F {
  const fz = filter(z, pred);
  const it = nrgz(fz);
  const nx = it.next();
  if (nx.done) return seed();
  const nxx = it.next();
  if (!nxx.done) return throws("Not single");
  return nx.value;
}

export const singleOrDefault = <E, F = null>(
  z: Lazy<E>,
  seed: Seed<F> = nullSeed
) => _singleOrDefault(z, isAlway, seed);
export const singleOrDefaultBy = <E, F = null>(
  z: Lazy<E>,
  pred: Predicate<E>,
  seed: Seed<F> = nullSeed
) => _singleOrDefault(z, pred, seed);
export const single = <E>(z: Lazy<E>) =>
  _singleOrDefault(z, isAlway, noMatchSeed);
export const singleBy = <E>(z: Lazy<E>, pred: Predicate<E>) =>
  _singleOrDefault(z, pred, noMatchSeed);
