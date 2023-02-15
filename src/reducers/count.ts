import { Count, Lazy } from "../coreTypes";

export function count<E>(z: Lazy<E>): number {
  let count: number = 0;
  for (const _ of z) ++count;
  return count;
}
