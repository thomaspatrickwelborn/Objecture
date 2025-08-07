import { toString, typeOf } from '/dependencies/recourse.js'
import * as Recourse from '/dependencies/recourse.js'
console.log("----------------")
console.log("Seal | Example 2")
console.log("----------------")
const object = {
  propertyA: [{
    propertyB: {
      propertyC: [3, 33, 333]
    }
  }],
  propertyD: new Map(Object.entries({
    propertyE: new Map([[0, 5], [1, 55], [2, 555]])
  }))
}
Recourse.seal(object)
try {
  object.propertyD.get('propertyE').set(0, "5")
  object.propertyD.get('propertyE').set(1, "55")
  object.propertyD.get('propertyE').set(2, "555")
} catch($err) { console.error($err) }
const objectString = toString(object, {
  replacer: null, space: 2, // returnValue: 'target'
})
console.log(object)
console.log(objectString)
console.log("pass", (`{
  "propertyA": [
    {
      "propertyB": {
        "propertyC": [
          3,
          33,
          333
        ]
      }
    }
  ],
  "propertyD": {
    "propertyE": {
      "0": "5",
      "1": "55",
      "2": "555"
    }
  }
}` === objectString))