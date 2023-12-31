import { Group } from "../coreTypes";
import { groupBy, partition } from "./group";
import { map } from "./map";

describe("Group By", () => {
  it("Groups by key", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const text = ["zero", "one", "two", "three", "four", "five"];
    const sel = (n: number) => text[n][0];
    const expected = [
      ["z", [0]],
      ["o", [1]],
      ["t", [2, 3]],
      ["f", [4, 5]],
    ];
    const actual = [
      ...map((z: Group<number, string>) => [z.key, [...z]])(
        groupBy(sel)(inputs)
      ),
    ];
    expect(actual).toStrictEqual(expected);
  });
});

describe("Partition", () => {
  it("Partitions by letters", () => {
    const inputs = [0, 1, 2, 3, 4, 5];
    const text = ["zero", "one", "two", "three", "four", "five"];
    const sel = (n: number) => text[n].includes("o");
    const expected = [
      [0, 1, 2, 4],
      [3, 5],
    ];
    const actual = [
      ...map((z: Group<number, boolean>) => [...z] as const)(
        partition(sel)(inputs)
      ),
    ];
    expect(actual).toStrictEqual(expected);
  });
});
