import { Gen, Lazy, Zipper } from "../coreTypes";
import { nrgz } from "../funk/nrgz";
import { lazyfyOperator } from "../operators/lazyfyOperator";

function* _zipWith<A, B, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  zip: Zipper<A, B, R>
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

const arrayZip = <A, B>(ela: A, elb: B) => [ela, elb] as const;

export const zip = <A, B>(za: Lazy<A>, zb: Lazy<B>) =>
  zipWith(za, zb, arrayZip);
