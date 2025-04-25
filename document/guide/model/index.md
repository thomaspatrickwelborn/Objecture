| [❂ Objecture](../../../README.md) | [Guide](../index.md) | *Model* |
| :-- | :-- | :-- |
# ⏣ Objecture Guide \| Model
| [Events](./events/index.md) | [Methods](./methods/index.md) |
| :-- | :-- |

## Objecture Model Methods
Objecture Model instances manage object/array properties with the same API as their respective classes and additional `get`/`set`/`delete` methods.  
### `Model.set` Method
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
#### `Model.get` Method
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
#### `Model.delete` Method
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
### `Model.defineProperties` Method
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

