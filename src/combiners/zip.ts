import { Gen, Lazy, Zipper } from "../coreTypes";
import { lazyfy } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

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

export const zipWith = lazyfy(_zipWith);

const arrayZip = <A, B>(ela: A, elb: B) => [ela, elb] as const;

export const zip = <A, B>(za: Lazy<A>, zb: Lazy<B>) =>
  zipWith(za, zb, arrayZip);
