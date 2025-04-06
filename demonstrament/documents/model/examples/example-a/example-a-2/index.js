import { Model, Schema } from '/dependencies/objecture.js'
function eventLog($event) { console.log($event.type, $event.path)}
const model = new Model([{ 
  propertyA: {
    propertyB: {
      propertyC: 333
    }
  },
  propertyD: [
    [{
      propertyE: 555,
    }, {
      propertyF: {
        propertyG: 777
      }
    }],
    [{
      propertyE: -555,
    }, {
      propertyF: {
        propertyG: -777
      }
    }]
  ]
}], null, {
  addEvents: {
    '** concatValue': eventLog,
  },
  assignmentMethod: 'concat',
  enableEvents: true,
})
console.log(model.toString({ space: 2, replacer: null }))
