import { Lazy, Selector } from "../coreTypes";
import { id } from "../funk/id";
import { lazyfy } from "../funk/lazyfy";
import { MemoKeyedIterator } from "../iterables/MemoKeyedIterator";

// This only works as long as we don't insert meaningless keys into iter by calling iterateValues with non-keys
const getRepresentant = <E, K>(iter: MemoKeyedIterator<E, K>, key: K): E =>
  iter.iterateValues(key).next().value;

function* _distinct<E, K>(iter: MemoKeyedIterator<E, K>) {
  for (const key of iter.iterateKeys()) yield getRepresentant(iter, key);
}

export function distinctBy<E, K>(z: Lazy<E>, sel: Selector<E, K>) {
  const iter = MemoKeyedIterator.FromLazy(z, sel);
  return lazyfy(() => _distinct(iter));
}
export const distinct = <E>(z: Lazy<E>) => distinctBy(z, id);
