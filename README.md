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
### Objecture Events
#### Example \| Object Set Events
```
function eventLog($event) {
  console.log($event.type, $event.value)
}
const object = new Model({})
object.addEvents({ 'setProperty': eventLog, 'set': eventLog })
object.set({
  propertyA: true,
  propertyB: 1,
})
```

### Objecture Schema