console.log("---------------------------------------------------")
console.log("Recourse | Get Own Property Descriptors | Example 9")
console.log("---------------------------------------------------")
import { Recourse } from '/dependencies/recourse.js'
const { getOwnPropertyDescriptors } = Recourse
const map = new Map([[7, 7], [77, 77], [777, 777]])
const mapPDASTEntries = Recourse.getOwnPropertyDescriptors(map, {
  // returnValue: 'entries'
})
const mapPDASTEntriesString = JSON.stringify(mapPDASTEntries, null, 2)
console.log('map', map)
console.log("mapPDASTEntries", mapPDASTEntries, mapPDASTEntriesString)
const mapPDASTEntriesValid = (mapPDASTEntriesString === `{
  "7": {
    "configurable": false,
    "enumerable": true,
    "value": 7,
    "writable": true
  },
  "77": {
    "configurable": false,
    "enumerable": true,
    "value": 77,
    "writable": true
  },
  "777": {
    "configurable": false,
    "enumerable": true,
    "value": 777,
    "writable": true
  }
}`)
console.log(
  "pass", mapPDASTEntriesValid
)