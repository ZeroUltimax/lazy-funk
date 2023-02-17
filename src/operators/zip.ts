import { Gen, Lazy, Zipper } from "../coreTypes";
import { nrgz } from "../funk/nrgz";
import { lazyfyOperator } from "./lazyfyOperator";

function* _zipWith<E, F, R>(
  za: Lazy<E>,
  zb: Lazy<F>,
  zip: Zipper<E, F, R>
): Gen<R> {
  const ita = nrgz(za);
  const itb = nrgz(zb);

  for (
    let nxa = ita.next(), nxb = itb.next();
    !nxa.done && !nxb.done;
    nxa = ita.next(), nxb = itb.next()
  ) {
    const ela = nxa.value;
    const elb = nxb.value;
    yield zip(ela, elb);
  }
}

export const zipWith = lazyfyOperator(_zipWith);

const arrayZip = <E, F>(ela: E, elb: F) => [ela, elb] as const;

export const zip = <E, F>(za: Lazy<E>, zb: Lazy<F>) =>
  zipWith(za, zb, arrayZip);
