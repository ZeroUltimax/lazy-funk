import { Gen } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";

function* _empty<E>(): Gen<E> {}
export const empty = lazyfy(_empty);
