import { Gen, Seed, Successor } from "../coreTypes";
import { lazyfyFunk } from "../funk/lazyfy";

function* _iterate<E>(succ: Successor<E>, seed: Seed<E>): Gen<E> {
  for (let el = seed(); ; el = succ(el)) yield el;
}

export const iterate = lazyfyFunk(_iterate);
