import { Lazy } from "../coreTypes";

// I'm just lazy and I dont want the complicated iterator syntax every time.
export const nrgz = <E>(z: Lazy<E>) => z[Symbol.iterator]();
