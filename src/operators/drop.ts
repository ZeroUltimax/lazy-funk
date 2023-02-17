import { Count, Gen, Lazy, Predicate } from "../coreTypes";
import { nrgz } from "../funk/nrgz";
import { lazyfyOperator } from "./lazyfyOperator";

function* _drop<E>(z: Lazy<E>, count: Count): Gen<E> {
  let idx = 0;
  for (const el of z) {
    if (idx++ < count) continue;
    else yield el;
  }
}

export const drop = lazyfyOperator(_drop);

function* _dropWhile<E>(z: Lazy<E>, pred: Predicate<E>): Gen<E> {
  const it = nrgz(z);
  let nx;
  for (nx = it.next(); !nx.done; nx = it.next()) {
    const el = nx.value;
    if (!pred(el)) break;
  }
  for (; !nx.done; nx = it.next()) {
    const el = nx.value;
    yield el;
  }
}

export const dropWhile = lazyfyOperator(_dropWhile);
