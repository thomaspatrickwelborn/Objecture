console.log(`
----------------
defineProperties
----------------
Example 1.
`)

import { Coutil } from '/dependencies/core-plex.js'
const { impandTree, expandTree } = Coutil
const objectImpand = impandTree({
  propertyA: { type: {
    propertyB: { type: {
      propertyC: { type: Boolean }
    } }
  } },
  propertyD: { type: [{ type: {
    propertyE: { type: {
      propertyF: { type: Number },
      propertyE: { type: {
        propertyFFF: { type: Number }
      } }
    } }
  } }] },
  propertyG: { type: String },
  propertyH: { type: null }
}, 'type')
console.log("objectImpand", objectImpand)
const objectExpand = expandTree(objectImpand, 'type')
console.log("objectExpand", objectExpand)

/*
{
  propertyA: { type: {
    propertyB: { type: {
      propertyC: { type: Boolean }
    } }
  } },
  propertyD: { type: [{ type: {
    propertyE: { type: {
      propertyF: { type: Number },
      propertyE: { type: {
        propertyFFF: { type: Number }
      } }
    } }
  } }] },
  propertyG: { type: String },
  propertyH: { type: null }
}

{
  propertyA: { enumerable: true, writable: true, value: {
    propertyB: { enumerable: true, writable: true, value: {
      propertyC: { enumerable: true, writable: true, value: true }
    } }
  } },
  propertyD: { enumerable: true, value: [{ enumerable: true, value: {
    propertyE: { enumerable: true, value: {
      propertyF: { enumerable: true, value: 1, writable: true },
      propertyE: { enumerable: true, value: {
        propertyFFF: { enumerable: true, value: 1 }
      } }
    } }
  } }] },
  propertyG: { writable: true, enumerable: true, value: "true" },
  propertyH: { writable: true, enumerable: true, value: null },
}
*/
/*
import { Model, Schema } from '/dependencies/objecture.js'
import ComplexObjectB from '../../sets/complex-object-b/index.js'
function eventLog($event) { console.log($event.type, $event.path) }
const schema = new Schema({
  propertyA: { type: {
    propertyB: { type: {
      propertyC: { type: Boolean }
    } }
  } },
  propertyD: { type: [{ type: {
    propertyE: { type: {
      propertyF: { type: Number },
      propertyE: { type: {
        propertyFFF: { type: Number }
      } }
    } }
  } }] },
  propertyG: { type: String },
  propertyH: { type: null }
})
const object = {
  propertyA: { enumerable: true, writable: true, value: {
    propertyB: { enumerable: true, writable: true, value: {
      propertyC: { enumerable: true, writable: true, value: true }
    } }
  } },
  propertyD: { enumerable: true, value: [{ enumerable: true, value: {
    propertyE: { enumerable: true, value: {
      propertyF: { enumerable: true, value: 1, writable: true },
      propertyE: { enumerable: true, value: {
        propertyFFF: { enumerable: true, value: 1 }
      } }
    } }
  } }] },
  propertyG: { writable: true, enumerable: true, value: "true" },
  propertyH: { writable: true, enumerable: true, value: null },
}
const model = new Model(object, schema, {
  assignArray: 'defineProperties',
  assignObject: 'defineProperties',
})
console.log(model.toString({ replacer: null, space: 2 }))
*/