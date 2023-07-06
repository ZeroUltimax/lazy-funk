import { Accumulator, Lazy, Seed } from "../coreTypes";
import { scan } from "../operators/scan";
import { last } from "./pick";

export function fold<E>(z: Lazy<E>, acc: Accumulator<E, E>, seed?: Seed<E>): E;
export function fold<E, A>(
  z: Lazy<E>,
  acc: Accumulator<A, E>,
  seed: Seed<A>
): A;
export function fold<E, A = E>(
  z: Lazy<E>,
  acc: Accumulator<A, E>,
  seed?: Seed<A>
): A {
  return last(scan(z, acc, seed as any)) as A;
}
