import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) { console.log($event.type, $event.path)}
const model = new Model({
  propertyA: 111,
  propertyB: [{
    propertyC: 333,
    propertyD: {
      propertyE: 555
    }
  }],
  propertyF: {
    propertyG: 777
  }
}, null, {
  addEvents: {
    '** setProperty': eventLog,
    '** assignSourceProperty': eventLog,
  },
  // assignmentMethod: 'set',
  assignmentMethod: 'assign',
  enableEvents: true,
})
// console.log(model.getEvents())
// console.log(model.toString({ space: 2, replacer: null }))
