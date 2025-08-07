import { Recourse } from '/dependencies/recourse.js'
console.log("------------------")
console.log("Assign | Example 4")
console.log("------------------")
const array = [
  [1, 11, 111],
  [
    [22, 2222, 222222],
    [
      [333, 333333, 333333333],
      [
        [55555, 5555555555, 555555555555555]
      ],
      [666666, 666666666666, 666666666666666666]
    ],
    [7777777, 77777777777777, 777777777777777777777],
  ],
  [88888888, 8888888888888888, 888888888888888888888888]
]
const arrayString = Recourse.toString(array, { space: 2, replacer: null })
console.log("arrayString", arrayString)
Recourse.assign(array, [
  [1111],
  [
    [22222222],
    [
      [333333333333],
      [
        [55555555555555555555]
      ],
      [666666666666666666666666]
    ],
    [7777777777777777777777777777],
  ],
  [88888888888888888888888888888888]
])
const arrayString0 = Recourse.toString(array, { space: 2, replacer: null })
console.log("arrayString0", arrayString0)