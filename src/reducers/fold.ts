import { Accumulator, Lazy, Seed } from "../coreTypes";
import { scan, scanSeedless } from "../operators/scan";
import { last } from "./pick";

export function fold<E, A>(
  z: Lazy<E>,
  acc: Accumulator<A, E>,
  seed: Seed<A>
): A {
  return last(scan(z, acc, seed as any));
}

export function foldSeedless<E>(z: Lazy<E>, acc: Accumulator<E, E>): E {
  return last(scanSeedless(z, acc as any));
}
