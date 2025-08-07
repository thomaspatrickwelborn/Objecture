import { Recourse } from '/dependencies/recourse.js'
const object = {
  propertyA: [{}],
  propertyE: {},
}

const objectEntries = Recourse.entities(object, 'entries')
const objectEntriesString = JSON.stringify(objectEntries, null, 2)
const objectKeys = Recourse.entities(object, 'keys')
const objectKeysString = JSON.stringify(objectKeys, null, 2)
const objectValues = Recourse.entities(object, 'values')
const objectValuesString = JSON.stringify(objectValues, null, 2)
console.log("--------------------")
console.log("Entities | Example 1")
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
        "0",
        {}
      ]
    ]
  ],
  [
    "propertyE",
    {}
  ]
]`

const objectKeysResolve = `[
  "propertyA",
  [
    "0"
  ],
  "propertyE"
]`

const objectValuesResolve = `[
  [
    {}
  ],
  {}
]`
console.log ("pass", (
  objectEntriesString === objectEntriesResolve &&
  objectKeysString === objectKeysResolve &&
  objectValuesString === objectValuesResolve
))