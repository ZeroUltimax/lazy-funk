import { Gen, Seed, Successor } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";

function* _iterate<E>(succ: Successor<E>, seed: Seed<E>): Gen<E> {
  for (let el = seed(); ; el = succ(el)) yield el;
}

export const iterate = lazyfy(_iterate);
