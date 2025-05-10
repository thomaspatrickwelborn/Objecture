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
 - Manage structured data models using *familiar* JS `Object`, `Array`, `EventTarget` APIs.  
 - Schematize data structures with property validators.  
 - Capture data model **and** validation events for property changes (including nested property events).  

## ⏣&ensp;Impetus
 - Frontend, backend applications require or benefit from structured data models with validatable schema.  
 - Detecting changes to structured  through property events promotes event-driven application architecture.  
 - Few libraries offer *both* browser-**and**-Node-compatible schematized data models with validators **or** that nested property change events.  

## ⏣&ensp;Impact
 - **Manage data models** for primitive/object data types: 
   - `string`, `number`, `boolean`, `null` primitives; 
   - `object`, `array`. 
 - **Schematize data models** with property validators.  
   - `type`, `required`, `match`, `enum`, `range`, `length` and *custom* validators.  
 - [**Capture data model events**](./document/guide/model/events/index.md) for *any* methods that modify data models.  
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
const content = {
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
const object = new Model(content)
console.log(object.toString({ space: 2, replacer: null }))
console.log("pass", object.toString() === JSON.stringify(content))

```
***`object.valueOf` logs***:  
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
  ],
  "propertyG": "TRUE"
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
  propertyG: String
}
const content = {
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
  propertyG: true
}
const object = new Model(content, schema)
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
const content = {
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
const object = new Model(content, null, {
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
console.log(object.toString({ space: 2, replacer: null }))
```
***logs***  
```
setProperty propertyA.propertyB.propertyC true
set propertyA.propertyB {
  "propertyC": true
}
setProperty propertyA.propertyB {
  "propertyC": true
}
set propertyA {
  "propertyB": {
    "propertyC": true
  }
}
setProperty propertyA {
  "propertyB": {
    "propertyC": true
  }
}
set propertyD.0.propertyE {
  "propertyF": 1
}
2set propertyD.0 {
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
setProperty propertyD [
  {
    "propertyE": {
      "propertyF": 1
    }
  }
]
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
  propertyG: Boolean
})
const content = {
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
}
const object = new Model(content, schema, {
  events: {
    '** validProperty': eventLog,
    '** nonvalidProperty': eventLog,
  },
  enableEvents: true,
})
console.log(object.toString({ space: 2, replacer: null }))
```
***logs***
```
validProperty propertyA
validProperty propertyA.propertyB
validProperty propertyA.propertyB.propertyC
validProperty propertyD
validProperty propertyD.0
validProperty propertyD.0.propertyE
validProperty propertyD.0.propertyE.propertyF
validProperty propertyD.0.propertyE.propertyE
validProperty propertyD.0.propertyE.propertyE.propertyFFF
nonvalidProperty propertyG
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
(`propertyG` nonvalid)

### Ventilated, Schematized Model
- [Example A.5.](./demonstrament/documents/model/examples/readme.md/example-a-5/index.js)
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
      propertyE: { required: true, type: {
        propertyFFF: Number,
        propertyGGG: Boolean,
      } },
      propertyFF: { required: true, type: Boolean },
    }
  }],
  propertyG: Boolean
})
const content = {
  propertyA: {
    propertyB: {
      propertyC: true
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1,
      propertyE: {
        propertyFFF: "1",
        propertyGGG: "true",
      },
      propertyFF: true,
    }
  }, {
    propertyE: {
      propertyF: 1,
      propertyE: {
        propertyFFF: 1,
        propertyGGG: true,
      },
      propertyFF: true,
    }
  }],
  propertyG: true
}
const object = new Model(content, schema, {
  events: {
    '** validProperty': eventLog,
    '** nonvalidProperty': eventLog,
  },
  enableEvents: true,
})
console.log(object.toString({ space: 2, replacer: null }))

``` 
***logs*** 
```
validProperty propertyA
validProperty propertyA.propertyB
validProperty propertyA.propertyB.propertyC
validProperty propertyD
nonvalidProperty propertyD.0
validProperty propertyD.1
validProperty propertyD.1.propertyE
validProperty propertyD.1.propertyE.propertyF
validProperty propertyD.1.propertyE.propertyE
validProperty propertyD.1.propertyE.propertyE.propertyFFF
validProperty propertyD.1.propertyE.propertyE.propertyGGG
validProperty propertyD.1.propertyE.propertyFF
validProperty propertyG
{
  "propertyA": {
    "propertyB": {
      "propertyC": true
    }
  },
  "propertyD": [
    null,
    {
      "propertyE": {
        "propertyF": 1,
        "propertyE": {
          "propertyFFF": 1,
          "propertyGGG": true
        },
        "propertyFF": true
      }
    }
  ],
  "propertyG": true
}
```
(`propertyD.0` nonvalid)
