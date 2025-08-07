import { Recourse, get } from '/dependencies/recourse.js'
console.log("------------------------")
console.log("Get Property | Example 4")
console.log("------------------------")
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
const pathMatchB = 'propertyE.propertyF.property*'
const pathMatchC = 'propertyE.propertyF.propertyK.propertyL.*.[2]'
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
