import { Count, Gen, Lazy, Predicate } from "../coreTypes";
import { lazyfyOp } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

function* _drop<E>(z: Lazy<E>, count: Count): Gen<E> {
  let idx = 0;
  for (const el of z)
    if (idx++ < count) continue;
    else yield el;
}

export const drop = lazyfyOp(_drop);

function* _dropWhile<E>(z: Lazy<E>, pred: Predicate<E>): Gen<E> {
  const it = nrgz(z);
  let nx;
  for (nx = it.next(); !nx.done; nx = it.next()) if (!pred(nx.value)) break;
  for (; !nx.done; nx = it.next()) yield nx.value;
}

export const dropWhile = lazyfyOp(_dropWhile);
