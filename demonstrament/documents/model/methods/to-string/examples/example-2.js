import * as Recourse from '/dependencies/recourse.js'
console.log("---------------------")
console.log("To String | Example 2")
console.log("---------------------")

const options = { space: 2, replacer: null, returnValue: 'target' }
const map = new Map([[0, 1], [1, 2], [2, 3]])
const mapValueOf = Recourse.valueOf(map, options)
const mapString = Recourse.toString(map, options)
console.log("map", map)
console.log("mapValueOf", mapValueOf)
console.log("mapString", mapString)
console.log("pass", mapString === `{
  "0": 1,
  "1": 2,
  "2": 3
}`)