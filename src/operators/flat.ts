import { Gen, Lazy } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";

function* _flat<E>(zz: Lazy<Lazy<E>>): Gen<E> {
  for (const z of zz) for (const el of z) yield el;
}

export const flat = lazyfy(_flat);
