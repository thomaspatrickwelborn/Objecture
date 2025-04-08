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
model.defineProperties({ 
  propertyA: { enumerable: true, writable: true, value: 111 },
  propertyB: { enumerable: true, writable: true, value: [{ enumerable: true, writable: true, value: {
    propertyC: { enumerable: true, writable: true, value: 333 },
    propertyD: { enumerable: true, writable: true, value: {
      propertyE: { enumerable: true, writable: true, value: 555 }
    } } },
  }] }, 
  propertyF: { enumerable: true, writable: true, value: {
    propertyG: { enumerable: true, writable: true, value: 777 }
  } }
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
