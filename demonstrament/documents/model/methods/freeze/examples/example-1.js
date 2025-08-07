import { typeOf } from '/dependencies/recourse.js'
import * as Recourse from '/dependencies/recourse.js'
console.log("------------------")
console.log("Freeze | Example 1")
console.log("------------------")

const object = {
  propertyA: [{
    propertyB: {
      propertyC: [3, 33, 333]
    }
  }]
}
Recourse.freeze(object)
try { object.propertyD = 4 } catch($err) { console.error($err) }
try { object.propertyA[1] = {
  propertyD: {
    propertyE: [5, 55, 555]
  }
} } catch($err) {
  console.error($err)
}
const objectString = Recourse.toString(object, {
  space: 2, replacer: null, // returnValue: 'target'
})
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
  ]
}` === objectString))