# Schema Context Class
**MVC Framework \| api \| Model \| Schema \| *Context***  
 - Schema Context Class utilized by Schema Class.  
 - Configures, stores Property Definitions.  

## Properties
**Type**: `object`\|`array`
###  `type` Property
#### `context.type`: `object`  
#### `context.type`: `array`  
**Impand**
```
[Number]
[String]
[Boolean]
```
**Expand**:  
```
[{ type: Number }]
[{ type: String }]
[{ type: Boolean }]
```
#####
##### `context.type`: `array`  

## Constructor
**Type**: `function`  
**Returns**: `this.proxy`  
**Descript**:  
 - Assigns `$properties` to `this.#properties`
### `$properties` Argument
**Type**: `object`\|`array`  
**Returns**:  `this.proxy`  
 - `array` or `object` containing one or more impanded/expanded Property Definitions.  

## Public Properties
### `required` Property
### `schema` Property
### `type` Property
### `proxy` Property
### `source` Property

## Private Methods
### `#parsePropertyDefinition` Method

## Private Properties
### `#properties` Property
### `#handler` Property
### `#_properties` Property
### `#_schema` Property
### `#_type` Property
### `#_proxy` Property
### `#_handler` Property
### `#_source` Property