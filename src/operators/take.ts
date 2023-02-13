import { Count, Gen, Lazy } from "../coreTypes";
import { lazyfyOperator } from "./lazyfyOperator";

// OPT: Would using a combined for(let i=0,it=z(),nx=it.next()...) be faster?
// OPT: Would using a return instead of break be faster?
function* _take<E>(z: Lazy<E>, count: Count): Gen<E> {
  let idx = 0;
  for (const el of z) {
    if (idx++ < count) yield el;
    else break;
  }
}

export const take = lazyfyOperator(_take);
