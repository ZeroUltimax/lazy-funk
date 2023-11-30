import { Accumulator, Lazy, Seed } from "../coreTypes";
import { curryReducer } from "../funk/lazyfy";
import { scan, scanSeedless } from "../operators/scan";
import { last } from "./pick";

const _fold = <E, A>(z: Lazy<E>, acc: Accumulator<A, E>, seed: Seed<A>): A =>
  last(scan(acc, seed)(z));

export const fold = curryReducer(_fold);

const _foldSeedless = <E>(z: Lazy<E>, acc: Accumulator<E, E>): E =>
  last(scanSeedless(acc)(z));

export const foldSeedless = curryReducer(_foldSeedless);
