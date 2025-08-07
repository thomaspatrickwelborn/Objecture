import * as Recourse from '/dependencies/recourse.js'
console.log("--------------------")
console.log("Value Of | Example 3")
console.log("--------------------")

const propertyA = { propertyA: "AAA" }
const propertyB = { propertyB: "BBB" }
const propertyC = { propertyC: "CCC" }
const map = new Map([
  [propertyA, propertyA],
  [propertyB, propertyB],
  [propertyC, propertyC],
])
const mapEntries = Recourse.entities(map, 'entries', { recurse: false })
const mapString = Recourse.toString(map, {
  space: 2, replacer: null, // returnValue: 'entries' // recurse: false, // returnValue: 'entries'
})
console.log("map", map)
console.log("mapEntries", mapEntries)
console.log("mapString", mapString)
console.log("pass", mapString === `[
  [
    {
      "propertyA": "AAA"
    },
    {
      "propertyA": "AAA"
    }
  ],
  [
    {
      "propertyB": "BBB"
    },
    {
      "propertyB": "BBB"
    }
  ],
  [
    {
      "propertyC": "CCC"
    },
    {
      "propertyC": "CCC"
    }
  ]
]`)