# ❂&ensp;Objecture
&ensp;⏣&ensp;**Object Watcher, Property Manager**  
&ensp;&ensp;&ensp;&ensp;⊚&ensp;**Capture property changes for object, array mutator methods.**  
&ensp;&ensp;&ensp;&ensp;⊚&ensp;**Schematize and validate object, array properties.**  
&ensp;&ensp;&ensp;&ensp;⊚&ensp;**Browser, NodeJS compatible.**  

&ensp;⁘&ensp;Uses [**Core-Plex**](https://www.npmjs.com/package/core-plex) - Event Listener Management System.  
&ensp;⁜&ensp;Used by [**MVC Framework**](https://www.npmjs.com/package/mvc-framework) - Presentation Abtraction Control (PAC) Pattern.  

[**Guide**](./document/guide/index.md) |
| :-- |

## Introduction
 - Manage structured content using *familiar* JS `Object`, `Array`, `EventTarget` APIs.  
 - Schematize data structures with property validators.  
 - Capture **content *and* validation events** for property changes (including **nested** property events).  

## Impetus
 - Frontend, backend applications require or benefit from structured content with validatable schema.  
 - Detecting changes to structured content in objects/arrays through property events promotes event-driven application architecture.  
 - There are limited libraries with *both* **browser** *and* **Node** *compatibility* that manage **schematized content** with **validators** or that capture **nested property change events**.  

## Impact
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

## Illustrations
```
import { Model, Schema } from 'objecture'
```
### Objecture Model Methods
Objecture Model instances manage object/array properties with the same API as their respective classes and additional `get`/`set`/`delete` methods.  
#### `Model.set` Method
```
const object = new Model({
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
  propertyD: null
})
```
*then*  
```
object.set({
  propertyA: false,
  propertyB: 0,
  propertyC: "FALSE",
  propertyD: null
})
```

#### `Model.assign` Method
```
const object = new Model({
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
}, null, {
  assignObject: 'assign'
})
```
*then*  
```
object.assign(
  { propertyA: false },
  { propertyB: 0 },
  { propertyC: "FALSE" }
)
```
#### `Model.defineProperties` Method
```
const object = new Model({
  propertyA: { value: true, writable: true },
  propertyB: { value: 1, writable: true },
  propertyC: { value: "TRUE", writable: true },
}, null, {
  assignObject: 'defineProperties'
})
```
*then*  
```
object.defineProperties({
  propertyA: { value: true },
  propertyB: { value: 1 },
  propertyC: { value: "TRUE" },
})
```
#### `Model.push` Method
```
const array = new Model([true, 1, "TRUE"], null, {
  assignArray: 'push'
})
```
*then*  
```
array.length = 0
array.push(false, 0, "FALSE")
```
#### `Model.unshift` Method
```
const array = new Model([true, 1, "TRUE"], null, {
  assignArray: 'unshift'
})
```
*then*  
```
array.length = 0
array.unshift(false, 0, "FALSE")
```

### Objecture Model Schema
#### Simple Model Schema
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
*logs*  
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
*logs*  
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

*logs*  
```
setProperty propertyA true
setProperty propertyB 1
setProperty propertyC "TRUE"
```

#### `set` Event
```
object
.removeEvents({ type: 'setProperty' })
.addEvents({ 'set': evenLog })
.enableEvents()
```
*logs*  
```
set null {
  propertyA: true,
  propertyB: 1,
  propertyC: "TRUE",
}
```
