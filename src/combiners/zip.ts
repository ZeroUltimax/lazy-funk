import { Gen, Lazy, Zipper } from "../coreTypes";
import { lazyfyCombo } from "../funk/lazyfy";
import { nrgz } from "../funk/nrgz";

function* _zipWith<A, B, R>(
  za: Lazy<A>,
  zb: Lazy<B>,
  zip: Zipper<A, B, R>
): Gen<R> {
  for (
    let ita = nrgz(za), nxa = ita.next(), itb = nrgz(zb), nxb = itb.next();
    !nxa.done && !nxb.done;
    nxa = ita.next(), nxb = itb.next()
  )
    yield zip(nxa.value, nxb.value);
}

export const zipWith = lazyfyCombo(_zipWith);

const arrayZip = <A, B>(ela: A, elb: B): readonly [A, B] => [ela, elb];

export const zip = zipWith(arrayZip);
