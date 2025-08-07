import * as Recourse from '/dependencies/recourse.js'
console.log("--------------------")
console.log("Value Of | Example 2")
console.log("--------------------")

const map = new Map([[0, 1], [1, 2], [2, 3]])
const mapValueOf = Recourse.valueOf(map)
const mapString = Recourse.toString(map, { space: 2, replacer: null })
console.log("map", map)
console.log("mapValueOf", mapValueOf)
console.log("pass", (
  (map.get(0) === 1) &&
  (map.get(1) === 2) &&
  (map.get(2) === 3)
))