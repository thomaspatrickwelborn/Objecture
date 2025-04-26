| [❂ Objecture](../../../README.md) | [Guide](../index.md) | [Model](../index.md) | *Methods* |
| :-- | :-- | :-- | :-- |
# ⏣ Objecture Guide \| Model Methods
Objecture Model instances manage object/array properties with same API as their respective prototypal classes and additional `get`/`set`/`delete` methods with map API. Each method may be optionally configured with convenience features.  

## Model Mutator Methods
### `Model.set` Method
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
})
```
### `Model.get` Method
```
console.log(object.get())
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
### `Model.delete` Method
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
### `Model.assign` Method
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
### `Model.defineProperties` Method
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

### `Model.push` Method
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

### `Model.unshift` Method
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


References
-----
 - [JS Object API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
 - [JS Array API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
 - [JS Map API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)