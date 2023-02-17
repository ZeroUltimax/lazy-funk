import { Lazy, Predicate, Seed } from "../coreTypes";
import { nrgz } from "../funk/nrgz";
import { isAlway } from "../funk/predicates";
import { throws } from "../funk/throws";
import { filter } from "../operators/filter";

export function lastOrDefault<E>(z: Lazy<E>, pred?: Predicate<E>): E | null;
export function lastOrDefault<E, F>(
  z: Lazy<E>,
  pred: Predicate<E> | undefined,
  seed: Seed<F>
): E | F;
export function lastOrDefault<E, F = null>(
  z: Lazy<E>,
  pred: Predicate<E> = isAlway,
  seed: Seed<F> = () => null as F
): E | F {
  const fz = filter(z, pred);
  const it = nrgz(fz);
  let nx = it.next();
  if (nx.done) return seed();
  let last = nx.value;
  for (; !nx.done; nx = it.next()) last = nx.value;
  return last;
}

export const last = <E>(z: Lazy<E>, pred: Predicate<E> = isAlway) =>
  lastOrDefault(z, pred, () => throws("No match"));
