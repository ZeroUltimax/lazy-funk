import { Gen } from "../coreTypes";
import { lazyfyProducer } from "./lazyfyProducer";

function* _empty<E>(): Gen<E> {}
export const empty = lazyfyProducer(_empty);
