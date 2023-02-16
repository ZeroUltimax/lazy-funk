import { isNot } from "../funk/predicates";
import { throws } from "../funk/throws";
import { empty } from "../producer/empty";
import { areAll, areAny } from "./logic";

const isOdd = (n: number) => n % 2 == 1;
const isEven = isNot(isOdd);

describe("Logic Reducers", () => {
  describe("areAll", () => {
    it("Returns true if all match", () => {
      const numbers = [1, 3, 5, 7];
      const actual = areAll(numbers, isOdd);
      const expected = true;
      expect(actual).toEqual(expected);
    });
    it("Returns false if one doesn't match", () => {
      const numbers = [1, 3, 4, 5, 7];
      const actual = areAll(numbers, isOdd);
      const expected = false;
      expect(actual).toEqual(expected);
    });
    it("Short circuits to false", () => {
      const numbers = [() => 1, () => throws("Fail")];
      const isEvenGen = (n: () => number) => n() % 2 == 0;
      expect(() => areAll(numbers, isEvenGen)).not.toThrow();
    });
    it("Is true on empty sequence", () => {
      const actual = areAll(empty<number>(), isOdd);
      const expected = true;
      expect(actual).toEqual(expected);
    });
  });
  describe("areAny", () => {
    it("Returns true if any match", () => {
      const numbers = [1, 3, 4, 5, 7];
      const actual = areAny(numbers, isEven);
      const expected = true;
      expect(actual).toEqual(expected);
    });
    it("Returns false if none match", () => {
      const numbers = [1, 3, 5, 7];
      const actual = areAny(numbers, isEven);
      const expected = false;
      expect(actual).toEqual(expected);
    });
    it("Short circuits to true", () => {
      const numbers = [() => 2, () => throws("Fail")];
      const isEvenGen = (n: () => number) => n() % 2 == 0;
      expect(() => areAny(numbers, isEvenGen)).not.toThrow();
    });
    it("Is false on empty sequence", () => {
      const actual = areAny(empty<number>(), isEven);
      const expected = false;
      expect(actual).toEqual(expected);
    });
  });
});
