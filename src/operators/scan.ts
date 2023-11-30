import { Accumulator, Gen, Lazy, Seed } from "../coreTypes";
import { lazyfyOp } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

function* _scan<E, A = E>(
  z: Lazy<E>,
  acc: Accumulator<A, E>,
  seed: Seed<A>
): Gen<A> {
  let val = seed();
  yield val;
  for (const el of z) yield (val = acc(val, el));
}

export const scan = lazyfyOp(_scan);

function* _scanSeedless<E>(z: Lazy<E>, acc: Accumulator<E, E>) {
  const it = nrgz(z);
  let nx = it.next();
  if (nx.done) throw "No initial element";

  let val;
  yield (val = nx.value);
  for (nx = it.next(); !nx.done; nx = it.next())
    yield (val = acc(val, nx.value));
}

export const scanSeedless = lazyfyOp(_scanSeedless);
