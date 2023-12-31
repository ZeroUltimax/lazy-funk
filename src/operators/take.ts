import { Count, Gen, Lazy, Predicate } from "../coreTypes";
import { lazyfyOp } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

function* _take<E>(z: Lazy<E>, count: Count): Gen<E> {
  let idx = 0;
  for (const el of z)
    if (idx++ < count) yield el;
    else break;
}

export const take = lazyfyOp(_take);

function* _takeWhile<E>(z: Lazy<E>, pred: Predicate<E>): Gen<E> {
  const it = nrgz(z);
  let nx;
  for (nx = it.next(); !nx.done; nx = it.next())
    if (!pred(nx.value)) break;
    else yield nx.value;
}

// Make E covariant
export const takeWhile = lazyfyOp(_takeWhile);
