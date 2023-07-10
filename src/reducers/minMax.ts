import { Compare, Lazy, Seed, Selector } from "../coreTypes";
import { cmpInverse, cmpNatural, cmpNum } from "../funk/comparators";
import { id } from "../funk/id";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { throws } from "../funk/throws";
import { fold } from "./fold";

const noElementThrowsSeed = () => throws("No elements");

export function minOrDefaultBy<E, D, K>(
  z: Lazy<E>,
  sel: Selector<E, K>,
  keyCmp: Compare<K>,
  def: Seed<D>
): E | D {
  const it = nrgz(z);
  let nx = it.next();
  if (nx.done) return def();
  let min = nx.value;
  let minKey = sel(min);
  for (nx = it.next(); !nx.done; nx = it.next()) {
    const el = nx.value;
    const key = sel(el);
    const cmpRes = keyCmp(minKey, key);
    if (cmpRes > 0) {
      min = el;
      minKey = key;
    }
  }
  return min;
}

export const minBy = <E, K>(
  z: Lazy<E>,
  sel: Selector<E, K>,
  keyCmp: Compare<K>
): E => minOrDefaultBy(z, sel, keyCmp, noElementThrowsSeed);
export const minOrDefault = <D>(z: Lazy<number>, def: Seed<D>): number | D =>
  minOrDefaultBy(z, id, cmpNum, def);
export const min = (z: Lazy<number>): number =>
  minOrDefaultBy(z, id, cmpNum, noElementThrowsSeed);

export const maxOrDefaultBy = <E, D, K>(
  z: Lazy<E>,
  sel: Selector<E, K>,
  keyCmp: Compare<K>,
  def: Seed<D>
): E | D => minOrDefaultBy(z, sel, cmpInverse(keyCmp), def);
export const maxBy = <E, K>(
  z: Lazy<E>,
  sel: Selector<E, K>,
  keyCmp: Compare<K>
): E => minOrDefaultBy(z, sel, cmpInverse(keyCmp), noElementThrowsSeed);
export const maxOrDefault = <D>(z: Lazy<number>, def: Seed<D>): number | D =>
  minOrDefaultBy(z, id, cmpInverse(cmpNum), def);
export const max = (z: Lazy<number>): number =>
  minOrDefaultBy(z, id, cmpInverse(cmpNum), noElementThrowsSeed);
