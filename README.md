# ❂&ensp;Objecture
&ensp;⏣&ensp;**Object Watcher, Property Manager**  
&ensp;&ensp;&ensp;&ensp;⊚&ensp;**Capture property changes for object, array mutator methods.**  
&ensp;&ensp;&ensp;&ensp;⊚&ensp;**Schematize and validate object, array properties.**  
&ensp;&ensp;&ensp;&ensp;⊚&ensp;**Browser, NodeJS compatible.**  

&ensp;⁘&ensp;Uses [**Core-Plex**](https://www.npmjs.com/package/core-plex) - Event Listener Management System.  
&ensp;⁜&ensp;Used by [**MVC Framework**](https://www.npmjs.com/package/mvc-framework) - Presentation Abtraction Control (PAC) Pattern.  

[**Guide**](./document/guide/index.md) |
| :-- |

## ⏣&ensp;Introduction
 - Manage structured content using *familiar* JS `Object`, `Array`, `EventTarget` APIs.  
 - Schematize data structures with property validators.  
 - Capture **content *and* validation events** for property changes (including **nested** property events).  

## ⏣&ensp;Impetus
 - Frontend, backend applications require or benefit from structured content with validatable schema.  
 - Detecting changes to structured content in objects/arrays through property events promotes event-driven application architecture.  
 - There are limited libraries with *both* **browser** *and* **Node** *compatibility* that manage **schematized content** with **validators** or that capture **nested property change events**.  

## ⏣&ensp;Impact
 - **Manage content** for primitive/object data types: 
   - `string`, `number`, `boolean`, `null` primitives; 
   - `object`, `array`. 
 - **Schematize content** with property validators.  
   - `type`, `required`, `match`, `enum`, `range`, `length` and *custom* validators.  
 - [**Capture content events**](./document/guide/model/events/index.md) for *any* methods that modify content.  
   - `Object` Events:  
     - `assign`, `defineProperties`/`defineProperty`, `freeze`, and `seal` events.  
   - `Array` Events:  
     - `concat`, `copyWithin`, `fill`, `pop`, `push`, `reverse`, `shift`, `splice`, and `unshift` events.  
   - `Property Accessor` Events: 
     - `get`, `set`, `delete`  
 - **Capture validation events/data** for array/object properties.    
   - `valid`, `nonvalid` `validProperty`, `nonvalidProperty` events.  
   - Schema validation object with `report` method.  

## ⏣&ensp;Illustrations
***Import Object Model, Schema***  
```
import { Model, Schema } from 'objecture'
```
### Objecture Model
```
const object = new Model({
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: { 
      propertyF: 1
    }
  }],
  propertyG: "TRUE"
})
console.log(object.valueOf())
```
***`valueOf` logs***:  
```
{
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: { 
      propertyF: 1
    }
  }],
  propertyG: "TRUE"
}
```
### Schematized Objecture Model
```
const schema = {
  propertyA: {
    propertyB: {
      propertyC: Boolean
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: Number
    }
  }],
  propertyG: String
}
const object = new Model({
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1
    }
  }],
  propertyG: true
}, schema)
console.log(object.toString({ space: 2, replacer: null }))
```
***`toString` logs***:  
```
{
  "propertyA": {
    "propertyB": {
      "propertyC": true
    }
  },
  "propertyD": [
    {
      "propertyE": {
        "propertyF": 1
      }
    }
  ]
}
```
(`propertyG` nonvalid)

### Ventilated Objecture Model
```
function eventLog($event) {
  console.log($event.type, $event.path, JSON.stringify($event.value))
}
const object = new Model({
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1
    }
  }],
  propertyG: "TRUE"
}, null, {
  events: {
    'propertyA.propertyB setProperty': eventLog,
    'propertyA setProperty': eventLog,
    'setProperty': eventLog,
    'propertyD pushProp': eventLog,
    'propertyD.[0-9] set': eventLog,
    '** set': eventLog,
  },
  enableEvents: true
})
```
***logs***  
```
setProperty propertyA.propertyB.propertyC true
set propertyA.propertyB {
  "propertyC": true
}
setProperty propertyA.propertyB {}
set propertyA {
  "propertyB": {
    "propertyC": true
  }
}
setProperty propertyA {}
set propertyD.0.propertyE {
  "propertyF": 1
}
set propertyD.0 {
  "propertyE": {
    "propertyF": 1
  }
}
set propertyD [
  {
    "propertyE": {
      "propertyF": 1
    }
  }
]
setProperty propertyD {}
setProperty propertyG "TRUE"
set null {
  "propertyA": {
    "propertyB": {
      "propertyC": true
    }
  },
  "propertyD": [
  {
      "propertyE": {
        "propertyF": 1
      }
    }
  ],
  "propertyG": "TRUE"
}
```
### Ventilated, Schematized Model
```
const schema = {
  propertyA: {
    propertyB: {
      propertyC: Boolean
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: Number
    }
  }],
  propertyG: String
}
const object = new Model({
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1
    }
  }],
  propertyG: true
}, schema, {
  events: {
    '** nonvalidProperty': eventLog,
    '** nonvalid': eventLog,
    '** validProperty': eventLog,
    '** valid': eventLog,
  },
  enableEvents: true,
})
```
***logs***  
```
```
### Objecture Model Methods
Objecture Model instances manage object/array properties with the same API as their respective classes and additional `get`/`set`/`delete` methods.  
#### `Model.set` Method
```
const object = new Model({}, null, {
  events: {
    '** set': eventLog,
    '** setProperties': eventLog,
  }
})
object.set({
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
  propertyD: [{
    propertyE: {
      propertyF: 777
    }
  }],
  propertyF: 
})
```
##### `Model.get` Method
```
console.log(object.get())
```
***logs***  
```
{
  propertyA: false,
  propertyB: 0,
  propertyC: "FALSE",
  propertyD: [{
    propertyE: -777
  }]
}
```
*then*  
```
console.log(
  object.get("propertyA"),
  object.get("propertyB"),
  object.get("propertyC"),
  object.get("propertyD.0.propertyE"),
)
```
***logs***  
```
false, 0, "FALSE", -777
```
##### `Model.delete` Method
```
object.delete('propertyA')
object.delete('propertyD.0')
console.log(object.valueOf())
```
***logs***  
```
{
  propertyB: 0,
  propertyC: "FALSE",
  propertyD: []
}
```
*then*  
```
object.delete()
console.log(object.valueOf())
```
***logs***  
```
{}
```

#### `Model.assign` Method
```
const object = new Model({
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
  propertyD: [{
    propertyE: 777
  }]
}, null, {
  assignObject: 'assign'
})
console.log(array.valueOf())
```
***logs***  
```
{
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
  propertyD: [{
    propertyE: 777
  }],
}
```
*then*  
```
object.assign(
  { propertyA: false },
  { propertyB: 0 },
  { propertyC: "FALSE" },
  { propertyD: [{
    propertyE: -777
  }] }
)
console.log(array.valueOf())
```
***logs***
```
{
  propertyA: false,
  propertyB: 0,
  propertyC: "FALSE",
  propertyD: [{
    propertyE: -777
  }],
}
```
#### `Model.defineProperties` Method
```
const object = new Model({
  propertyA: { value: true, writable: true },
  propertyB: { value: 1, writable: true },
  propertyC: { value: "TRUE", writable: true },
  propertyD: { value: [{
    value: { propertyE: { value: 777 } }
  }] },
}, null, {
  assignObject: 'defineProperties'
})
console.log(object.valueOf())
```
***logs***  
```
{
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
  propertyD: [{
    propertyE: 777
  }],
}
```
*then*  
```
object.defineProperties({
  propertyA: { value: false },
  propertyB: { value: 0 },
  propertyC: { value: "FALSE" },
  propertyD: { value: [{
    value: { propertyE: { value: -777 } }
  }] },
})
console.log(object.valueOf())
```
***logs***
```
{
  propertyA: false,
  propertyB: 0,
  propertyC: "FALSE",
  propertyD: [{
    propertyE: -777
  }],
}
```
#### `Model.push` Method
```
const array = new Model([true, 1, "TRUE", [
  false, 0, "FALSE"
]], null, {
  assignArray: 'push'
})
console.log(array.valueOf())
```
***logs***  
```
[true, 1, "TRUE", [false, 0, "FALSE"]]
```
*then*  
```
array.length = 0
array.push(false, 0, "FALSE", [
  true, 1, "TRUE"
])
console.log(array.valueOf())
```
***logs***  
```
[true, 1, "TRUE", [false, 0, "FALSE"], "FALSE", 0, false,  ["TRUE", 1, true]]
```

#### `Model.unshift` Method
```
const array = new Model([true, 1, "TRUE", [
  false, 0, "FALSE" 
]], null, {
  assignArray: 'unshift'
})
console.log(array.valueOf())
```
***logs***  
```
[["FALSE", 0, false], "TRUE", 1, true]
```
*then*  
```
array.length = 0
array.unshift(false, 0, "FALSE", [
  true, 1, "TRUE"
])
console.log(array.valueOf())
```
***logs***  
```
[["true", 1, true], "FALSE", 0, false, ["FALSE", 0, false], "TRUE", 1, true]
```

### Objecture Model Schema
#### Schema Type Validator
```
const object = new Model({
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
}, {
  propertyA: Boolean,
  propertyB: Number,
  propertyC: String,
})
console.log(object.valueOf())
```
***logs***  
```
{
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
}
```
***then***  
```
const object = new Model({
  propertyA: "TRUE",
  propertyB: true,
  propertyC: 1,
}, {
  propertyA: Boolean,
  propertyB: Number,
  propertyC: String,
})
console.log(object.valueOf())
```
***logs***  
```
{
  propertyB: true,
}
```
***then***  
```
const object = new Model({
  propertyA: "TRUE",
  propertyB: "true",
  propertyC: 1,
}, {
  propertyA: Boolean,
  propertyB: Number,
  propertyC: String,
})
console.log(object.valueOf())
```
***logs***  
```
{}
```
### Objecture Model Events
#### `setProperty` Event
```
const object = new Model({
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
}, null, {
  events: { 'setProperty': eventLog }
})
```

***logs***  
```
setProperty propertyA true
setProperty propertyB 1
setProperty propertyC "TRUE"
```

#### `set` Event
```
object
.removeEvents({ type: 'setProperty' })
.addEvents({ 'set': evenLog }, true)
.set({
  propertyA: false,
  propertyB: 0,
  propertyC: "FALSE",
})
```
***logs***  
```
set null {
  propertyA: false,
  propertyB: 0,
  propertyC: "FALSE",
}
```
