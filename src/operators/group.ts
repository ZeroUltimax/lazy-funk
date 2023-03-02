import { Group, Lazy, Predicate, Selector } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { MemoKeyedIterator } from "../iterables/MemoKeyedIterator";

const getGroup = <E, K>(iter: MemoKeyedIterator<E, K>, key: K): Group<E, K> =>
  Object.assign(
    lazyfy(() => iter.iterateValues(key)),
    { key }
  );

function* _groups<E, K>(iter: MemoKeyedIterator<E, K>) {
  for (const key of iter.iterateKeys()) {
    yield getGroup(iter, key);
  }
}

export function groupBy<E, K>(z: Lazy<E>, sel: Selector<E, K>) {
  const iter = MemoKeyedIterator.FromLazy(z, sel);
  return lazyfy(() => _groups(iter));
}

export function partition<E>(
  z: Lazy<E>,
  pred: Predicate<E>
): [Group<E, true>, Group<E, false>] {
  const grps = MemoKeyedIterator.FromLazy(z, pred);
  const trueGroup = getGroup(grps, true) as Group<E, true>;
  const falseGroup = getGroup(grps, false) as Group<E, false>;
  return [trueGroup, falseGroup];
}
