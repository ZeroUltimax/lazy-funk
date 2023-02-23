import { Gen, Lazy, Selector } from "../../coreTypes";
import { id } from "../../funk/id";
import { lazyfyOperator } from "../lazyfyOperator";

function setAdd<K>(set: Set<K>, key: K) {
  if (set.has(key)) return false;
  set.add(key);
  return true;
}

function* _distinctBy<E, K>(z: Lazy<E>, sel: Selector<E, K>): Gen<E> {
  const set = new Set<K>();
  for (const el of z) if (setAdd(set, sel(el))) yield el;
}

export const distinctBy = lazyfyOperator(_distinctBy);
export const distinct = <E>(z: Lazy<E>) => distinctBy(z, id);
