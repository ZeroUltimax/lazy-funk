import { Group, Lazy, Predicate } from "../../coreTypes";
import { MemoGroupIterable } from "./MemoGroupIterable";

export function partition<E>(
  z: Lazy<E>,
  pred: Predicate<E>
): [Group<E, true>, Group<E, false>] {
  const grps = MemoGroupIterable.FromLazy(z, pred);
  const trueGroup = grps.getGroup(true) as Group<E, true>;
  const falseGroup = grps.getGroup(false) as Group<E, false>;
  return [trueGroup, falseGroup];
}
