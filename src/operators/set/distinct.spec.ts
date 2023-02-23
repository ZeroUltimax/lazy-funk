import { distinct, distinctBy } from "./distinct";

describe("Distinct", () => {
  it("Removes duplicates", () => {
    const numbers = [
      10, 20, 18, 4, 15, 11, 7, 7, 9, 9, 14, 6, 7, 13, 8, 20, 12, 15, 16, 14,
    ];
    const expectd = [10, 20, 18, 4, 15, 11, 7, 9, 14, 6, 13, 8, 12, 16];
    const actual = [...distinct(numbers)];
    expect(actual).toEqual(expectd);
  });
});

describe("Distinct By", () => {
  it("Removes duplicates", () => {
    const words = [
      "one",
      "heat",
      "crazy",
      "harsh",
      "resolute",
      "decorate",
      "bore",
      "hook",
      "grab",
      "run",
      "squalid",
      "shake",
    ];
    const selLength = (w: string) => w.length;
    const expectd = ["one", "heat", "crazy", "resolute", "squalid"];
    const actual = [...distinctBy(words, selLength)];
    expect(actual).toEqual(expectd);
  });
});
