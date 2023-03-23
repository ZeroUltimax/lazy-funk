import { Gen } from "../coreTypes";
import { lazyfyFunk } from "../funk/lazyfy";

function* _empty<E>(): Gen<E> {}
export const empty = lazyfyFunk(_empty);
