import { Gen, Lazy, Seed } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { flat } from "../operators/flat";

function* _repeat<E>(seed: Seed<E>): Gen<E> {
  while (true) yield seed();
}

export const repeat = lazyfy(_repeat);
export const repeatSequence = <E>(seed: Seed<Lazy<E>>) => flat(repeat(seed));
