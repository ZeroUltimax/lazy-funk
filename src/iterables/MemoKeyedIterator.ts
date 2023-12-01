import { Lazy, Selector } from "../coreTypes";
import { repIter } from "../funk/_rep";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

export class MemoKeyedIterator<E, CovE extends E, K> {
  private keys: K[] = [];
  private map = new Map<K, CovE[]>();

  static FromLazy<E, CovE extends E, K>(z: Lazy<CovE>, sel: Selector<E, K>) {
    return new MemoKeyedIterator(nrgz(z), sel);
  }
  private constructor(
    private it: Iterator<CovE>,
    private sel: Selector<E, K>
  ) {}

  public *iterateKeys(): Generator<K> {
    const { keys } = this;
    let idx = 0;
    do for (; idx < keys.length; ++idx) yield keys[idx];
    while (this.pullNextKey());
  }

  public *iterateValues(key: K): Generator<CovE> {
    const { map } = this;
    if (!map.has(key)) map.set(key, []);
    const buff = map.get(key)!;
    let idx = 0;
    do for (; idx < buff.length; ++idx) yield buff[idx];
    while (this.pullNextElement(key));
  }

  private pullNextKey(): boolean {
    const { it, sel } = this;
    for (let nx = it.next(); !nx.done; nx = it.next())
      if (this.push(sel(nx.value), nx.value)) return true;
    return false;
  }

  private pullNextElement(k: K): boolean {
    const { it, sel } = this;
    for (let nx = it.next(); !nx.done; nx = it.next()) {
      const key = sel(nx.value);
      this.push(key, nx.value);
      if (key === k) return true;
    }
    return false;
  }

  public containsKey(key: K): boolean {
    const { keys, map } = this;
    if (map.has(key)) return true;
    while (this.pullNextKey()) if (keys[keys.length - 1] === key) return true;
    return false;
  }

  private push(key: K, el: CovE): boolean {
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

export const lazyKeys = <E, CovE extends E, K>(
  iter: MemoKeyedIterator<E, CovE, K>
): Lazy<K> => lazyfy(iter.iterateKeys.bind(iter))();

export const lazyValues = <E, CovE extends E, K>(
  iter: MemoKeyedIterator<E, CovE, K>,
  key: K
): Lazy<CovE> => lazyfy(iter.iterateValues.bind(iter))(key);

export const repMemo = <E, CovE extends E, K>(
  iter: MemoKeyedIterator<E, CovE, K>,
  key: K
): CovE => repIter(iter.iterateValues(key));
