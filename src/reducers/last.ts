import { Lazy, Seed } from "../coreTypes";
import { throws } from "../funk/throws";

export function lastOrDefault<E>(z: Lazy<E>): E | null;
export function lastOrDefault<E, F>(z: Lazy<E>, seed: Seed<F>): E | F;
export function lastOrDefault<E, F = null>(
  z: Lazy<E>,
  seed: Seed<F> = () => null as F
): E | F {
  const it = z[Symbol.iterator]();
  let nx = it.next();
  if (nx.done) return seed();

  let last = nx.value;
  for (; !nx.done; nx = it.next()) last = nx.value;
  return last;
}

export const last = <E>(z: Lazy<E>) =>
  lastOrDefault(z, () => throws("No match"));
