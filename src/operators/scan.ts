import { Accumulator, Gen, Lazy, Seed } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";
import { throws } from "../funk/throws";

function* _scan<E, A = E>(
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

export const scan = lazyfy(_scan);

function* _scanSeedless<E>(z: Lazy<E>, acc: Accumulator<E, E>) {
  const it = nrgz(z);
  let nx = it.next();
  if (nx.done) {
    throws("No initial element");
  }
  let val = nx.value;
  yield val;
  for (nx = it.next(); !nx.done; nx = it.next()) {
    const el = nx.value;
    val = acc(val, el);
    yield val;
  }
}

export const scanSeedless = lazyfy(_scanSeedless);
