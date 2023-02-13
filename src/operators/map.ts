import { Gen, Lazy, Projection } from "../coreTypes";
import { lazyfyOperator } from "./lazyfyOperator";

function* _map<E, F>(z: Lazy<E>, proj: Projection<E, F>): Gen<F> {
  for (const el of z) yield proj(el);
}

export const map = lazyfyOperator(_map);
