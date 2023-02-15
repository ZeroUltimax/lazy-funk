import { Lazy } from "../coreTypes";

export const toObject = <E, K extends string | number | symbol>(
  z: Lazy<readonly [K, E]>
): { [k in K]: E } => Object.fromEntries(z) as { [k in K]: E };
