import { Compare, Gen, Lazy, Predicate } from "../coreTypes";

function pivotPredicate<E>(piv: E, cmp: Compare<E>): Predicate<E> {
  return function (el: E) {
    return cmp(el, piv) < 0;
  };
}

function swp<E>(buf: E[], a: number, b: number) {
  const swp = buf[a];
  buf[a] = buf[b];
  buf[b] = swp;
}

function* _insertSort<E>(
  buf: E[],
  cmp: Compare<E>,
  start: number,
  end: number
): Gen<E> {
  for (let i = start; i < end; ++i) {
    let idx = i;
    for (let j = i + 1; j < end; ++j) {
      if (cmp(buf[j], buf[idx]) < 0) {
        idx = j;
      }
    }
    swp(buf, idx, i);
    yield buf[i];
  }
}

function heapSiftDown<E>(
  buf: E[],
  last: number,
  size: number,
  cmp: Compare<E>,
  rootIdx: number
) {
  if (rootIdx >= size) return;

  let swapIdx = rootIdx;
  const leftIdx = (rootIdx << 1) + 1;

  if (leftIdx >= size) return;

  if (cmp(buf[last - leftIdx], buf[last - swapIdx]) < 0) {
    swapIdx = leftIdx;
  }

  const rightIdx = leftIdx + 1;
  if (rightIdx < size) {
    if (cmp(buf[last - rightIdx], buf[last - swapIdx]) < 0) {
      swapIdx = rightIdx;
    }
  }

  if (swapIdx === rootIdx) return;
  swp(buf, last - rootIdx, last - swapIdx);
  heapSiftDown(buf, last, size, cmp, swapIdx);
}

function heapify<E>(buf: E[], last: number, size: number, cmp: Compare<E>) {
  for (let i = (size - 2) >> 1; i >= 0; i--) {
    heapSiftDown(buf, last, size, cmp, i);
  }
}

function* _heapSort<E>(
  buf: E[],
  cmp: Compare<E>,
  start: number,
  end: number
): Gen<E> {
  const last = end - 1;
  let size = end - start;
  heapify(buf, last, size, cmp);
  while (size) {
    const nextIdx = last - size + 1;
    swp(buf, nextIdx, last);
    yield buf[nextIdx];
    --size;
    heapSiftDown(buf, last, size, cmp, 0);
  }
}

function med3Pivot<E>(buf: E[], cmp: Compare<E>, start: number, end: number) {
  const mid = (start + end) >> 1;
  const last = end - 1;
  const pivA = buf[start];
  const pivB = buf[mid];
  const pivC = buf[last];
  let piv: number;
  const cmpCode =
    (cmp(pivA, pivB) < 0 ? 0 : 1) |
    (cmp(pivA, pivC) < 0 ? 0 : 2) |
    (cmp(pivB, pivC) < 0 ? 0 : 4);

  switch (cmpCode) {
    case 1: // B < A, A < C, B < C: BAC
    case 6: // A < B, C < A, C < B: CAB
      return buf[start];
    case 0: // A < B, A < C, B < C: ABC
    case 7: // B < A, C < A, C < B: CBA
      piv = mid;
      break;
    case 3: // B < A, C < A, B < C: BCA
    case 4: // A < B, A < C, C < B: ACB
      piv = last;
      break;
    case 2: // A < B, C < A, B < C: Err
    case 5: // B < A, A < C, C < B: Err
    default:
      throw new Error("Unorderable");
  }

  swp(buf, start, piv);
  return buf[start];
}

const SelectionSortSize = 16;

function* _introSort<E>(
  buf: E[],
  cmp: Compare<E>,
  start: number,
  end: number,
  maxDepth: number
): Gen<E> {
  if (end - start <= SelectionSortSize) {
    yield* _insertSort(buf, cmp, start, end);
    return;
  }

  if (maxDepth === 0) {
    yield* _heapSort(buf, cmp, start, end);
    return;
  }

  const piv = med3Pivot(buf, cmp, start, end);
  const pivPred = pivotPredicate(piv, cmp);

  let s = start + 1;
  let e = end;
  while (s < e) {
    const isLt = pivPred(buf[s]);
    if (isLt) {
      ++s;
    } else {
      --e;
      swp(buf, s, e);
    }
  }

  const mid = s;

  yield* _introSort(buf, cmp, start + 1, mid, maxDepth - 1);
  yield piv;
  yield* _introSort(buf, cmp, mid, end, maxDepth - 1);
}

export function sort<E>(z: Lazy<E>, cmp: Compare<E>): Lazy<E> {
  const buf = [...z];
  const start = 0;
  const end = buf.length;
  const maxDepth = Math.log2(end) << 1;
  return {
    [Symbol.iterator]: () => _introSort(buf, cmp, start, end, maxDepth),
  };
}
