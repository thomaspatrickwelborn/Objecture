| [❂ Objecture](../../../../../README.md) | [Guide](../../../index.md) | [Model](../../index.md) | [Methods](../index.md) | *Accessor*  
| :-- | :-- | :-- | :-- | :-- |

# ⏣ Objecture Guide \| Model Accessor Methods
## `Model.set` Method
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
## `Model.get` Method
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
## `Model.delete` Method
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