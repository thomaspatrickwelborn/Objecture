import { Recourse } from '/dependencies/recourse.js'
console.log("NONPASSABLE TEST")
console.log("-------------------------")
console.log("Assign Concat | Example 5")
console.log("-------------------------")
const array = [
  {
    propertyB: {
      propertyC: 333
    }
  },
  [
    2957, "asldgjow", {
      propertyG: 777,
      propertyF: false,
    }
  ],
  {
    propertyD: [
      {
        propertyE: 555, 
      }, 
      352738, 
      {
        propertyE: 555555,
      },
    ]
  }
]
Recourse.assignConcat(array, [
  {
    propertyB: {
      propertyC: "333333",
      propertyD: "555555",
    }
  },
  [
    3353, "fk4lksd", {
      propertyG: 777777,
      propertyF: true
    }
  ]
])
console.log("array", array)