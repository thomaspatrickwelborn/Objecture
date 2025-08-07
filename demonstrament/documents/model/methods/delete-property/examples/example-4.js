import { Recourse, get } from '/dependencies/recourse.js'
console.log("---------------------------")
console.log("Delete Property | Example 4")
console.log("---------------------------")
const object = {
  propertyA: [{
    propertyB: [{
      propertyC: [111, 222, 333],
      propertyD: true,
    }, {
      propertyC: [444, 555, 666],
      propertyD: false,
    }, {
      propertyC: [777, 888, 999],
      propertyD: true,
    }]
  }, {
    propertyB: [{
      propertyC: [111111, 222222, 333333],
      propertyD: true,
    }, {
      propertyC: [444444, 555555, 666666],
      propertyD: false,
    }, {
      propertyC: [777777, 888888, 999999],
      propertyD: true,
    }]
  }, {
    propertyB: [{
      propertyC: [-111111, -222222, -333333],
      propertyD: true,
    }, {
      propertyC: [-444444, -555555, -666666],
      propertyD: false,
    }, {
      propertyC: [-777777, -888888, -999999],
      propertyD: true,
    }]
  }, {
    propertyB: [{
      propertyC: [-111, -222, -333],
      propertyD: true,
    }, {
      propertyC: [-444, -555, -666],
      propertyD: false,
    }, {
      propertyC: [-777, -888, -999],
      propertyD: true,
    }]
  }],
  propertyE: {
    propertyF: {
      propertyG: "propertyG", 
      propertyH: "propertyH", 
      propertyI: "propertyI", 
      propertyJ: "propertyJ", 
      propertyK: {
        propertyL: {
          propertyM: [111, 222, 333],
          propertyN: [444, 555, 666],
          propertyO: [777, 888, 999],
          propertyP: [0, 0, 0],
          propertyQ: [999, 888, 777],
          propertyR: [666, 555, 444],
          propertyS: [333, 222, 111],
        }
      }
    }
  }
}
const getOptionsA = { pathMatch: true }
const pathMatchA = 'propertyA.[0-9].propertyB.[0-9].propertyC.[0-9]'
const pathMatchB = 'propertyE.propertyF.propertyK.propertyL.property*'
// const pathMatchC = 'propertyE.propertyF.propertyK.propertyL.*.[2]'

Recourse
.get(object, pathMatchA, getOptionsA)
.forEach(([$path, $value]) => {
  console.log($path, $value * 2)
  Recourse.set(object, $path, $value * 2, { pathMatch: false, pathParseInteger: true })
})
const pathMatchesA = Recourse.get(object, pathMatchA, getOptionsA)
console.log("pathMatchesA", pathMatchesA)
const pathMatchesB = Recourse.get(object, pathMatchB, getOptionsA)
console.log("pathMatchesB", pathMatchesB)
console.log("pass", (
  Recourse.get(object, 'propertyA.0.propertyB.0.propertyC.0,', { pathMatch: false, pathParseInteger: true }) === 222 &&
  Recourse.get(object, 'propertyA.0.propertyB.0.propertyC.1,', { pathMatch: false, pathParseInteger: true }) === 444 &&
  Recourse.get(object, 'propertyA.0.propertyB.0.propertyC.2,', { pathMatch: false, pathParseInteger: true }) === 666 &&
  Recourse.get(object, 'propertyA.0.propertyB.1.propertyC.0,', { pathMatch: false, pathParseInteger: true }) === 888 &&
  Recourse.get(object, 'propertyA.0.propertyB.1.propertyC.1,', { pathMatch: false, pathParseInteger: true }) === 1110 &&
  Recourse.get(object, 'propertyA.0.propertyB.1.propertyC.2,', { pathMatch: false, pathParseInteger: true }) === 1332 &&
  Recourse.get(object, 'propertyA.0.propertyB.2.propertyC.0,', { pathMatch: false, pathParseInteger: true }) === 1554 &&
  Recourse.get(object, 'propertyA.0.propertyB.2.propertyC.1,', { pathMatch: false, pathParseInteger: true }) === 1776 &&
  Recourse.get(object, 'propertyA.0.propertyB.2.propertyC.2,', { pathMatch: false, pathParseInteger: true }) === 1998 &&
  Recourse.get(object, 'propertyA.1.propertyB.0.propertyC.0,', { pathMatch: false, pathParseInteger: true }) === 222222 &&
  Recourse.get(object, 'propertyA.1.propertyB.0.propertyC.1,', { pathMatch: false, pathParseInteger: true }) === 444444 &&
  Recourse.get(object, 'propertyA.1.propertyB.0.propertyC.2,', { pathMatch: false, pathParseInteger: true }) === 666666 &&
  Recourse.get(object, 'propertyA.1.propertyB.1.propertyC.0,', { pathMatch: false, pathParseInteger: true }) === 888888 &&
  Recourse.get(object, 'propertyA.1.propertyB.1.propertyC.1,', { pathMatch: false, pathParseInteger: true }) === 1111110 &&
  Recourse.get(object, 'propertyA.1.propertyB.1.propertyC.2,', { pathMatch: false, pathParseInteger: true }) === 1333332 &&
  Recourse.get(object, 'propertyA.1.propertyB.2.propertyC.0,', { pathMatch: false, pathParseInteger: true }) === 1555554 &&
  Recourse.get(object, 'propertyA.1.propertyB.2.propertyC.1,', { pathMatch: false, pathParseInteger: true }) === 1777776 &&
  Recourse.get(object, 'propertyA.1.propertyB.2.propertyC.2,', { pathMatch: false, pathParseInteger: true }) === 1999998 &&
  Recourse.get(object, 'propertyA.2.propertyB.0.propertyC.0', { pathMatch: false, pathParseInteger: true }) === -222222 &&
  Recourse.get(object, 'propertyA.2.propertyB.0.propertyC.1', { pathMatch: false, pathParseInteger: true }) === -444444 &&
  Recourse.get(object, 'propertyA.2.propertyB.0.propertyC.2', { pathMatch: false, pathParseInteger: true }) === -666666 &&
  Recourse.get(object, 'propertyA.2.propertyB.1.propertyC.0', { pathMatch: false, pathParseInteger: true }) === -888888 &&
  Recourse.get(object, 'propertyA.2.propertyB.1.propertyC.1', { pathMatch: false, pathParseInteger: true }) === -1111110 &&
  Recourse.get(object, 'propertyA.2.propertyB.1.propertyC.2', { pathMatch: false, pathParseInteger: true }) === -1333332 &&
  Recourse.get(object, 'propertyA.2.propertyB.2.propertyC.0', { pathMatch: false, pathParseInteger: true }) === -1555554 &&
  Recourse.get(object, 'propertyA.2.propertyB.2.propertyC.1', { pathMatch: false, pathParseInteger: true }) === -1777776 &&
  Recourse.get(object, 'propertyA.2.propertyB.2.propertyC.2', { pathMatch: false, pathParseInteger: true }) === -1999998 &&
  Recourse.get(object, 'propertyA.3.propertyB.0.propertyC.0', { pathMatch: false, pathParseInteger: true }) === -222 &&
  Recourse.get(object, 'propertyA.3.propertyB.0.propertyC.1', { pathMatch: false, pathParseInteger: true }) === -444 &&
  Recourse.get(object, 'propertyA.3.propertyB.0.propertyC.2', { pathMatch: false, pathParseInteger: true }) === -666 &&
  Recourse.get(object, 'propertyA.3.propertyB.1.propertyC.0', { pathMatch: false, pathParseInteger: true }) === -888 &&
  Recourse.get(object, 'propertyA.3.propertyB.1.propertyC.1', { pathMatch: false, pathParseInteger: true }) === -1110 &&
  Recourse.get(object, 'propertyA.3.propertyB.1.propertyC.2', { pathMatch: false, pathParseInteger: true }) === -1332 &&
  Recourse.get(object, 'propertyA.3.propertyB.2.propertyC.0', { pathMatch: false, pathParseInteger: true }) === -1554 &&
  Recourse.get(object, 'propertyA.3.propertyB.2.propertyC.1', { pathMatch: false, pathParseInteger: true }) === -1776 &&
  Recourse.get(object, 'propertyA.3.propertyB.2.propertyC.2', { pathMatch: false, pathParseInteger: true }) === -1998
))