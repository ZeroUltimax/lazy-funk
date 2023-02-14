import { Gen, Lazy, Seed } from "../coreTypes";
import { flat } from "../operators/flat";
import { lazyfyProducer } from "./lazyfyProducer";

function* _repeat<E>(seed: Seed<E>): Gen<E> {
  while (true) yield seed();
}

export const repeat = lazyfyProducer(_repeat);
export const repeatSequence = <E>(seed: () => Lazy<E>) => flat(repeat(seed));
