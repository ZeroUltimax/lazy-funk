import { Lazy, Seed } from "../coreTypes";
import { throws } from "../funk/throws";

export function singleOrDefault<E>(z: Lazy<E>): E | null;
export function singleOrDefault<E, F>(z: Lazy<E>, seed: Seed<F>): E | F;
export function singleOrDefault<E, F = null>(
  z: Lazy<E>,
  seed: Seed<F> = () => null as F
): E | F {
  const it = z[Symbol.iterator]();
  const nx = it.next();
  if (nx.done) {
    return seed();
  }
  const nxx = it.next();
  if (!nxx.done) {
    return throws("Not single");
  }
  return nx.value;
}

export const single = <E>(z: Lazy<E>) =>
  singleOrDefault(z, () => throws("No match"));
