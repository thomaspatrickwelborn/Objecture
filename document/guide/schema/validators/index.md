| [❂ Objecture](../../../../README.md) | [Guide](../../index.md) | [Schema](../index.md) | *Validators* |
| :-- | :-- | :-- | :-- |
# ⏣ Objecture Guide \| Schema

## Objecture Schema Validators
### Schema Type Validator
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
***logs***  
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
***logs***  
```
{
  propertyB: true,
}
```
***then***  
```
const object = new Model({
  propertyA: "TRUE",
  propertyB: "true",
  propertyC: 1,
}, {
  propertyA: Boolean,
  propertyB: Number,
  propertyC: String,
})
console.log(object.valueOf())
```
***logs***  
```
{}
```
