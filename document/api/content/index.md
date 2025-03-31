# Content Class
**MVC Framework \| Class System \| Model \| *Content***  
See Also: [Content Guide](../../../guide/model/content/index.md)  
**Directory**  
 - [Handler Class](./handler/index.md)

## `Options` Property
Default Content Options.  
```
{
  path: null, 
  parent: null, 
  enableValidation: true, 
  validationEvents: true, 
  events: true, 
  enableEvents: true, 
  pathkey: true,
  subpathError: false,
  contentAssignmentMethod: 'set',
}
```
### `path` Option
**Type**: `String`, `null`  
**Default**: `null`  
**Descript**:  
 - When `Content` Class Instance is subproperty of other `Content` Class Instance, `path` is the period-delimited subproperty key from other `Content` Class Instance. 
 - When `Content` Class Instance is base property, `path` is `null`.  
### `parent` Option
**Type**: `Content` Class Instance `proxy` Property, `null`  
**Default**: `null`  
**Descript**:  
 - When `Content` Class Instance is subproperty of other `Content` Class Instance, `parent` is the containing `Content` Class Instance `proxy` property. 
 - When `Content` Class Instance is base property, `parent` is `null`.  
### `enableValidation` Option
**Type**: `boolean`  
**Default**: `true`  
**Descript**:  
 - When `true` and `schema` property value is not `null`, schema validates content properties. 
 - When `false`, no content validation. 
### `validationEvents` Option
**Type**: `boolean`  
**Default**: `true`  
**Descript**:  
 - When `true` and `schema` property value is not `null`, schema validation of content properties dispatches `ValidatorEvent` instances.  
 - When `false`, no `ValidatorEvent` instances dispatched.  
### `contentEvents` Option
**Type**: `boolean`  
**Default**: `true`  
**Descript**:  
 - When `true` and  `content` property values change, dispatch `ContentEvent` instances.  
 - When `false`, no `ContentEvent` instances dispatched.  
### `enableEvents` Option
**Type**: `boolean`  
**Default**: `true`  
**Descript**:  
 - When `true` and `validationEvents` or `contentEvents` values are `true`, dispatch events.  
 - When `false`, no `ContentEvent` or `ValidatorEvent` instances dispatched.  
### `pathkey` Option
**Type**: `boolean`  
**Default**: `true`  
**Descript**:  
 - When `true` accesses object properties using period-delimited path keys.  
 - When `false` acdesses object properties using individual keys.  
### `subpathError` Option
**Type**: `boolean`  
**Default**: `false`  
**Descript**:  
 - When `true` and `pathkey` is `true` accessing nonexistent content properties using path notation throws error.  
 - When `false` and `pathkey` is `true` accessing nonexistent content properties using path notation catches error silently.  
### `contentAssignmentMethod` Option
**Type**: `string`  
**Default**: `set`  
**Enum**: [`set`, `assign`]
**Descript**:  
 - Method used to assign initial properties to proxy.  

## Constructor Method
 - Sets `properties`, `options`, `schema` properties.  
 - Explicitly returns `proxy` property.  
### `$properties` Argument
**Type**: `Array` Literal, `Object` Literal, `Content` Class Instance  
**Descript**:  
 - `$properties` assigned to `properties`.  
### `$options` Argument
**Type**: `Object` Literal  
**Descript**:  
 - `$options` assigned to `options`.  
### `$schema` Argument
**Type**: `Schema` Instance, `Object` Literal, `Array` Literal, `undefined`, `null`  
**Descript**:  
 - `$schema` assigned to `schema`.  

## Public Properties
### `options` Property
**Type**: `get`, `set`    
**Inturn**: `$options` (from `constructor`)  
**Return**: `#_options`  
**Descript**:  
 - Recursively Assigns `Options`, `$options` to `#_options`.  
### `schema` Property
**Type**: `get`, `set`  
**Inturn**: `$schema` (from `constructor`)  
**Return**: `#_schema`  
**Descript**:  
 - When `$schema` is `undefined` or `null`, `#_schema` assigned `null` value.  
 - When `$schema` is instance of `Schema`, `#_schema` assigned `$schema` value.  
 - When `$schema` is an `Array` literal, create a new `Schema` Class Instance with options. 
 - When `$schema` is an `Object` literal, create a new `Schema` without options.  
### `classToString` Property
**Type**: `get`  
**Return**: `Content.toString` Invocation
### `object` Property
**Type**: `get`  
**Return**: `parse` invocation with "object" type.  
### `string` Property
**Type**: `get`  
**Return**: `parse` invocation with "string" type.  
### `type` Property
**Type**: `get`  
**Return**: `#_type`  
**Descript**:  
 - Assigns type of `properties` to `#_type` (either `object` or `array`.  
### `typedObjectLiteral` Property
**Type**: `get`  
**Return**: `Array` Literal, `Object` Literal  
**Descript**:  
 - Return an `Array` or `Object` dependent on `type`  property `array` or `object` value.  
### `parent` Property
**Type**: `get`  
**Inturn**: `Content` Class Instance `proxy` property.  
**Return**: `#_parent`  
**Descript**:  
 - Assigns `$parent` to `#_parent`.  
### `root` Property
**Type**: `get`  
**Return**: Root `Content` Class Instance `proxy` property.  
### `key` Property
**Type**: `get`  
**Return**: `#_key`  
**Descript**:  
 - Assigns `$key` to `#_key`.  
### `path` Property
**Type**: `get`    
**Inturn**: `String` Literal  
**Return**: `#_path`  
**Descript**:  
 - Assigns `$path` to `#_path`.  
### `source` Property
**Type**: `get`  
**Return**: `#_source`  
**Descript**:  
 - Assigns `typedObjectLiteral` to `#_source`.  
### `proxy` Property
**Type**: `get`  
**Return**: `#_proxy`  
**Descript**:  
- Creates new `Proxy` Instance with `source` target and `this.#handler`.  
- Sets `properties` to `proxy`.  
- Assigns new `Proxy` Instance to `#_proxy`.  

## Public Methods
### `parse` Method

## Private Properties
### `#properties` Property
**Type**: `get`, `set`  
**Inturn**: `$properties` (from `constructor`)  
**Return**: `#_properties`  
**Descript**:  
 - When `$properties` is `Content` Class instance, sets `$properties.object` to `#_properties`
 - When `$properties` is not `Content` Class instance, sets `$properties` to `#_properties`  
### `#handler` Property
**Type**: `Handler` Instance  
### `#_properties` Property
**Type**: `Array` Literal, `Object` Literal  
### `#_options` Property
**Type**: `Object` Literal  
### `#_schema` Property
**Type**: `Schema` Instance, `null`  
### `#_type` Property
**Type**: `String` Literal  
### `#_source` Property
**Type**: `Array` Literal, `Object` Literal  
### `#_parent` Property
**Type**: `Content Proxy`  
### `#_key` Property
**Type**: `String` Literal  
### `#_path` Property
**Type**: `String` Literal  
### `#_proxy` Property
**Type**: `Proxy` Instance  
### `#_handler` Property
**Type**: `Handler` Instance  
