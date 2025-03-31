# Content `delete` Method
## `delete` Configuration
### `delete` Method Options
```
const contentOptions = {
  methods: {
    accessor: {
      delete: {
        recursive: true,
        events: {
          'deleteProperty': true,
          'delete': true,
        },
      }
    }
  }
}
```
#### `recursive` Option
**Type**: `Boolean`  
**Default**: `true`  
**Descript**: Property paths deleted recursively. 
#### `events` Option
**Type**: `Array`  
**Includes**: `deleteProperty`, `delete`  
**Descript**: Emit included events.  
### Accessor Options
[Content Property Accessor Method Options](../index.md#path-options)

## "Delete Content" Invocation
```
content.delete()
```
**Ulteroptions**:  
```
content.delete($ulteroptions)
```
**Type**: `function`  
**Return**: `Content Proxy`  
**Descript**: Delete rooticle/root properties.  
### Arguments
#### `$ulteroptions` Argument
**Type**: `Object`  
**Descript**: Ulter Content [Get Accessor Method Options](#get-method-options)

## "Delete Content Property" Invocation
```
content.delete($path)
```
**Ulteroptions**:  
```
content.delete($path, $ulteroptions)
```
**Type**: `function`  
**Return**: `undefined`  

### Arguments
#### `$path`
**Type**: `String`  
**Descript**: Property path. 
#### `$ulteroptions` Argument
**Type**: `Object`  
**Descript**: Ulter Content [Get Accessor Method Options](#get-method-options)