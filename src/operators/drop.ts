import { Count, Gen, Lazy } from "../coreTypes";
import { lazyfyOperator } from "./lazyfyOperator";

// OPT: Would using a combined for(let i=0,it=z(),nx=it.next()...) be faster?
// OPT: Can I somehow yield* the rest?
function* _drop<E>(z: Lazy<E>, count: Count): Gen<E> {
  let idx = 0;
  for (const el of z) {
    if (idx++ < count) continue;
    else yield el;
  }
}

export const drop = lazyfyOperator(_drop);
