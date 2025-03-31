# Model `delete` Method
## `delete` Configuration
### `delete` Method Options
```
const modelOptions = {
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
[Model Property Accessor Method Options](../index.md#path-options)

## "Delete Model" Invocation
```
model.delete()
```
**Ulteroptions**:  
```
model.delete($ulteroptions)
```
**Type**: `function`  
**Return**: `Model Proxy`  
**Descript**: Delete rooticle/root properties.  
### Arguments
#### `$ulteroptions` Argument
**Type**: `Object`  
**Descript**: Ulter Model [Get Accessor Method Options](#get-method-options)

## "Delete Model Property" Invocation
```
model.delete($path)
```
**Ulteroptions**:  
```
model.delete($path, $ulteroptions)
```
**Type**: `function`  
**Return**: `undefined`  

### Arguments
#### `$path`
**Type**: `String`  
**Descript**: Property path. 
#### `$ulteroptions` Argument
**Type**: `Object`  
**Descript**: Ulter Model [Get Accessor Method Options](#get-method-options)