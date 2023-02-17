import { Lazy, Predicate, Seed } from "../coreTypes";
import { nrgz } from "../funk/nrgz";
import { isAlway } from "../funk/predicates";
import { throws } from "../funk/throws";
import { filter } from "../operators/filter";

// TODO: Add predicate
export function singleOrDefault<E>(z: Lazy<E>, pred?: Predicate<E>): E | null;
export function singleOrDefault<E, F>(
  z: Lazy<E>,
  pred: Predicate<E> | undefined,
  seed: Seed<F>
): E | F;
export function singleOrDefault<E, F = null>(
  z: Lazy<E>,
  pred: Predicate<E> = isAlway,
  seed: Seed<F> = () => null as F
): E | F {
  const fz = filter(z, pred);
  const it = nrgz(fz);
  const nx = it.next();
  if (nx.done) return seed();
  const nxx = it.next();
  if (!nxx.done) return throws("Not single");
  return nx.value;
}

export const single = <E>(z: Lazy<E>, pred?: Predicate<E>) =>
  singleOrDefault(z, pred, () => throws("No match"));
