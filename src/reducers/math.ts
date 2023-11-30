import { Accumulator, Seed } from "../coreTypes";
import { fold } from "./fold";

export const accSum: Accumulator<number, number> = (a, b) => a + b;
export const seedSum: Seed<number> = () => 0;
export const sum = fold(accSum, seedSum);

export const accProd: Accumulator<number, number> = (a, b) => a * b;
export const seedProd: Seed<number> = () => 1;
export const prod = fold(accProd, seedProd);
