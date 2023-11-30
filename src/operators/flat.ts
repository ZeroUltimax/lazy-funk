import { Gen, Lazy } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";

function* _flat<ZE extends Lazy<any>>(
  zz: Lazy<ZE>
): Gen<ZE extends Lazy<infer E> ? E : never> {
  for (const z of zz) for (const el of z) yield el;
}

export const flat = lazyfy(_flat);
