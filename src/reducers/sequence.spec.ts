import { empty } from "../producer/empty";
import { range } from "../producer/range";
import { contains, count, isEmpty } from "./sequence";

describe("Sequence", () => {
  it("Counts entries", () => {
    const numbers = range(0, 8);
    const expected = 8;
    const actual = count(numbers);
    expect(actual).toEqual(expected);
  });
  it("Counts empty entries", () => {
    const numbers = empty<any>();
    const expected = 0;
    const actual = count(numbers);
    expect(actual).toEqual(expected);
  });
  it("Detects empty sequence", () => {
    const numbers = empty<any>();
    const expected = true;
    const actual = isEmpty(numbers);
    expect(actual).toEqual(expected);
  });
  it("Detects non-empty sequence", () => {
    const numbers = [1, 2, 3];
    const expected = false;
    const actual = isEmpty(numbers);
    expect(actual).toEqual(expected);
  });
  it("Can tell the presence of an element", () => {
    const numbers = range(0, 10);
    const element = 8;
    const expected = true;
    const actual = contains(element)(numbers);
    expect(actual).toEqual(expected);
  });
  it("Can tell the absence of an element", () => {
    const numbers = range(0, 10);
    const element = 999;
    const expected = false;
    const actual = contains(element)(numbers);
    expect(actual).toEqual(expected);
  });
});
