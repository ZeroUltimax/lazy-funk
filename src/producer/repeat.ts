import { Gen, Lazy, Seed } from "../coreTypes";
import { lazyfyFunk } from "../funk/lazyfy";
import { flat } from "../operators/flat";

function* _repeat<E>(seed: Seed<E>): Gen<E> {
  while (true) yield seed();
}

export const repeat = lazyfyFunk(_repeat);
export const repeatSequence = <E>(seed: () => Lazy<E>) => flat(repeat(seed));
