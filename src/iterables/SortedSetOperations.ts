import { Lazy, Sorted } from "../coreTypes";
import { nrgz } from "../funk/nrgz";
import { sortedFullGroupJoin } from "../combiners/sortedGroupJoin";
import { rep } from "../funk/_rep";

interface RawGroupResult<E, Ad, Bd> {
  a: Lazy<E> | Ad;
  b: Lazy<E> | Bd;
}

const rawGroupSelector = <E, Ad, Bd>(
  a: Lazy<E> | Ad,
  b: Lazy<E> | Bd
): RawGroupResult<E, Ad, Bd> => ({ a, b });

export class SortedSetOperations<E> {
  /*
    Future optimization to test:
      - Store only a single rep per pair, and use two bitsets to save if A/B were present
        - Reduces Storage of E[] by half, but add complexity and takes some memory for A/B booleans/bitsarray
  */
  private full: E[] = [];
  private left: E[] = [];
  private inner: E[] = [];
  private right: E[] = [];

  static FromSorted<E>(sza: Sorted<E>, szb: Sorted<E>) {
    const zg = sortedFullGroupJoin(rawGroupSelector<E, null, null>)(szb)(sza);
    return new SortedSetOperations(nrgz(zg));
  }
  private constructor(private it: Iterator<RawGroupResult<E, null, null>>) {}

  public *iter(setKey: "full" | "left" | "inner" | "right"): Generator<E> {
    const set = this[setKey];
    let idx = 0;
    do for (; idx < set.length; ++idx) yield set[idx];
    while (this.pull());
  }

  private pull() {
    const { it } = this;
    const nx = it.next();
    if (nx.done) return false;
    const { a, b } = nx.value;
    this.push(a, b);
    return true;
  }

  private push(a: Lazy<E> | null, b: Lazy<E> | null) {
    if (a) {
      const repA = rep(a);
      this.full.push(repA);
      if (b) this.inner.push(repA);
      else this.left.push(repA);
    } else {
      const repB = rep(b!);
      this.full.push(repB);
      this.right.push(repB);
    }
  }
}
