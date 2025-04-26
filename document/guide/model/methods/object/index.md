| [❂ Objecture](../../../../../README.md) | [Guide](../../../index.md) | [Model](../../index.md) | [Methods](../index.md) | *Object*  
| :-- | :-- | :-- | :-- | :-- |

# ⏣ Objecture Guide \| Model Object Methods
## `Model.assign` Method
### `Model.assign` Options
```
{ sourceTree: true }
```
### `Model.assign` Example
```
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
}, null, {
  assignObject: 'assign'
})
console.log(array.valueOf())
```
***logs***  
```
{
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
```
*then*  
```
object.assign(
  { propertyA: {
    propertyB: {
      propertyC: false
    }
  } },
  { propertyD: [{
    propertyE: {
      propertyE: {
        propertyFFF: 0
      }
    }
  }] },
)
console.log(array.valueOf())
```
***logs***
```
{
  propertyA: {
    propertyB: {
      propertyC: false
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 1,
      propertyE: {
        propertyFFF: 0
      }
    }
  }],
  propertyG: "true"
}
```
## `Model.defineProperties` Method
### `Model.defineProperties` Options
```
{ descriptorTree: true }
```
### `Model.defineProperties` Example
```
const object = new Model({
  propertyA: { writable: true, value: {
    propertyB: { writable: true, value: {
      propertyC: { writable: true, value: true }
    } }
  } },
  propertyD: { value: [{
    propertyE: { value: {
      propertyF: { writable: true, value: 1 },
      propertyE: { value: {
        propertyFFF: { value: 1 }
      } }
    } }
  }] },
  propertyG: { writable: true, value: "true" }
}, null, {
  assignObject: 'defineProperties'
})
console.log(object.valueOf())
```
***logs***  
```
{
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
```
*then*  
```
object.defineProperties({
  propertyA: { value: {
    propertyB: { value: {
      propertyC: { value: false }
    } }
  } },
  propertyD: { value: [{
    propertyE: { value: {
      propertyF: { value: 0 },
      propertyE: { value: {
        propertyFFF: { value: 0 }
      } }
    } }
  }] },
  propertyG: { value: "false" }
})
console.log(object.valueOf())
```
***logs***
```
{
  propertyA: {
    propertyB: {
      propertyC: false
    }
  },
  propertyD: [{
    propertyE: {
      propertyF: 0,
      propertyE: {
        propertyFFF: 1
      }
    }
  }],
  propertyG: "true"
}
```
(`propertyD.0.propertyE.propertyE.propertyFFF` not writable)

## `Model.freeze` Method
### `Model.freeze` Options
```
{ recursive: true }
```
## `Model.seal` Method
### `Model.seal` Options
```
{ recursive: true }
```
