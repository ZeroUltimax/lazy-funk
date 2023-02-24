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

function* _union<E, K>(
  iterA: MemoKeyedIterator<E, K>,
  iterB: MemoKeyedIterator<E, K>
) {
  for (const keyA of iterA.iterateKeys()) yield getRepresentant(iterA, keyA);
  for (const keyB of iterB.iterateKeys())
    if (!iterA.containsKey(keyB)) yield getRepresentant(iterB, keyB);
}

function* _intersection<E, K>(
  iterA: MemoKeyedIterator<E, K>,
  iterB: MemoKeyedIterator<E, K>
) {
  for (const keyA of iterA.iterateKeys())
    if (iterB.containsKey(keyA)) yield getRepresentant(iterA, keyA);
}

function* _diff<E, K>(
  iterA: MemoKeyedIterator<E, K>,
  iterB: MemoKeyedIterator<E, K>
) {
  for (const keyA of iterA.iterateKeys())
    if (!iterB.containsKey(keyA)) yield getRepresentant(iterA, keyA);
}

export function setOperationsBy<E, K>(
  za: Lazy<E>,
  zb: Lazy<E>,
  sel: Selector<E, K>
) {
  const iterA = MemoKeyedIterator.FromLazy(za, sel);
  const iterB = MemoKeyedIterator.FromLazy(zb, sel);

  return {
    union: lazyfy(() => _union(iterA, iterB)),
    intersection: lazyfy(() => _intersection(iterA, iterB)),
    aMinusB: lazyfy(() => _diff(iterA, iterB)),
    bMinusA: lazyfy(() => _diff(iterB, iterA)),
  };
}

export const setOperations = <E>(za: Lazy<E>, zb: Lazy<E>) =>
  setOperationsBy(za, zb, id);

export const unionBy = <E, K>(za: Lazy<E>, zb: Lazy<E>, sel: Selector<E, K>) =>
  setOperationsBy(za, zb, sel).union;

export const union = <E>(za: Lazy<E>, zb: Lazy<E>) =>
  setOperations(za, zb).union;

export const intersectionBy = <E, K>(
  za: Lazy<E>,
  zb: Lazy<E>,
  sel: Selector<E, K>
) => setOperationsBy(za, zb, sel).intersection;

export const intersection = <E>(za: Lazy<E>, zb: Lazy<E>) =>
  setOperations(za, zb).intersection;

export const differenceBy = <E, K>(
  za: Lazy<E>,
  zb: Lazy<E>,
  sel: Selector<E, K>
) => setOperationsBy(za, zb, sel).aMinusB;

export const difference = <E>(za: Lazy<E>, zb: Lazy<E>) =>
  setOperations(za, zb).aMinusB;
