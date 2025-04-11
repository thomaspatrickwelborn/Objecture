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
  events: {
    '** defineProperty': eventLog,
    '** assignSourceProperty': eventLog,
    '** setProperty': eventLog,
  },
  assignObject: 'set',
  enableEvents: true,
})
model.assign({
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
})