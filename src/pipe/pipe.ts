import { Lazy, AppliedLazyOperator, AppliedLazyReducer } from "../coreTypes";
import { Pipe, Spout } from "./pipeType";

function _chain(val: any, fns: Array<(x: any) => any>): any {
  for (const fn of fns) val = fn(val);
  return val;
}

export const pipe: Pipe = function (
  ...AOps: Array<AppliedLazyOperator<any, any>>
) {
  return function (z: Lazy<any>): Lazy<any> {
    return _chain(z, AOps);
  };
};

export const spout: Spout = function (
  ...AOps: Array<AppliedLazyOperator<any, any>>
) {
  return function (red: AppliedLazyReducer<any, any>) {
    return function (z: Lazy<any>): any {
      return _chain(z, [...AOps, red]);
    };
  };
};
