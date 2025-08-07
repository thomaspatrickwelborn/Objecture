console.log("----------------------------------------------------")
console.log("Recourse | Get Own Property Descriptors | Example 11")
console.log("----------------------------------------------------")
import { Recourse } from '/dependencies/recourse.js'
const { getOwnPropertyDescriptors } = Recourse
// const map = new Map([[7, 7], [77, 77], [777, 777]])
const map = new Map([
  ["propertyA", new Map([
    ["propertyB", new Map([
      ["propertyC", 333]
    ])]
  ])],
  ["propertyD", new Map([
    [1, 1],
    [22, 22],
    [333, 333],
  ])]
])

const mapPDASTReceiver = Recourse.getOwnPropertyDescriptors(map, {
  returnValue: 'receiver', type: true
})
const mapPDASTReceiverString = JSON.stringify(mapPDASTReceiver, null, 2)
console.log("mapPDASTReceiver", mapPDASTReceiver)
console.log("mapPDASTReceiverString", mapPDASTReceiverString)
const mapPDASTReceiverPass = (mapPDASTReceiverString === `{
  "propertyA": {
    "configurable": false,
    "enumerable": true,
    "value": {
      "propertyB": {
        "configurable": false,
        "enumerable": true,
        "value": {
          "propertyC": {
            "configurable": false,
            "enumerable": true,
            "value": 333,
            "writable": true,
            "type": "number"
          }
        },
        "writable": true,
        "type": "map"
      }
    },
    "writable": true,
    "type": "map"
  },
  "propertyD": {
    "configurable": false,
    "enumerable": true,
    "value": {
      "1": {
        "configurable": false,
        "enumerable": true,
        "value": 1,
        "writable": true,
        "type": "number"
      },
      "22": {
        "configurable": false,
        "enumerable": true,
        "value": 22,
        "writable": true,
        "type": "number"
      },
      "333": {
        "configurable": false,
        "enumerable": true,
        "value": 333,
        "writable": true,
        "type": "number"
      }
    },
    "writable": true,
    "type": "map"
  }
}`)

const mapPDASTTarget = Recourse.getOwnPropertyDescriptors(map, {
  returnValue: 'target', type: true
})
const mapPDASTTargetString = JSON.stringify(mapPDASTTarget, null, 2)
console.log("mapPDASTTarget", mapPDASTTarget)
console.log("mapPDASTTargetString", mapPDASTTargetString)
const mapPDASTTargetPass = (mapPDASTTargetString === `{
  "propertyA": {
    "configurable": false,
    "enumerable": true,
    "value": {
      "propertyB": {
        "configurable": false,
        "enumerable": true,
        "value": {
          "propertyC": {
            "configurable": false,
            "enumerable": true,
            "value": 333,
            "writable": true,
            "type": "number"
          }
        },
        "writable": true,
        "type": "map"
      }
    },
    "writable": true,
    "type": "map"
  },
  "propertyD": {
    "configurable": false,
    "enumerable": true,
    "value": {
      "1": {
        "configurable": false,
        "enumerable": true,
        "value": 1,
        "writable": true,
        "type": "number"
      },
      "22": {
        "configurable": false,
        "enumerable": true,
        "value": 22,
        "writable": true,
        "type": "number"
      },
      "333": {
        "configurable": false,
        "enumerable": true,
        "value": 333,
        "writable": true,
        "type": "number"
      }
    },
    "writable": true,
    "type": "map"
  }
}`)

console.log("pass", (mapPDASTReceiverPass && mapPDASTTargetPass))