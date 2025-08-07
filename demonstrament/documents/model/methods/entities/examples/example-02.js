import { Recourse } from '/dependencies/recourse.js'
const object = {
  propertyA: [{
    propertyB: {
      propertyC: [3, 33, 333]
    }
  }],
  propertyE: [{
    propertyF: [{
      propertyG: [7, 77, 777]
    }]
  }],
}

const objectEntries = Recourse.entities(object, 'entries')
const objectEntriesString = JSON.stringify(objectEntries, null, 2)
const objectKeys = Recourse.entities(object, 'keys')
const objectKeysString = JSON.stringify(objectKeys, null, 2)
const objectValues = Recourse.entities(object, 'values')
const objectValuesString = JSON.stringify(objectValues, null, 2)
console.log("--------------------")
console.log("Entities | Example 2")
console.log("--------------------")
console.log('objectEntries', objectEntries)
console.log('objectEntriesString', objectEntriesString)
console.log('objectKeys', objectKeys)
console.log('objectKeysString', objectKeysString)
console.log('objectValues', objectValues)
console.log('objectValuesString', objectValuesString)

const objectEntriesResolve = `[
  [
    "propertyA",
    [
      [
        "0",
        [
          [
            "propertyB",
            [
              [
                "propertyC",
                [
                  [
                    "0",
                    3
                  ],
                  [
                    "1",
                    33
                  ],
                  [
                    "2",
                    333
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ],
  [
    "propertyE",
    [
      [
        "0",
        [
          [
            "propertyF",
            [
              [
                "0",
                [
                  [
                    "propertyG",
                    [
                      [
                        "0",
                        7
                      ],
                      [
                        "1",
                        77
                      ],
                      [
                        "2",
                        777
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ]
]`

const objectKeysResolve = `[
  "propertyA",
  [
    "0",
    [
      "propertyB",
      [
        "propertyC",
        [
          "0",
          "1",
          "2"
        ]
      ]
    ]
  ],
  "propertyE",
  [
    "0",
    [
      "propertyF",
      [
        "0",
        [
          "propertyG",
          [
            "0",
            "1",
            "2"
          ]
        ]
      ]
    ]
  ]
]`

const objectValuesResolve = `[
  [
    [
      [
        [
          3,
          33,
          333
        ]
      ]
    ]
  ],
  [
    [
      [
        [
          [
            7,
            77,
            777
          ]
        ]
      ]
    ]
  ]
]`
console.log ("pass", (
  objectEntriesString === objectEntriesResolve &&
  objectKeysString === objectKeysResolve &&
  objectValuesString === objectValuesResolve
))