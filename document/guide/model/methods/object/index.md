| [❂ Objecture](../../../../../README.md) | [Guide](../../../index.md) | [Model](../../index.md) | [Methods](../index.md) | *Object*  
| :-- | :-- | :-- | :-- | :-- |

# ⏣ Objecture Guide \| Model Object Methods
## `$model.assign` Method
### `$model.assign` Options
```
{ sourceTree: true }
```
#### `$model.assign` `sourceTree` Option
**Type**: `Boolean`  
**Default**: `true`  
**Descript**:  
 - `true`:  Deep property assignment.  
 - `false`: Shallow property assignment.  
### `$model.assign` Example
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
console.log(object.toString({ space: 2, replacer: null }))
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
object.assign({
  propertyA: {
    propertyB: {
      propertyC: false
    }
  }
}, {
  propertyD: [{
    propertyE: {
      propertyE: {
        propertyFFF: 0
      }
    }
  }],
})
console.log(object.toString({ space: 2, replacer: null }))
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
## `$model.defineProperties` Method
### `$model.defineProperties` Options
```
{ descriptorTree: true }
```
#### `$model.defineProperties` `descriptorTree` Option
**Type**: `Boolean`  
**Default**: `true`  
**Descript**:  
 - `true`:  Deep property definitions.  
 - `false`: Shallow property definitions.  

### `$model.defineProperties` Example
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
      propertyC: { writable: true, value: false }
    } }
  } },
  propertyD: { value: [{
    propertyE: { value: {
      propertyF: { value: 0 },
      propertyE: { value: {
        propertyFFF: { writable: true, value: 0 }
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
*then*  
```
object.get('propertyB').defineProperty('propertyC', { value: true })
object.defineProperties({
  propertyD: { value: [{ value: {
    propertyE: { value: {
      propertyF: { value: 1 }
    } }
  } }] }
})
```
## `$model.freeze` Method
### `$model.freeze` Options
```
{ recursive: true }
```
#### `$model.freeze` `recursive` Option
**Type**: `Boolean`  
**Default**: `true`  
**Descript**:  
 - `true`:  Deep property freeze.  
 - `false`: Shallow property freeze.  

## `$model.seal` Method
### `$model.seal` Options
```
{ recursive: true }
```

#### `$model.seal` `recursive` Option
**Type**: `Boolean`  
**Default**: `true`  
**Descript**:  
 - `true`:  Deep property seal.  
 - `false`: Shallow property seal.  
