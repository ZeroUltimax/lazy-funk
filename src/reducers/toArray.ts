import { Lazy } from "../coreTypes";

export const toArray = <E>(z: Lazy<E>): E[] => [...z];
