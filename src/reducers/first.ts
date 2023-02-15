import { Lazy, Seed } from "../coreTypes";
import { throws } from "../funk/throws";

export function firstOrDefault<E>(z: Lazy<E>): E | null;
export function firstOrDefault<E, F>(z: Lazy<E>, seed: Seed<F>): E | F;
export function firstOrDefault<E, F = null>(
  z: Lazy<E>,
  seed: Seed<F> = () => null as F
): E | F {
  const it = z[Symbol.iterator]();
  const nx = it.next();
  if (nx.done) {
    return seed();
  }

  return nx.value;
}

export const first = <E>(z: Lazy<E>) =>
  firstOrDefault(z, () => throws("No match"));
