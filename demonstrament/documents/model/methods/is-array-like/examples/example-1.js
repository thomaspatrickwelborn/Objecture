import { isArrayLike } from '/dependencies/recourse.js'
console.log("-------------------------")
console.log("Is Array Like | Example 1")
console.log("-------------------------")
const arrayLikeObject00 = Object.defineProperties({}, {
  "0": { value: 1 },
  "1": { value: 2 },
  "2": { value: 3 },
  "3": { value: 4 },
  "length": { value: 4 },
}) // true
const arrayLikeObject01 = Object.defineProperties({}, {
  "0": { enumerable: true, value: 1 },
  "1": { enumerable: true, value: 2 },
  "2": { enumerable: true, value: 3 },
  "3": { enumerable: true, value: 4 },
  "length": { value: 4 },
}) // true
const arrayLikeObject02 = Object.defineProperties({}, {
  "4": { value: 5 },
  "5": { value: 6 },
  "6": { value: 7 },
  "7": { value: 8 },
  "length": { value: 4 },
}) // false
const arrayLikeObject03 = Object.defineProperties({}, {
  "2": { enumerable: true, value: 3 },
  "3": { enumerable: true, value: 4 },
  "4": { enumerable: true, value: 5 },
  "5": { enumerable: true, value: 6 },
  "length": { value: 4 },
}) // true
const arrayLikeObject04 = Object.defineProperties({}, {
  "0": { value: 1 },
  "1": { value: 2 },
  "2": { value: 3 },
  "3": { value: 4 },
  "length": { value: 8 },
}) // false
const arrayLikeObject05 = Object.defineProperties({}, {
  "0": { enumerable: true, value: 1 },
  "1": { enumerable: true, value: 2 },
  "2": { enumerable: true, value: 3 },
  "3": { enumerable: true, value: 4 },
}) // false
const arrayLikeObject06 = Object.defineProperties({}, {
  "0": { value: 1 },
  "1": { value: 2 },
  "2": { value: 3 },
  "3": { value: 4 },
  "length": { value: -4 },
}) // false
const arrayLikeObject07 = Object.defineProperties({}, {
  "-0": { enumerable: true, value: 1 },
  "-1": { enumerable: true, value: 2 },
  "-2": { enumerable: true, value: 3 },
  "-3": { enumerable: true, value: 4 },
  "length": { value: 4 },
}) // false
const arrayLikeObject08 = Object.defineProperties({}, {
  "length": { value: 0 },
}) // false
const arrayLikeObject09 = Object.defineProperties({}, {
  "length": { value: 4 },
}) // false
const arrayLikeObject10 = {
  "0": 1,
  "1": 2,
  "2": 3,
  "3": 4,
  "length": 4,
  "someFunction": () => {},
  "someNumber": 33,
} // true
const arrayLikeObject11 = {
  "0": 1,
  "1": 2,
  "2": 3,
  "3": 4,
  "length": "4",
} // false

const arrayLikeObjects = [
  isArrayLike(arrayLikeObject00) === true,
  isArrayLike(arrayLikeObject01) === true,
  isArrayLike(arrayLikeObject02) === false,
  isArrayLike(arrayLikeObject03) === true,
  isArrayLike(arrayLikeObject04) === false,
  isArrayLike(arrayLikeObject05) === false,
  isArrayLike(arrayLikeObject06) === false,
  isArrayLike(arrayLikeObject07) === false,
  isArrayLike(arrayLikeObject08) === false,
  isArrayLike(arrayLikeObject09) === false,
  isArrayLike(arrayLikeObject10) === true,
  isArrayLike(arrayLikeObject11) === false,
]
console.log("arrayLike", JSON.stringify(arrayLikeObjects, null, 2))
console.log("pass", !arrayLikeObjects.includes(false))