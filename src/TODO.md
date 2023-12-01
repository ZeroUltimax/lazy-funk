# Things to do

* Rewrite prefering arrow style functions
  * Ensure Type fine for non-type informed curried version (e.g take(10) will not know the lazy type and return Lazy<unknown>)
    * Anything where the paramters directly inform the lazy type.
  - Handle Covariance
  - Add expected types to tests
- Scratch arrays are typed as readonly if they're passed down to users
-- Commit --
- Pipe type that forwards special lazy's type (sorted, grouped)
- Generic Core types should have A generic interface for when <E> is unknown (e.g. predicate is generic too)
  - Sorted should be Sorted<E,CovE extends E> = Lazy<CovE> & cmp<E>
- Generic core types for `any` input lazy
- Combined interface type for default values where provided (e.g. if we have a default F = null for seed/seedless)
- Assigners for sorted and grouped's key. Search for Object.assign
  - Is the result from sortedX also sorted? Make sure to mark it if so.
- Automatically Covariant type for CovE. This is because the types for Sorted and Grouped aren't automatically Cov
- Common types and helpers, like null seed and combiner selector types
- Rentrant buffered sort
- Review Internal/External setup
  - Internals could take in an it and be fastly composable.
    - This means we must use Manual iteratiion everywhere.
    - Benchmark with lots of data (See below for note on micro benchmarks)
- Custom functions for combined functions
  - flatMap
  - sorted set difference
  - repeatSequence
  - fold
  - foldSeedless
  - sum
  - prod
  - count
  - isEmpty
  - contains
  - Everything in pick.ts
- Sorted set ops should return sorted. (Can they?)
- Review default "defaults"
  - Consitent values
  - Refactoring
  - Efficiency
- Speed tests
  - memory, speed , GC
  - How to no microtest? How to capture GC too?
  - Which is faster? Manual iter or for-of iter?
  - Class vs functional struct for Keyed iterators
    - SortedSetOperations.iter gets bound
  - Reducers using Array + ..., Array and manual fill, Array from iterator, push, what else?
  - Variable reuse vs creating one every loop
   - Also, using X.Y multiple times vs let y = X.Y, y
   - If same, prefer 2nd option for clarity
  - Fold should just be a piped function

- Currying helpers to make your own partially applied lazy ops?
  - Intra curry pipe
  - Something like `const adder = curried(map(add)); const add1 = adder(1); const add2 = adder(2);`
- How to nicely pipe with combinators? Is there a cool way to do this?

# Operators/functions to implement

- Chunk
- Slice
- Unzip
- Predicate instances where the pred is === X, where user gives value instead eg first becomes find 
  - I already have `contains`
- Predicates where the user gives a list of keys (filterByKeys)
- Predicates where the user gives a template argument (filterByMatch)


# Style Guide
- Function style
  - If returning a result simply quickly, prefer arrow style
  - If dealing with iterators, use `function`
  - If complicated (algorithm), `function`
  - function should have return type
  - Arrow functions should either return type at top level with an existing known type, or write type at each layers, including return type

- Generics
  - Generics should be typed so that each lvel of partial application is still typed.
  - Generics should allow covariant types for sort/group, as well as for pipe results.