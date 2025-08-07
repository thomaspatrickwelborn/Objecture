import { Recourse } from '/dependencies/recourse.js'
console.log("--------------------")
console.log("Entities | Example 5")
console.log("--------------------")
const object = Object.defineProperties(new EventTarget(), {
  propertyA: { enumerable: true, value: Object.defineProperties(new EventTarget(), {
    propertyB: { enumerable: true, value: Object.defineProperties(new EventTarget(), {
      propertyC: { enumerable: true, value: 3 }
    }) }
  }) },
  propertyD: { enumerable: true, value: [
    Object.defineProperties(new EventTarget(), {
      propertyE: { enumerable: true, value: Object.defineProperties(new EventTarget(), {
        propertyF: { enumerable: true, value: 6 }
      } ) }
    }),
    Object.defineProperties(new EventTarget(), {
      propertyE: { enumerable: true, value: Object.defineProperties(new EventTarget(), {
        propertyF: { enumerable: true, value: "6" }
      } ) }
    }),
    Object.defineProperties(new EventTarget(), {
      propertyE: { enumerable: true, value: Object.defineProperties(new EventTarget(), {
        propertyF: { enumerable: true, value: null }
      } ) }
    }),
  ] },
  propertyG: { value: 7 },
})
const objectKeys = Recourse.entities(object, 'keys', {
  nonenumerable: true
})
const objectKeysString = JSON.stringify(object, null, 2)
console.log('objectKeys', objectKeys)
console.log('objectKeysString', objectKeysString)
console.log('pass', `{
  "propertyA": {
    "propertyB": {
      "propertyC": 3
    }
  },
  "propertyD": [
    {
      "propertyE": {
        "propertyF": 6
      }
    },
    {
      "propertyE": {
        "propertyF": "6"
      }
    },
    {
      "propertyE": {
        "propertyF": null
      }
    }
  ]
}` === objectKeysString)
