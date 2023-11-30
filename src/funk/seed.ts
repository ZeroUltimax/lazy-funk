import { Seed } from "../coreTypes";
import { throws } from "./throws";

export const nullSeed: Seed<null> = () => null;
export const throwsSeed =
  (msg: string): Seed<never> =>
  () =>
    throws(msg);
