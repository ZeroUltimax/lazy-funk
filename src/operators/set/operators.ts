import { Lazy, Selector } from "../../coreTypes";
import { id } from "../../funk/id";
import { lazyfy } from "../../funk/lazyfy";
import { MemoSetOperationsIterator } from "./MemoSetOperationsIterator";

export function setOperationsBy<E, K>(
  za: Lazy<E>,
  zb: Lazy<E>,
  sel: Selector<E, K>
) {
  const ops = MemoSetOperationsIterator.FromLazy(za, zb, sel);
  const genUnion = () => ops.iterateUnion();
  const genIntersection = () => ops.iterateIntersection();
  const genDiff = () => ops.iterateDiff();
  const genInvDiff = () => ops.iterateInverseDiff();

  return {
    union: lazyfy(genUnion),
    intersection: lazyfy(genIntersection),
    aMinusB: lazyfy(genDiff),
    bMinusA: lazyfy(genInvDiff),
  };
}

export const setOperations = <E>(za: Lazy<E>, zb: Lazy<E>) =>
  setOperationsBy(za, zb, id);

export const unionBy = <E, K>(za: Lazy<E>, zb: Lazy<E>, sel: Selector<E, K>) =>
  setOperationsBy(za, zb, sel).union;

export const union = <E>(za: Lazy<E>, zb: Lazy<E>) =>
  setOperations(za, zb).union;

export const intersectionBy = <E, K>(
  za: Lazy<E>,
  zb: Lazy<E>,
  sel: Selector<E, K>
) => setOperationsBy(za, zb, sel).intersection;

export const intersection = <E>(za: Lazy<E>, zb: Lazy<E>) =>
  setOperations(za, zb).intersection;

export const differenceBy = <E, K>(
  za: Lazy<E>,
  zb: Lazy<E>,
  sel: Selector<E, K>
) => setOperationsBy(za, zb, sel).aMinusB;

export const difference = <E>(za: Lazy<E>, zb: Lazy<E>) =>
  setOperations(za, zb).aMinusB;
