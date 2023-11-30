import { Lazy, LazyOperator, LazyReducer } from "../coreTypes";
import { Pipe, Spout } from "./pipeType";

const _chain = (val: any, fns: Array<(x: any) => any>): any =>
  fns.reduce((acc, fn) => fn(acc), val);

export const pipe: Pipe =
  (...AOps: Array<LazyOperator<any, any>>) =>
  (z: Lazy<any>): Lazy<any> =>
    _chain(z, AOps);

export const spout: Spout =
  (...AOps: Array<LazyOperator<any, any>>) =>
  (red: LazyReducer<any, any>) =>
  (z: Lazy<any>): any =>
    _chain(z, [...AOps, red]);
