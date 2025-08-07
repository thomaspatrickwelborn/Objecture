import { Recourse, get } from '/dependencies/recourse.js'
console.log("------------------------")
console.log("Get Property | Example 5")
console.log("------------------------")
const object = new Object({
  propertyA: new Map([
    ["propertyB", new Map([
      ["propertyC", new Map([
        ["0", 111], ["1", 222], ["3", 333]
      ])],
      ["propertyD", true],
    ])],
    ["propertyE", new Map([
      ["propertyF", new Map([
        ["0", 444], ["1", 555], ["3", 666]
      ])],
      ["propertyG", true],
    ])],
    ["propertyH", new Map([
      ["propertyI", new Map([
        ["0", 777], ["1", 888], ["3", 999]
      ])],
      ["propertyJ", true],
    ])],
  ]),
  propertyK: new Map([
    ["propertyL", new Map([
      ["propertyM", new Map([
        ["0", 111], ["1", 222], ["3", 333]
      ])],
      ["propertyN", true],
    ])],
    ["propertyO", new Map([
      ["propertyP", new Map([
        ["0", 444], ["1", 555], ["3", 666]
      ])],
      ["propertyQ", true],
    ])],
    ["propertyR", new Map([
      ["propertyS", new Map([
        ["0", 777], ["1", 888], ["3", 999]
      ])],
      ["propertyT", true],
    ])],
  ]),
})
const getOptionsA = { pathMatch: true }
const pathMatchA = 'propertyA.propertyB.propertyC.[0-9]'
const pathMatchB = 'propertyA.*.*.[0-9]'
const pathMatchC = 'propertyK.propertyL.**'
const pathMatchD = '*'
const pathMatchE = '**'
const pathMatchesA = Recourse.get(object, pathMatchA, getOptionsA)
const pathMatchesB = Recourse.get(object, pathMatchB, getOptionsA)
const pathMatchesC = Recourse.get(object, pathMatchC, getOptionsA)
const pathMatchesD = Recourse.get(object, pathMatchD, getOptionsA)
const pathMatchesE = Recourse.get(object, pathMatchE, getOptionsA)
console.log('pathMatchesA', pathMatchesA)
console.log('pathMatchesB', pathMatchesB)
console.log('pathMatchesC', pathMatchesC)
console.log('pathMatchesD', pathMatchesD)
console.log('pathMatchesE', pathMatchesE)
// console.log(get(object))
