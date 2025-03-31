# Schema Class
**MVC Framework \| Class System \| Model \| *Schema***  

## Schema Options
### `required` Option
**Type**: `boolean`  
**Default**: `false`  
**Descript**:  
 - Defines whether all property validators must pass verification to validate (`true`) or at least one must pass (`false`).  
### `verificationType` Option
**Type**: `string`  
**Default**: 'all'  
**Enum**: [`all`,`one`]  
**Descript**:  
 - Defines whether property validator verification stops after `all` or `one` nonpass.  
## Schema Constructor
### `$properties` Argument
**Type**: [`object`,`array`]  
**Default**: `object`  
**Descript**:  
 - `$properties` are an `object` or `array` containing Context Property Definitions.  
### `$options` Argument
**Type**: `object`  
**Default**: `object`  
### `constructor` Body
**Type**: `function`  
 - Assigns `$properties` to `this.#properties`  
 - Assigns `Options`, `$options` to `this.options`
## Public Properties
### `type` Get Property
**Type**: `get`    
**Returns**: `this.#_type`  
**Descript**:  
 - When `undefined` assigns the `typeOf` `this.#properties` (`object`, `array`) to `this.#_type`.  
### `required` Get Property
**Type**: `get`  
**Returns**: `this.options.required`  
### `requiredProperties` Property
**Type**: `get`  
**Returns**: `this.#_requiredProperties`  
**Descript**:  
 - When `undefined` assigns all required properties from `this.context` to `this.#_requiredProperties`.  
### `requiredPropertiesSize` Property
**Type**: `get`  
**Returns**: `this.#_requiredPropertiesSize`  
**Descript**:  
 - When `undefined` assigns `this.requiredProperties.length` to `this.#_requiredPropertiesSize`.  
### `verificationType` Property
**Type**: `get`  
**Returns**: `this.options.verificationType`  
### `context` Property
**Type**: `get`  
**Returns**: `this.#_context`
**Descript**:  
 - When `undefined` assigns new `Context` instance to `this.#_context`.  
## Public Methods
### `validate` Method
**Type**: `function`  
**Arguments: ($source)\|($sourceName, $source)\|($sourceName, $source, $target)\|($source, $target)
**Returns**: `validation`  
**Descript**:  
 - Creates new `validation` instance.  
 - Validates `$source` properties through `this.validateProperty` invocations.  
 - Assigns source property validations to `validation.properties`, `validation.advance`, `validation.deadvance`, and `validation.advance` properties.  
 - When `this.required` is `true`:  
   - *Any* `validation.deadvance` properties result in `validation.valid` being `false`.  
   - Absent deadvanced properties *any* `validation.advance` properties result in `validation.valid` being `true`.  
   - Absent deadvanced, advanced properties *any* `validation.unadvanced` properties result in `validation.valid` being `undefined. `
   - Absent deadvanced, advanced, unadvanced properties `validation.valid` is `false`.   
 - When `this.required` is `false`:  
   - *Any* **deadvanced required properties** result in `validation.valid` being `false`.  
   - *Any* advanced properties result in `validation.valid` being `true`.  
   - Absent advanced properties *any* deadvanced properties result in `validation.valid` being `false`.  
   - Absent advanced, deadvanced properties *any* unadvanced properties result in `validation.valid` being `undefined`.  
   - Absent advanced, deadvanced properties, unadvanced properties `validation.valid` is `false`.  
### `validateProperty` Method
**Type**: `function`  

## Private Methods
### `#parseValidateArguments` Method
**Type**: `function`  
**Arguments**: `this.validate` Method Arguments
**Returns**: `object`   
**Descript**:  
 - Parses `arguments` from `this.validate` then returns `$sourceName`, `$source`, and `$target`.  
 - Used by `this.validate` method to perform validation.  
## Private Properties
### `#properties` Property
**Type**: `object`\|`array`
### `#_type` Property
**Type**: `string`  
### `#_context` Property
**Type**: `context`  
### `#_requiredProperties` Property
**Type**: [`array`, `object`]  
### `#_requiredPropertiesSize` Property
**Type**: `number`  