import { Accumulator, Compare, Lazy, Seed, Selector } from "../coreTypes";
import { cmpInverse, cmpNatural, cmpNum } from "../funk/comparators";
import { id } from "../funk/id";
import { fold } from "./fold";
import { maxBy, minBy } from "./minMax";

export const accSum: Accumulator<number, number> = (a, b) => a + b;
export const seedSum: Seed<number> = () => 0;
export const sum = (z: Lazy<number>) => fold(z, accSum, seedSum);

export const accProd: Accumulator<number, number> = (a, b) => a * b;
export const seedProd: Seed<number> = () => 1;
export const prod = (z: Lazy<number>) => fold(z, accProd, seedProd);

const seedMin: Seed<number> = () => Number.POSITIVE_INFINITY;
export const min = (z: Lazy<number>) => minBy(z, id, cmpNum, seedMin);

const seedMax: Seed<number> = () => Number.NEGATIVE_INFINITY;
export const max = (z: Lazy<number>) => maxBy(z, id, cmpNum, seedMax);
