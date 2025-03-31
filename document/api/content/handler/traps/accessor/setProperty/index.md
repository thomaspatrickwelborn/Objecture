# `Content` `set` Method
 - [`set` Method Configuration](#set-method-configuration)
 - [`set` "Content" Method Invocation](#set-content-method-invocation)
 - [`set` "Content Property" Method Invocation](#set-content-property-method-invocation)
## `set` Method Configuration
### `set` Method Options
#### `set` Options
```
const contentOptions = {
  methods: {
    accessor: {
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

### Accessor Options
[Content Property Accessor Method Options](../index.md#path-options)

## `set` "Content" Method Invocation
```
content.set($value)
```
**Ulteroptions**:  
```
content.set($value, $ulteroptions)
```
**Type**: `function`  
**Return**: `Content Proxy`  
### Arguments
#### `$value`
**Type**: `Object Literal`, `Content Proxy`  
**Descript**: Content rooticle/root properties replaced by `$value` properties.  
#### `$ulteroptions` Argument
**Type**: `Object`  
**Descript**: Ulter Content [Get Accessor Method Options](#get-method-options)

## `set` "Content Property" Method Invocation
```
content.set($path, $value)
```
**Ulteroptions**:  
```
content.set($path, $value, $ulteroptions)
```
**Type**: `function`  
**Returns**:  
 - `(typeof $value !== 'object)`  
   - **Return**:  `Primitive Literal`  
 - `(typeof $value === 'object)`  
   - **Return**: `Content Proxy`  
### Arguments
#### `$path`
**Type**: `String`  
**Descript**: Property path.  
#### `$value`
**Type**: `Primitive Literal`, `Object Literal`, `Content Proxy`  
**Descript**: Property value. 
#### `$ulteroptions` Argument
**Type**: `Object`  
**Descript**: Ulter Content [Get Accessor Method Options](#get-method-options)
