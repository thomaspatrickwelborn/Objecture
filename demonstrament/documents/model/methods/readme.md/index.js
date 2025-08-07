import { Recourse } from '/dependencies/recourse.js'
const object = {
  propertyA: [{
    propertyB: {
      propertyC: [3, 33, 333]
    }
  }, {
    propertyD: {
      propertyE: [5, 55, 555]
    }
  }, {
    propertyF: {
      propertyG: new Map([[0, 7], [1, 77], [2, 777]])
    }
  }]
}

Recourse.get(object, 'propertyA.0.propertyB.propertyC.0')
Recourse.set(object, 'propertyA.1.propertyD.propertyE.1', "55")
Recourse.delete(object, 'propertyA.2.propertyD.propertyE.2')

console.log('propertyA.0.propertyB.propertyC.0', Recourse.get(object, 'propertyA.0.propertyB.propertyC.0'))
console.log('propertyA.1.propertyD.propertyE.1', Recourse.get(object, 'propertyA.1.propertyD.propertyE.1'))
console.log('propertyA.2.propertyD.propertyE.2', Recourse.get(object, 'propertyA.2.propertyD.propertyE.2'))

const recourseObject = new Recourse(object)
recourseObject.get('propertyA.0.propertyB.propertyC.2')
recourseObject.set('propertyA.1.propertyD.propertyE.2', "555")
recourseObject.delete('propertyA.2.propertyF.propertyG.2')

console.log('propertyA.0.propertyB.propertyC.2', recourseObject.get('propertyA.0.propertyB.propertyC.2'))
console.log('propertyA.1.propertyD.propertyE.2', recourseObject.get('propertyA.1.propertyD.propertyE.2', "555"))
console.log('propertyA.2.propertyF.propertyG.2', recourseObject.get('propertyA.2.propertyF.propertyG.2'))

console.log('object', Recourse.valueOf(object))
console.log('object', Recourse.toString(object, { space: 2, replacer: null, /*returnValue: 'target'*/ }))
