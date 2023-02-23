import { Lazy, Selector } from "../../coreTypes";
import { nrgz } from "../../funk/nrgz";

export class MemoSetOperationsIterator<E, K> {
  private keys: readonly [K[], K[]] = [[], []];
  private map = [new Map<K, E>(), new Map<K, E>()] as const;
  private it: readonly [Iterator<E>, Iterator<E>];

  static FromLazy<E, K>(z0: Lazy<E>, z1: Lazy<E>, sel: Selector<E, K>) {
    return new MemoSetOperationsIterator(nrgz(z0), nrgz(z1), sel);
  }

  constructor(it0: Iterator<E>, it1: Iterator<E>, private sel: Selector<E, K>) {
    this.it = [it0, it1];
  }

  public *iterateUnion() {
    const [keys0, keys1] = this.keys;
    const [map0, map1] = this.map;
    let idx0 = 0;
    let idx1 = 0;
    do {
      for (; idx0 < keys0.length; ++idx0) {
        const key = keys0[idx0];
        yield map0.get(key)!;
      }
    } while (this.pull(0));

    do {
      for (; idx1 < keys1.length; ++idx1) {
        const key = keys1[idx1];
        const hasIn0 = this.hasKeyIn(0, key);
        if (!hasIn0) yield map1.get(key)!;
      }
    } while (this.pull(1));
  }

  public *iterateIntersection() {
    let idx0 = 0;
    do
      for (; idx0 < this.keys[0].length; ++idx0) {
        const key = this.keys[0][idx0];
        const hasIn1 = this.hasKeyIn(1, key);
        if (hasIn1) yield this.map[0].get(key)!;
      }
    while (this.pull(0));
  }

  public *iterateDiff() {
    let idx0 = 0;
    do
      for (; idx0 < this.keys[0].length; ++idx0) {
        const key = this.keys[0][idx0];
        const hasIn1 = this.hasKeyIn(1, key);
        if (!hasIn1) yield this.map[0].get(key)!;
      }
    while (this.pull(0));
  }

  public *iterateInverseDiff() {
    let idx1 = 0;
    do
      for (; idx1 < this.keys[1].length; ++idx1) {
        const key = this.keys[1][idx1];
        const hasIn0 = this.hasKeyIn(0, key);
        if (!hasIn0) yield this.map[1].get(key)!;
      }
    while (this.pull(1));
  }

  private pull(id: 0 | 1) {
    const it = this.it[id];
    const keys = this.keys[id];
    const map = this.map[id];
    const sel = this.sel;

    for (let nx = it.next(); !nx.done; nx = it.next()) {
      const el = nx.value;
      const key = sel(el);
      if (!map.has(key)) {
        keys.push(key);
        map.set(key, el);
        return true;
      }
    }
    return false;
  }

  private hasKeyIn(id: 0 | 1, key: K) {
    const keys = this.keys[id];
    const map = this.map[id];
    if (map.has(key)) return true;
    while (this.pull(id)) if (keys[keys.length - 1] === key) return true;
    return false;
  }
}
