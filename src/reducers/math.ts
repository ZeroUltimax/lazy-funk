import { Accumulator, Lazy, Seed } from "../coreTypes";
import { fold } from "./fold";

export const accSum: Accumulator<number, number> = (a, b) => a + b;
export const seedSum: Seed<number> = () => 0;
export const sum = (z: Lazy<number>) => fold(z, accSum, seedSum);

export const accProd: Accumulator<number, number> = (a, b) => a * b;
export const seedProd: Seed<number> = () => 1;
export const prod = (z: Lazy<number>) => fold(z, accProd, seedProd);
