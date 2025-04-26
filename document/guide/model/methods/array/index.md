| [❂ Objecture](../../../../../README.md) | [Guide](../../../index.md) | [Model](../../../index.md) | [Methods](../index.md) | *Array* 
| :-- | :-- | :-- | :-- | :-- |

# ⏣ Objecture Guide \| Model Array Methods
## `Model.concat` Method

## `Model.copyWithin` Method
## `Model.fill` Method
### `Model.fill` Options
```
{ lengthen: true }
```
## `Model.pop` Method
## `Model.push` Method
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
## `Model.reverse` Method
## `Model.shift` Method
## `Model.splice` Method
## `Model.unshift` Method
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

