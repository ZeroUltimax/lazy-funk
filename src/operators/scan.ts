import { Accumulator, Gen, Lazy, Seed } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { throws } from "../funk/throws";

function* _scanSeedless<E>(z: Lazy<E>, acc: Accumulator<E, E>) {
  const it = nrgz(z);
  let nx = it.next();
  if (nx.done) {
    throws("No seed");
  }
  let val = nx.value;
  yield val;
  for (nx = it.next(); !nx.done; nx = it.next()) {
    const el = nx.value;
    val = acc(val, el);
    yield val;
  }
}

function* _scanSeeded<E, A = E>(
  z: Lazy<E>,
  acc: Accumulator<A, E>,
  seed: Seed<A>
): Gen<A> {
  let val = seed();
  yield val;
  for (const el of z) {
    val = acc(val, el);
    yield val;
  }
}

export function scan<E>(
  z: Lazy<E>,
  acc: Accumulator<E, E>,
  seed?: Seed<E>
): Lazy<E>;
export function scan<E, A>(
  z: Lazy<E>,
  acc: Accumulator<A, E>,
  seed: Seed<A>
): Lazy<A>;
export function scan<E, A = E, S extends Seed<A> = Seed<A>>(
  z: Lazy<E>,
  acc: Accumulator<A, E>,
  seed?: S
): Lazy<A> {
  if (seed) {
    return lazyfy(() => _scanSeeded(z, acc, seed));
  } else {
    return lazyfy(() =>
      _scanSeedless(z, acc as unknown as Accumulator<E, E>)
    ) as unknown as Lazy<A>;
  }
}
