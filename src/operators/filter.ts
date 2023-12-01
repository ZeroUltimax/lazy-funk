import { Gen, Lazy, Predicate } from "../coreTypes";
import { lazyfyPredOp } from "../funk/lazyfy";

function* _filter<E, CovE extends E>(
  z: Lazy<CovE>,
  pred: Predicate<E>
): Gen<CovE> {
  for (const el of z) if (pred(el)) yield el;
}

export const filter = lazyfyPredOp(_filter);
