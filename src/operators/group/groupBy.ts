import { Lazy, LazyGroup, Selector } from "../../coreTypes";
import { MemoGroupIterable } from "./MemoGroupIterable";

export function groupBy<E, K>(
  z: Lazy<E>,
  sel: Selector<E, K>
): LazyGroup<E, K> {
  return new MemoGroupIterable(z, sel);
}
