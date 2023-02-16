import { Compare, Lazy, Seed, Selector } from "../coreTypes";
import { cmpInverse, cmpNatural, cmpNum } from "../funk/comparators";
import { id } from "../funk/id";
import { fold } from "./fold";

const accMinBy =
  <E, K>(sel: Selector<E, K>, keyCmp: Compare<K>) =>
  (acc: E, el: E) =>
    keyCmp(sel(acc), sel(el)) < 0 ? acc : el;
export const minBy = <E, K>(
  z: Lazy<E>,
  sel: Selector<E, K>,
  keyCmp: Compare<K> = cmpNatural,
  def?: Seed<E>
) => fold(z, accMinBy(sel, keyCmp), def);
const seedMin: Seed<number> = () => Number.POSITIVE_INFINITY;
export const min = (z: Lazy<number>) => minBy(z, id, cmpNum, seedMin);

export const maxBy = <E, K>(
  z: Lazy<E>,
  sel: Selector<E, K>,
  keyCmp: Compare<K> = cmpNatural,
  def?: Seed<E>
) => fold(z, accMinBy(sel, cmpInverse(keyCmp)), def);
const seedMax: Seed<number> = () => Number.NEGATIVE_INFINITY;
export const max = (z: Lazy<number>) => maxBy(z, id, cmpNum, seedMax);
