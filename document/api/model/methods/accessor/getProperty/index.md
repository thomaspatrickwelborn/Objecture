# Model `get` Method
## `get` Configuration
### `get` Method Options
```
const modelOptions = {
  methods: {
    map: {
      get: {
        events: {
          'getProperty': true,
          'get': true
        },
      }
    }
  }
}
```
#### `events` Option
**Type**: `Array`  
**Includes**: `getProperty`, `get`  
**Descript**: Emit included events.  

### Map Options
[Model Map Method Options](../index.md#path-options)

## "Get Model" Invocation
```
model.get()
```
**Type**: `function`  
**Return**: `Model Proxy`  
### Arguments
None.  

## "Get Model Property" Invocation
```
model.get($path)
```
**Ulteroptions**:  
```
model.get($path, $ulteroptions)
```
**Type**: `function`  
**Return**: `Primitive Literal`, `Model Proxy`
### Arguments
#### `$path` Argument
**Type**: `String`  
**Descript**: Property path. 
#### `$ulteroptions` Argument
**Type**: `Object`  
**Descript**: Ulter Model [Get Map Method Options](#get-method-options)