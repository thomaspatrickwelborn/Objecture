# Content `get` Method
## `get` Configuration
### `get` Method Options
```
const contentOptions = {
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
[Content Property Accessor Method Options](../index.md#path-options)

## "Get Content" Invocation
```
content.get()
```
**Type**: `function`  
**Return**: `Content Proxy`  
### Arguments
None.  

## "Get Content Property" Invocation
```
content.get($path)
```
**Ulteroptions**:  
```
content.get($path, $ulteroptions)
```
**Type**: `function`  
**Return**: `Primitive Literal`, `Content Proxy`
### Arguments
#### `$path` Argument
**Type**: `String`  
**Descript**: Property path. 
#### `$ulteroptions` Argument
**Type**: `Object`  
**Descript**: Ulter Content [Get Accessor Method Options](#get-method-options)