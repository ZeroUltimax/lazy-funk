import { Count, Gen, Lazy, Predicate } from "../coreTypes";
import { lazyfyOp, lazyfyPredOp } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

function* _drop<E>(z: Lazy<E>, count: Count): Gen<E> {
  let idx = 0;
  for (const el of z)
    if (idx++ < count) continue;
    else yield el;
}

export const drop = lazyfyOp(_drop);

function* _dropWhile<E, CovE extends E>(
  z: Lazy<CovE>,
  pred: Predicate<E>
): Gen<CovE> {
  const it = nrgz(z);
  let nx;
  for (nx = it.next(); !nx.done; nx = it.next()) if (!pred(nx.value)) break;
  for (; !nx.done; nx = it.next()) yield nx.value;
}

export const dropWhile = lazyfyPredOp(_dropWhile);
