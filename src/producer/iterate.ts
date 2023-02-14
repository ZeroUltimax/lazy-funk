import { Gen, Seed, Successor } from "../coreTypes";
import { lazyfyProducer } from "./lazyfyProducer";

function* _iterate<E>(succ: Successor<E>, seed: Seed<E>): Gen<E> {
  for (let el = seed(); ; el = succ(el)) yield el;
}

export const iterate = lazyfyProducer(_iterate);
