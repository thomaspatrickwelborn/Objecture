import { Recourse } from '/dependencies/recourse.js'
console.log("------------------------")
console.log("Set Property | Example 5")
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
        [0, 111], [1, 222], [3, 333]
      ])],
      ["propertyN", true],
    ])],
    ["propertyO", new Map([
      ["propertyP", new Map([
        [0, 444], [1, 555], [3, 666]
      ])],
      ["propertyQ", true],
    ])],
    ["propertyR", new Map([
      ["propertyS", new Map([
        [0, 777], [1, 888], [3, 999]
      ])],
      ["propertyT", true],
    ])],
  ]),
})
const setOptionsA = { pathMatch: true, pathParseInteger: false }
const pathMatchA = 'propertyA.propertyB.propertyC.[0-9]'
const pathMatchB = 'propertyK.*.*.[0-9]'
const pathMatchC = 'propertyK.propertyL.**'
const pathMatchD = '*'
const pathMatchE = '**'
Recourse.set(object, pathMatchA, -1, setOptionsA)
Recourse.set(object, pathMatchB, -1, setOptionsA)
const pathMatchesA = Recourse.get(object, pathMatchA, setOptionsA)
const pathMatchesB = Recourse.get(object, pathMatchB, setOptionsA)
const pathMatchesC = Recourse.get(object, pathMatchC, setOptionsA)
const pathMatchesD = Recourse.get(object, pathMatchD, setOptionsA)
const pathMatchesE = Recourse.get(object, pathMatchE, setOptionsA)
console.log("setOptionsA", setOptionsA)
console.log("pathMatchesA", pathMatchesA)
console.log("pathMatchesB", pathMatchesB)
console.log("pathMatchesC", pathMatchesC)
console.log("pathMatchesD", pathMatchesD)
console.log("pathMatchesE", pathMatchesE)

console.log("pass", (
  Recourse.get(object, 'propertyA.propertyB.propertyC.0', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyA.propertyB.propertyC.1', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyA.propertyB.propertyC.3', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyK.propertyL.propertyM.0', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyK.propertyL.propertyM.1', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyK.propertyL.propertyM.3', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyK.propertyO.propertyP.0', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyK.propertyO.propertyP.1', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyK.propertyO.propertyP.3', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyK.propertyR.propertyS.0', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyK.propertyR.propertyS.1', { pathMatch: false }) === -1 &&
  Recourse.get(object, 'propertyK.propertyR.propertyS.3', { pathMatch: false }) === -1
))