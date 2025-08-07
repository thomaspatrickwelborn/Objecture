import * as Recourse from '/dependencies/recourse.js'
console.log("---------------------")
console.log("To String | Example 3")
console.log("---------------------")
const map = new Map([
  [{ propertyA: "AAA" }, { propertyA: "AAA" }],
  [{ propertyB: "BBB" }, { propertyB: "BBB" }],
  [{ propertyC: "CCC" }, { propertyC: "CCC" }],
])
const mapEntries = Recourse.valueOf(map, { /*returnValue: 'entries'*/ })
const mapString = Recourse.toString(mapEntries, { space: 2, replacer: null })
console.log("map", map)
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