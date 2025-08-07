console.log("------------------------")
console.log("Compand Tree | Example 4")
console.log("------------------------")
import { Recourse } from '/dependencies/recourse.js'
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
const objectCompand = Recourse.compand(object, { values: true })
const objectCompandString = JSON.stringify(objectCompand, null, 2)
console.log("objectCompand", objectCompand)
console.log("objectCompandString", objectCompandString)
console.log("pass", `[
  [
    "propertyA",
    {
      "propertyB": {
        "propertyC": 3
      }
    }
  ],
  [
    "propertyA.propertyB",
    {
      "propertyC": 3
    }
  ],
  [
    "propertyA.propertyB.propertyC",
    3
  ],
  [
    "propertyD",
    [
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
  ],
  [
    "propertyD.0",
    {
      "propertyE": {
        "propertyF": 6
      }
    }
  ],
  [
    "propertyD.0.propertyE",
    {
      "propertyF": 6
    }
  ],
  [
    "propertyD.0.propertyE.propertyF",
    6
  ],
  [
    "propertyD.1",
    {
      "propertyE": {
        "propertyF": "6"
      }
    }
  ],
  [
    "propertyD.1.propertyE",
    {
      "propertyF": "6"
    }
  ],
  [
    "propertyD.1.propertyE.propertyF",
    "6"
  ],
  [
    "propertyD.2",
    {
      "propertyE": {
        "propertyF": null
      }
    }
  ],
  [
    "propertyD.2.propertyE",
    {
      "propertyF": null
    }
  ],
  [
    "propertyD.2.propertyE.propertyF",
    null
  ]
]` === objectCompandString)
