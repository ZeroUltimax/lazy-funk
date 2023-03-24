import { cmpNum } from "../funk/comparators";
import { assertSorted, asSorted, sort, __TEST_ONLY__ } from "./sort";

const numbers = () => [
  522, 786, 778, 700, 508, 308, 822, 140, 487, 899, 771, 864, 274, 451, 889,
  303, 772, 729, 315, 61, 597, 606, 86, 1008, 975, 461, 473, 802, 625, 447, 746,
  610, 894, 874, 522, 77, 226, 695, 453, 222, 143, 753, 12, 509, 414, 307, 1010,
  591, 536, 148, 540, 1016, 556, 700, 482, 586, 270, 198, 809, 296, 640, 762,
  199, 797, 280, 94, 806, 354, 975, 54, 216, 900, 178, 173, 970, 424, 874, 978,
  857, 1007, 727, 867, 87, 302, 305, 849, 114, 627, 130, 855, 118, 264, 750,
  415, 805, 785, 318, 212, 515, 800, 171, 715, 1000, 828, 660, 24, 273, 779,
  260, 891, 750, 374, 294, 232, 262, 440, 755, 122, 630, 128, 555, 603, 439,
  249, 678, 301, 687, 500, 190, 654, 146, 280, 32, 53, 9, 463, 939, 325, 1004,
  559, 627, 118, 270, 173, 315, 786, 441, 491, 153, 68, 280, 208, 586, 339, 148,
  652, 775, 909, 277, 263, 239, 320, 719, 246, 543, 546, 310, 656, 220, 813,
  580, 881, 109, 46, 702, 207, 499, 857, 712, 317, 118, 456, 129, 1, 454, 413,
  707, 309, 474, 90, 452, 10, 181, 902, 184, 263, 1004, 935, 558, 981, 1019,
  316, 378, 252, 432, 401, 332, 375, 271, 715, 171, 968, 790, 782, 38, 1004,
  714, 110, 525, 554, 325, 810, 838, 457, 622, 853, 348, 487, 508, 156, 47, 816,
  424, 55, 727, 338, 186, 978, 548, 435, 994, 235, 554, 384, 773, 658, 191, 685,
  235, 712, 777, 378, 746, 617, 782,
];

describe("sort", () => {
  it("Sorts Numbers Desc", () => {
    const cmp = (a: number, b: number) => b - a;
    const actual = [...sort(numbers(), cmp)];
    const expected = numbers().sort(cmp);
    expect(actual).toEqual(expected);
  });
  it("Sorts with heapsort", () => {
    const { _heapSort } = __TEST_ONLY__;
    const nums = numbers();
    const cmp = (a: number, b: number) => b - a;
    const actual = [..._heapSort(nums, cmp, 0, nums.length)];
    const expected = numbers().sort(cmp);
    expect(actual).toEqual(expected);
  });
});

describe("asSorted", () => {
  it("Marks a lazy sorted", () => {
    const numbers = [1, 2, 3];
    const actual = asSorted(numbers, cmpNum);
    const actualNumbers = [...actual];
    const actualCmp = actual.cmp;
    const expectedNumbers = numbers;
    const expectedCmp = cmpNum;
    expect(actualNumbers).toEqual(expectedNumbers);
    expect(actualCmp).toEqual(expectedCmp);
  });
});

describe("assertSorted", () => {
  it("Checks that a lazy is sorted", () => {
    const numbers = [1, 2, 3];
    const actual = assertSorted(numbers, cmpNum);
    const actualNumbers = [...actual];
    const actualCmp = actual.cmp;
    const expectedNumbers = numbers;
    const expectedCmp = cmpNum;
    expect(actualNumbers).toEqual(expectedNumbers);
    expect(actualCmp).toEqual(expectedCmp);
  });
  it("Throws if the lazy is not sorted", () => {
    const numbers = [1, 2, 0];
    const actual = assertSorted(numbers, cmpNum);
    expect(() => [...actual]).toThrow();
  });
});
