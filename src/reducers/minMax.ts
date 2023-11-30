import { Compare, Lazy, Seed, Selector } from "../coreTypes";
import { cmpInverse, cmpNum } from "../funk/comparators";
import { id } from "../funk/id";
import { curryReducer } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { throwsSeed } from "../funk/seed";

const noElement = throwsSeed("No elements");

function _minOrDefaultBy<E, D, K>(
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
    const key = sel(nx.value);
    const cmpRes = keyCmp(minKey, key);
    if (cmpRes > 0) {
      min = nx.value;
      minKey = key;
    }
  }
  return min;
}

export const minOrDefaultBy = curryReducer(_minOrDefaultBy);
export const minBy = <E, K>(sel: Selector<E, K>, keyCmp: Compare<K>) =>
  minOrDefaultBy(sel, keyCmp, noElement);
export const minOrDefault = <D>(def: Seed<D>) =>
  minOrDefaultBy<number, D, number>(id, cmpNum, def);
export const min = minOrDefaultBy<number, never, number>(id, cmpNum, noElement);

export const maxOrDefaultBy = <E, D, K>(
  sel: Selector<E, K>,
  keyCmp: Compare<K>,
  def: Seed<D>
) => minOrDefaultBy(sel, cmpInverse(keyCmp), def);
export const maxBy = <E, K>(sel: Selector<E, K>, keyCmp: Compare<K>) =>
  minOrDefaultBy(sel, cmpInverse(keyCmp), noElement);
export const maxOrDefault = <D>(def: Seed<D>) =>
  minOrDefaultBy<number, D, number>(id, cmpInverse(cmpNum), def);
export const max = minOrDefaultBy<number, never, number>(
  id,
  cmpInverse(cmpNum),
  noElement
);
