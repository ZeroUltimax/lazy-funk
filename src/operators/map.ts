import { Gen, Lazy, LazyOperator, Projection } from "../coreTypes";
import { lazyfyOp } from "../funk/lazyfy";
import { flat } from "./flat";

function* _map<E, F>(z: Lazy<E>, proj: Projection<E, F>): Gen<F> {
  for (const el of z) yield proj(el);
}

export const map = lazyfyOp(_map);
export const flatMap =
  <E, F>(proj: Projection<E, Lazy<F>>): LazyOperator<E, F> =>
  (z: Lazy<E>) =>
    flat(map(proj)(z));
