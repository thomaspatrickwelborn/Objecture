import { Recourse } from '/dependencies/recourse.js'
const object = new Map([
  ['propertyA', new Map([
    ['propertyB', new Map([
      ['propertyC', new Map([
        [0, 3], 
        [1, 33], 
        [2, 333], 
      ])]
    ])]
  ])]
])

const objectEntries = Recourse.entities(object, 'entries')
const objectEntriesString = JSON.stringify(objectEntries, null, 2)
const objectKeys = Recourse.entities(object, 'keys')
const objectKeysString = JSON.stringify(objectKeys, null, 2)
const objectValues = Recourse.entities(object, 'values')
const objectValuesString = JSON.stringify(objectValues, null, 2)
console.log("--------------------")
console.log("Entities | Example 3")
console.log("--------------------")
console.log('objectEntries', objectEntries)
console.log('objectEntriesString', objectEntriesString)
console.log('objectKeys', objectKeys)
console.log('objectKeysString', objectKeysString)
console.log('objectValues', objectValues)
console.log('objectValuesString', objectValuesString)

const objectEntriesResolve = `[
  [
    "propertyA",
    [
      [
        "propertyB",
        [
          [
            "propertyC",
            [
              [
                0,
                3
              ],
              [
                1,
                33
              ],
              [
                2,
                333
              ]
            ]
          ]
        ]
      ]
    ]
  ]
]`

const objectKeysResolve = `[
  "propertyA",
  [
    "propertyB",
    [
      "propertyC",
      [
        0,
        1,
        2
      ]
    ]
  ]
]`

const objectValuesResolve = `[
  [
    [
      [
        3,
        33,
        333
      ]
    ]
  ]
]`
console.log ("pass", (
  objectEntriesString === objectEntriesResolve &&
  objectKeysString === objectKeysResolve &&
  objectValuesString === objectValuesResolve
))