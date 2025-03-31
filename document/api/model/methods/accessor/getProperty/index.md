# Model `get` Method
## `get` Configuration
### `get` Method Options
```
const modelOptions = {
  methods: {
    accessor: {
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

### Accessor Options
[Model Property Accessor Method Options](../index.md#path-options)

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
**Descript**: Ulter Model [Get Accessor Method Options](#get-method-options)