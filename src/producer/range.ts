import { Gen } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";

function* _range(
  start: number,
  end: number = Infinity,
  step: number = 1
): Gen<number> {
  for (let i = start; i < end; i += step) yield i;
}

export const range = lazyfy(_range);
export const iota = (start: number = 0, step: number = 1) =>
  range(start, Infinity, step);
