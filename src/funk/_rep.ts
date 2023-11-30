import { Lazy } from "../coreTypes";
import { nrgz } from "./nrgz";

// Forcibly pull the first element of an iterator known to have at least one entry
export const repIter = <E>(it: Iterator<E>): E =>
  (it.next() as IteratorYieldResult<E>).value;

// Forcibly pull the first element of a lazy known to have at least one entry
export const rep = <E>(z: Lazy<E>): E => repIter(nrgz(z));
