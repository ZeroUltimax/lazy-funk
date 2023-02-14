import type { Gen, Group, Lazy, LazyGroup, Selector } from "../../coreTypes";

export class MemoGroupIterable<E, K> implements LazyGroup<E, K> {
  private keys: K[] = [];
  private mem = new Map<K, E[]>();

  public static FromLazy<E, K>(z: Lazy<E>, sel: Selector<E, K>) {
    return new MemoGroupIterable(z[Symbol.iterator](), sel);
  }

  constructor(private it: Iterator<E>, private sel: Selector<E, K>) {}

  public *iterateKeys(): Generator<K> {
    const buff = this.keys;
    let idx = 0;
    do {
      for (; idx < buff.length; ++idx) {
        yield buff[idx];
      }
    } while (this.pullGroup());
  }

  public *iterateValues(k: K): Generator<E> {
    const buff = this.getKeyBuffer(k);
    let idx = 0;
    do {
      for (; idx < buff.length; ++idx) {
        yield buff[idx];
      }
    } while (this.pullKey(k));
  }

  private pullGroup(): boolean {
    for (let n = this.it.next(); !n.done; n = this.it.next()) {
      const e = n.value;
      const k = this.sel(e);
      const newKey = !this.mem.has(k);

      this.push(k, e);
      if (newKey) {
        return true;
      }
    }
    return false;
  }

  private pullKey(key: K): boolean {
    for (let n = this.it.next(); !n.done; n = this.it.next()) {
      const e = n.value;
      const k = this.sel(e);
      const sameKey = k === key;

      this.push(k, e);
      if (sameKey) {
        return true;
      }
    }
    return false;
  }

  private push(k: K, e: E) {
    const buff = this.getKeyBuffer(k);
    buff.push(e);
  }

  private getKeyBuffer(k: K) {
    let buff = this.mem.get(k);
    if (buff == null) {
      buff = [];
      this.keys.push(k);
      this.mem.set(k, buff);
    }
    return buff;
  }

  public *[Symbol.iterator](): Gen<Group<E, K>> {
    for (const key of this.iterateKeys()) {
      yield this.getGroup(key);
    }
  }

  public getGroup(key: K): Group<E, K> {
    return { key, [Symbol.iterator]: () => this.iterateValues(key) };
  }
}
