# &nbsp;❂&nbsp;Objecture
**Object Watcher, Property Manager**  
Capture property changes for object, array mutator methods.  

Used by [**MVC Framework**](https://www.npmjs.com/package/mvc-framework).    

## Introduction
 - Manage structured content using familiar JS `Object`, `Array`, `EventTarget` APIs.  
 - Schematize data structures with property validators.  
 - Capture **content *and* validation events** for property changes (includes **nested** property events).  

## Impetus
 - Frontend, backend applications often require or benefit from structured content with validatable schema.  
 - Changes to structured content often result in some futher change to a visual interface or database, including changes to nested properties.  
 - There are limited libraries with both browser and Node compatibility that manage schematized content with validators or capture nested property change events.  

## Impact
 - **Manage content** for primitive/non-primitive data types: 
   - `string`, `number`, `boolean`, `undefined`, `null` primitives; 
   - `object`, `array` non-primitives. 
 - **Schematize content** with property validators.  
   - `type`, `required`, `match`, `enum`, `range`, `length` and custom validators.  
 - **Capture content events** and **validation events** for any any methods that modify content.  
   - `Object` Events:  
     - `assign`, `defineProperties`, `defineProperty`, `freeze`, and `seal` events.  
   - `Array` Events:  
     - `concat`, `copyWithin`, `fill`, `pop`, `push`, `reverse`, `shift`, `splice`, and `unshift` events.  
   - `Property Accessor` Events: 
     - `get`, `set`, `delete`  

## Illustrations
### Importation
```
import { Model, Schema } from 'objecture'
```

### Instantiation


### Objecture Model
```
const object = new Model({
  propertyA: {
    propertyB: {
      propertyC: true,
      propertyD: false,
    }
  },
  propertyE: [{
    propertyF: 1,
    propertyG: 0
  }],
  propertyH: {
    propertyI: "1",
    propertyJ: null
  }
}, {
  events: { 'assign' },
  enableEvents: true,
})
```

### Objecture Schema