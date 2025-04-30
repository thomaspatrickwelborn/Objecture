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
   - `Map` Events: 
     - `get`, `set`, `delete`  
 - **Capture validation events/data** for array/object properties.    
   - `valid`, `nonvalid` `validProperty`, `nonvalidProperty` events.  
   - Schema validation object with `report` method.  

## ⏣&ensp;Illustrations
```
import { Model, Schema } from 'objecture'
```
### Objecture Model
- [Example A.1.](./demonstrament/documents/model/examples/readme.md/example-a-1/index.js)
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
***`object.valueOf` logs***:  
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
- [Example A.2.](./demonstrament/documents/model/examples/readme.md/example-a-2/index.js)
```
const schema = {
  propertyA: {
    propertyB: {
      propertyC: Boolean
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: Number,
      propertyE: {
        propertyFFF: Number
      }
    }
  }],
  propertyG: Boolean
}
const object = new Model({
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1,
      propertyE: {
        propertyFFF: 1
      }
    }
  }],
  propertyG: "true"
}, schema)
console.log(object.toString({ space: 2, replacer: null }))
```
***`object.toString` logs***:  
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
        "propertyF": 1,
        "propertyE": {
          "propertyFFF": 1
        }
      }
    }
  ],
  "propertyG": "true"
}
```
(`propertyG` nonvalid)

### Ventilated Objecture Model
- [Example A.3.](./demonstrament/documents/model/examples/readme.md/example-a-3/index.js)
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
- [Example A.4.](./demonstrament/documents/model/examples/readme.md/example-a-4/index.js)
```
const schema = new Schema({
  propertyA: {
    propertyB: {
      propertyC: Boolean
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: Number,
      propertyE: {
        propertyFFF: Number
      }
    }
  }],
  propertyG: String
})
const object = new Model({
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1,
      propertyE: {
        propertyFFF: 1
      }
    }
  }],
  propertyG: "true"
}, schema, {
  events: {
    '** valid': eventLog,
    '** validProperty': eventLog,
    '** nonvalid': eventLog,
    '** nonvalidProperty': eventLog,
  },
  enableEvents: true,
})
console.log(object.toString({ space: 2, replacer: null }))

```
***logs***  
```
validProperty propertyA {
  "propertyB": {
    "propertyC": true
  }
}
validProperty propertyA.propertyB {
  "propertyC": true
}
validProperty propertyA.propertyB.propertyC true
valid propertyA.propertyB. {
  "propertyC": true
}
valid propertyA. {
  "propertyB": {
    "propertyC": true
  }
}
validProperty propertyD [
  {
    "propertyE": {
      "propertyF": 1,
      "propertyE": {
        "propertyFFF": 1
      }
    }
  }
]
validProperty propertyD.0 {
  "propertyE": {
    "propertyF": 1,
    "propertyE": {
      "propertyFFF": 1
    }
  }
}
validProperty propertyD.0.propertyE {
  "propertyF": 1,
  "propertyE": {
    "propertyFFF": 1
  }
}
validProperty propertyD.0.propertyE.propertyF 1
validProperty propertyD.0.propertyE.propertyE {
  "propertyFFF": 1
}
validProperty propertyD.0.propertyE.propertyE.propertyFFF 1
valid propertyD.0.propertyE.propertyE. {
  "propertyFFF": 1
}
valid propertyD.0.propertyE. {
  "propertyF": 1,
  "propertyE": {
    "propertyFFF": 1
  }
}
valid propertyD.0. {
  "propertyE": {
    "propertyF": 1,
    "propertyE": {
      "propertyFFF": 1
    }
  }
}
valid propertyD. [
  {
    "propertyE": {
      "propertyF": 1,
      "propertyE": {
        "propertyFFF": 1
      }
    }
  }
]
nonvalidProperty propertyG "true"
valid null {
  "propertyA": {
    "propertyB": {
      "propertyC": true
    }
  },
  "propertyD": [
    {
      "propertyE": {
        "propertyF": 1,
        "propertyE": {
          "propertyFFF": 1
        }
      }
    }
  ],
  "propertyG": "true"
}
 {
  "propertyA": {
    "propertyB": {
      "propertyC": true
    }
  },
  "propertyD": [
    {
      "propertyE": {
        "propertyF": 1,
        "propertyE": {
          "propertyFFF": 1
        }
      }
    }
  ]
}
```