import { Recourse } from '/dependencies/recourse.js'
console.log("--------------------")
console.log("Entities | Example 4")
console.log("--------------------")
const array = [
  [1, 2, 3],
  [[444, 555, 666]],
  [777, [888, 999], [101010]]
]
const arrayEntries = Recourse.entities(array, 'entries')
const arrayEntriesString = JSON.stringify(arrayEntries, null, 2)
const arrayValues = Recourse.entities(array, 'values')
const arrayValuesString = JSON.stringify(arrayValues, null, 2)
const arrayKeys = Recourse.entities(array, 'keys')
const arrayKeysString = JSON.stringify(arrayKeys, null, 2)
console.log("array", array)
console.log("arrayEntries", arrayEntries)
console.log("arrayValues", arrayValues)
console.log("arrayKeys", arrayKeys)
console.log("pass", (
(arrayEntriesString === `[
  [
    "0",
    [
      [
        "0",
        1
      ],
      [
        "1",
        2
      ],
      [
        "2",
        3
      ]
    ]
  ],
  [
    "1",
    [
      [
        "0",
        [
          [
            "0",
            444
          ],
          [
            "1",
            555
          ],
          [
            "2",
            666
          ]
        ]
      ]
    ]
  ],
  [
    "2",
    [
      [
        "0",
        777
      ],
      [
        "1",
        [
          [
            "0",
            888
          ],
          [
            "1",
            999
          ]
        ]
      ],
      [
        "2",
        [
          [
            "0",
            101010
          ]
        ]
      ]
    ]
  ]
]`) &&
(arrayValuesString === `[
  [
    1,
    2,
    3
  ],
  [
    [
      444,
      555,
      666
    ]
  ],
  [
    777,
    [
      888,
      999
    ],
    [
      101010
    ]
  ]
]`) &&
(arrayKeysString === `[
  "0",
  [
    "0",
    "1",
    "2"
  ],
  "1",
  [
    "0",
    [
      "0",
      "1",
      "2"
    ]
  ],
  "2",
  [
    "0",
    "1",
    [
      "0",
      "1"
    ],
    "2",
    [
      "0"
    ]
  ]
]`)
))