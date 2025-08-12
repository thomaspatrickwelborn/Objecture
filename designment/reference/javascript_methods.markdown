| Type   | Method                  | Category   | Arguments                              |
|--------|-------------------------|------------|----------------------------------------|
| Array  | copyWithin              | Mutator    | target, start, end                     |
| Array  | fill                    | Mutator    | value, start, end                      |
| Array  | pop                     | Mutator    | None                                   |
| Array  | push                    | Mutator    | element1, ..., elementN                |
| Array  | reverse                 | Mutator    | None                                   |
| Array  | shift                   | Mutator    | None                                   |
| Array  | sort                    | Mutator    | compareFunction                        |
| Array  | splice                  | Mutator    | start, deleteCount, item1, ..., itemN  |
| Array  | unshift                 | Mutator    | element1, ..., elementN                |
| Array  | concat                  | Accessor   | value1, ..., valueN                    |
| Array  | includes                | Accessor   | searchElement, fromIndex               |
| Array  | indexOf                 | Accessor   | searchElement, fromIndex               |
| Array  | join                    | Accessor   | separator                              |
| Array  | lastIndexOf             | Accessor   | searchElement, fromIndex               |
| Array  | slice                   | Accessor   | start, end                             |
| Array  | toLocaleString          | Accessor   | locales, options                       |
| Array  | toString                | Accessor   | None                                   |
| Array  | at                      | Accessor   | index                                  |
| Array  | entries                 | Accessor   | None                                   |
| Array  | keys                    | Accessor   | None                                   |
| Array  | values                  | Accessor   | None                                   |
| Array  | [Symbol.iterator]       | Accessor   | None                                   |
| Array  | toReversed              | Accessor   | None                                   |
| Array  | toSorted                | Accessor   | compareFunction                        |
| Array  | toSpliced               | Accessor   | start, deleteCount, item1, ..., itemN  |
| Array  | with                    | Accessor   | index, value                           |
| Array  | every                   | Iteration  | predicate, thisArg                     |
| Array  | filter                  | Iteration  | predicate, thisArg                     |
| Array  | find                    | Iteration  | predicate, thisArg                     |
| Array  | findIndex               | Iteration  | predicate, thisArg                     |
| Array  | findLast                | Iteration  | predicate, thisArg                     |
| Array  | findLastIndex           | Iteration  | predicate, thisArg                     |
| Array  | flat                    | Iteration  | depth                                  |
| Array  | flatMap                 | Iteration  | callback, thisArg                      |
| Array  | forEach                 | Iteration  | callback, thisArg                      |
| Array  | map                     | Iteration  | callback, thisArg                      |
| Array  | reduce                  | Iteration  | callback, initialValue                 |
| Array  | reduceRight             | Iteration  | callback, initialValue                 |
| Array  | some                    | Iteration  | predicate, thisArg                     |
| Object | assign                  | Mutator    | target, source1, ..., sourceN          |
| Object | defineProperties        | Mutator    | object, descriptors                    |
| Object | defineProperty          | Mutator    | object, property, descriptor           |
| Object | freeze                  | Mutator    | object                                 |
| Object | preventExtensions       | Mutator    | object                                 |
| Object | seal                    | Mutator    | object                                 |
| Object | setPrototypeOf          | Mutator    | object, prototype                      |
| Object | create                  | Creator    | proto, propertiesObject                |
| Object | fromEntries             | Creator    | entries                                |
| Object | groupBy                 | Creator    | values, callback                       |
| Object | entries                 | Accessor   | object                                 |
| Object | getOwnPropertyDescriptor| Accessor   | object, property                       |
| Object | getOwnPropertyDescriptors| Accessor  | object                                 |
| Object | getOwnPropertyNames     | Accessor   | object                                 |
| Object | getOwnPropertySymbols   | Accessor   | object                                 |
| Object | getPrototypeOf          | Accessor   | object                                 |
| Object | keys                    | Accessor   | object                                 |
| Object | values                  | Accessor   | object                                 |
| Object | toLocaleString          | Accessor   | None                                   |
| Object | toString                | Accessor   | None                                   |
| Object | valueOf                 | Accessor   | None                                   |
| Object | hasOwn                  | Inspector  | object, property                       |
| Object | is                      | Inspector  | value1, value2                         |
| Object | isExtensible            | Inspector  | object                                 |
| Object | isFrozen                | Inspector  | object                                 |
| Object | isSealed                | Inspector  | object                                 |
| Object | hasOwnProperty          | Inspector  | property                               |
| Object | isPrototypeOf           | Inspector  | object                                 |
| Object | propertyIsEnumerable    | Inspector  | property                               |
| Map    | clear                   | Mutator    | None                                   |
| Map    | delete                  | Mutator    | key                                    |
| Map    | set                     | Mutator    | key, value                             |
| Map    | get                     | Accessor   | key                                    |
| Map    | has                     | Accessor   | key                                    |
| Map    | groupBy                 | Accessor   | values, callback                       |
| Map    | entries                 | Iteration  | None                                   |
| Map    | forEach                 | Iteration  | callback, thisArg                      |
| Map    | keys                    | Iteration  | None                                   |
| Map    | values                  | Iteration  | None                                   |
| Map    | [Symbol.iterator]       | Iteration  | None                                   |