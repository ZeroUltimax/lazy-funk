import {
  first,
  firstBy,
  firstOrDefault,
  firstOrDefaultBy,
  last,
  lastBy,
  lastOrDefault,
  lastOrDefaultBy,
  single,
  singleBy,
  singleOrDefault,
  singleOrDefaultBy,
} from "./pick";

describe("first", () => {
  it("Returns first element", () => {
    const numbers = [1, 2, 3];
    const actual = first(numbers);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Throws on empty", () => {
    const numbers: number[] = [];
    expect(() => first(numbers)).toThrow();
  });
});

describe("First By", () => {
  it("Returns first match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n > 1;
    const actual = firstBy(numbers, pred);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  it("Throws on no match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n > 999;
    expect(() => firstBy(numbers, pred)).toThrow();
  });
});

describe("First or Default", () => {
  it("Returns first element", () => {
    const numbers = [1, 2, 3];
    const seed = () => -1;
    const actual = firstOrDefault(numbers, seed);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Returns default on empty", () => {
    const numbers: number[] = [];
    const seed = () => -1;
    const actual = firstOrDefault(numbers, seed);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
});

describe("First or Default By", () => {
  it("Returns first match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n > 1;
    const seed = () => -1;
    const actual = firstOrDefaultBy(numbers, pred, seed);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  it("Returns default on no match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n > 999;
    const seed = () => -1;
    const actual = firstOrDefaultBy(numbers, pred, seed);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
});

describe("Last", () => {
  it("Returns last element", () => {
    const numbers = [1, 2, 3];
    const actual = last(numbers);
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it("Throws on empty", () => {
    const numbers: number[] = [];
    expect(() => last(numbers)).toThrow();
  });
});

describe("Last By", () => {
  it("Returns last match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n <= 2;
    const actual = lastBy(numbers, pred);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  it("Throws on no match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n > 999;
    expect(() => lastBy(numbers, pred)).toThrow();
  });
});

describe("Last or Default", () => {
  it("Returns last element", () => {
    const numbers = [1, 2, 3];
    const seed = () => -1;
    const actual = lastOrDefault(numbers, seed);
    const expected = 3;
    expect(actual).toEqual(expected);
  });
  it("Returns default on empty", () => {
    const numbers: number[] = [];
    const seed = () => -1;
    const actual = lastOrDefault(numbers, seed);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
});

describe("Last or Default By", () => {
  it("Returns last match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n <= 2;
    const seed = () => -1;
    const actual = lastOrDefaultBy(numbers, pred, seed);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  it("Returns default on no match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n > 999;
    const seed = () => -1;
    const actual = lastOrDefaultBy(numbers, pred, seed);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
});

describe("Single", () => {
  it("Returns only element", () => {
    const numbers = [1];
    const actual = single(numbers);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Throws on empty", () => {
    const numbers: number[] = [];
    expect(() => single(numbers)).toThrow();
  });
  it("Throws on multiple elements", () => {
    const numbers = [1, 2];
    expect(() => single(numbers)).toThrow();
  });
});

describe("Single By", () => {
  it("Returns only match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n === 2;
    const actual = singleBy(numbers, pred);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  it("Throws no match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n > 999;
    expect(() => singleBy(numbers, pred)).toThrow();
  });
  it("Throws on multiple matches", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n > 1;
    expect(() => singleBy(numbers, pred)).toThrow();
  });
});

describe("Single or Default", () => {
  it("Returns only element", () => {
    const numbers = [1];
    const seed = () => -1;
    const actual = singleOrDefault(numbers, seed);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Returns default on empty", () => {
    const numbers: number[] = [];
    const seed = () => -1;
    const actual = singleOrDefault(numbers, seed);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("Throws on multiple elements", () => {
    const numbers = [1, 2];
    const seed = () => -1;
    expect(() => singleOrDefault(numbers, seed)).toThrow();
  });
});

describe("Single or Default By", () => {
  it("Returns only match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n === 2;
    const seed = () => -1;
    const actual = singleOrDefaultBy(numbers, pred, seed);
    const expected = 2;
    expect(actual).toEqual(expected);
  });
  it("Returns default no match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n > 999;
    const seed = () => -1;
    const actual = singleOrDefaultBy(numbers, pred, seed);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("Throws on multiple match", () => {
    const numbers = [1, 2, 3];
    const pred = (n: number) => n > 1;
    const seed = () => -1;
    expect(() => singleOrDefaultBy(numbers, pred, seed)).toThrow();
  });
});
