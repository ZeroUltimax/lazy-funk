import { Lazy, Selector } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

export class MemoKeyedIterator<E, K> {
  private keys: K[] = [];
  private map = new Map<K, E[]>();

  static FromLazy<E, K>(z: Lazy<E>, sel: Selector<E, K>) {
    return new MemoKeyedIterator(nrgz(z), sel);
  }
  private constructor(private it: Iterator<E>, private sel: Selector<E, K>) {}

  public *iterateKeys(): Generator<K> {
    const { keys } = this;
    let idx = 0;
    do for (; idx < keys.length; ++idx) yield keys[idx];
    while (this.pullNextKey());
  }

  public *iterateValues(key: K): Generator<E> {
    const { map } = this;
    if (!map.has(key)) map.set(key, []);
    const buff = map.get(key)!;
    let idx = 0;
    do for (; idx < buff.length; ++idx) yield buff[idx];
    while (this.pullNextElement(key));
  }

  private pullNextKey() {
    const { it, sel } = this;
    for (let nx = it.next(); !nx.done; nx = it.next()) {
      const el = nx.value;
      const key = sel(el);
      if (this.push(key, el)) return true;
    }
    return false;
  }

  private pullNextElement(k: K) {
    const { it, sel } = this;
    for (let nx = it.next(); !nx.done; nx = it.next()) {
      const el = nx.value;
      const key = sel(el);
      this.push(key, el);
      if (key === k) return true;
    }
    return false;
  }

  public containsKey(key: K) {
    const { keys, map } = this;
    if (map.has(key)) return true;
    while (this.pullNextKey()) if (keys[keys.length - 1] === key) return true;
    return false;
  }

  private push(key: K, el: E) {
    const { keys, map } = this;
    if (map.has(key)) {
      map.get(key)!.push(el);
      return false;
    }
    keys.push(key);
    map.set(key, [el]);
    return true;
  }
}

export function lazyKeys<E, K>(iter: MemoKeyedIterator<E, K>) {
  return lazyfy(iter.iterateKeys.bind(iter))();
}

export function lazyValues<E, K>(iter: MemoKeyedIterator<E, K>, key: K) {
  return lazyfy(iter.iterateValues.bind(iter))(key);
}
