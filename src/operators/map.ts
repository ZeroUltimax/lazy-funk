import { Gen, Lazy, Projection } from "../coreTypes";
import { flat } from "./flat";
import { lazyfyOperator } from "./lazyfyOperator";

function* _map<E, F>(z: Lazy<E>, proj: Projection<E, F>): Gen<F> {
  for (const el of z) yield proj(el);
}

export const map = lazyfyOperator(_map);
export const flatMap = <E, F>(z: Lazy<E>, proj: Projection<E, Lazy<F>>) =>
  flat(map(z, proj));
