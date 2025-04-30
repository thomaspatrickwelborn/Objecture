# `Model` `set` Method
 - [`set` Method Configuration](#set-method-configuration)
 - [`set` "Model" Method Invocation](#set-model-method-invocation)
 - [`set` "Model Property" Method Invocation](#set-model-property-method-invocation)
## `set` Method Configuration
### `set` Method Options
#### `set` Options
```
const modelOptions = {
  methods: {
    map: {
      set: {
        recursive: true,
        events: {
          'setProperty': true,
          'set': true
        },
      }
    }
  }
}
```
#### `recursive` Option
**Type**: `Boolean`  
**Default**: `true`  
**Descript**: Recursively define pathed object literals.  
#### `events` Option
**Type**: `Array`  
**Includes**: `setProperty`, `set`  
**Descript**: Emit included events.  

### Map Options
[Model Map Method Options](../index.md#path-options)

## `set` "Model" Method Invocation
```
model.set($value)
```
**Ulteroptions**:  
```
model.set($value, $ulteroptions)
```
**Type**: `function`  
**Return**: `Model Proxy`  
### Arguments
#### `$value`
**Type**: `Object Literal`, `Model Proxy`  
**Descript**: Model rooticle/root properties replaced by `$value` properties.  
#### `$ulteroptions` Argument
**Type**: `Object`  
**Descript**: Ulter Model [Get Map Method Options](#get-method-options)

## `set` "Model Property" Method Invocation
```
model.set($path, $value)
```
**Ulteroptions**:  
```
model.set($path, $value, $ulteroptions)
```
**Type**: `function`  
**Returns**:  
 - `(typeof $value !== 'object)`  
   - **Return**:  `Primitive Literal`  
 - `(typeof $value === 'object)`  
   - **Return**: `Model Proxy`  
### Arguments
#### `$path`
**Type**: `String`  
**Descript**: Property path.  
#### `$value`
**Type**: `Primitive Literal`, `Object Literal`, `Model Proxy`  
**Descript**: Property value. 
#### `$ulteroptions` Argument
**Type**: `Object`  
**Descript**: Ulter Model [Get Map Method Options](#get-method-options)
