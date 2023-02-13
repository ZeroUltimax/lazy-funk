import { Gen, Lazy, Predicate } from "../coreTypes";
import { lazyfyOperator } from "./lazyfyOperator";

function* _filter<E>(z: Lazy<E>, pred: Predicate<E>): Gen<E> {
  for (const el of z) if (pred(el)) yield el;
}

export const filter = lazyfyOperator(_filter);
