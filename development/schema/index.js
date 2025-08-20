import { typedObjectLiteral, typeOf, variables } from 'recourse'
import Verification from './verification/index.js'
import Validation from './validation/index.js'
import {
  RequiredValidator, TypeValidator, RangeValidator, 
  LengthValidator, EnumValidator, MatchValidator
} from './validators/index.js'
import {
  parseValidateArguments,
  parseValidatePropertyArguments,
  parseProperties,
  // _isPropertyDefinition,
  // _isValidatorDefinition,
} from './parsers/index.js'
import Options from './options/index.js' 
class Schema extends EventTarget {
  constructor($properties = {}, $options = {}) {
    super()
    Object.defineProperties(this, {
      'options': { value: Options($options) },
      'type': { value: typeOf($properties) },
      'parent': { configurable: true, get() {
        const { options } = this
        const parent = (options.parent) ? options.parent : null
        Object.defineProperty(this, 'parent', { value: parent })
        return parent
      } },
      'root': { configurable: true, get() {
        let root = this
        iterateParents: 
        while(root) {
          if([undefined, null].includes(root.parent)) { break iterateParents }
          root = root.parent
        }
        return root
      } },
      'key': { configurable: true, get() {
        const { path } = this
        const key = (path) ? path.split('.').pop() : null
        Object.defineProperty(this, 'key', { value: key })
        return key
      } },
      'path': { configurable: true, get() {
        const { options } = this
        const path = (options.path)
          ? String(options.path)
          : null
        Object.defineProperty(this, 'path', { value: path })
        return path
      } },
      'required': { configurable: true, get() {
        const required = this.options.required
        Object.defineProperty(this, 'required', { value: required })
        return required
      } },
      'requiredProperties': { configurable: true, get() {
        const requiredProperties = typedObjectLiteral(this.type)
        iterateContextEntries: 
        for(const [$propertyKey, $propertyDefinition] of Object.entries(this.target)) {
          if($propertyDefinition.required?.value === true) {
            requiredProperties[$propertyKey] = $propertyDefinition
          }
        }
        Object.defineProperty(this, 'requiredProperties', { value: Object.freeze(requiredProperties) })
        return requiredProperties
      } },
      'requiredPropertiesSize': { configurable: true, get() {
        const requiredPropertiesSize = Object.keys(this.requiredProperties).length
        Object.defineProperty(this, 'requiredPropertiesSize', { value: requiredPropertiesSize })
        return requiredPropertiesSize
      } },
      'verificationType': { configurable: true, get() {
        const verificationType = this.options.verificationType
        Object.defineProperty(this, 'verificationType', { value: verificationType })
        return verificationType
      } },
      'target': { configurable: true, get() {
        let properties
        const type = this.type
        if(type === 'array') { properties = $properties.slice(0, 1) }
        else if(type === 'object') { properties = $properties }
        const target = parseProperties(properties, this)
        Object.defineProperty(this, 'target', { value: target })
        return target
      } },
      'getProperty': { value: function($property) {
        // if(this.type !== 'object')
        if(isNaN($property)) { return this.target[$property] }
        else if(Object.has(this.target, $property)) { return this.target[$property] }
        else { return this.target[0] }
      } },
      'validate': { value: function(...$arguments) {
        let { $sourceName, $source, $target } = parseValidateArguments(...$arguments)
        $target = $target || typedObjectLiteral($source)
        const { target, path, required, type, verificationType } = this
        let validation = new Validation({
          required, verificationType,
          definition: target,
          key: $sourceName, 
          value: $source,
        }, this)
        const sourceProperties = Object.entries($source)
        let sourcePropertyIndex = 0
        while(sourcePropertyIndex < sourceProperties.length) {
          const [$sourceKey, $sourceValue] = sourceProperties[sourcePropertyIndex]
          const propertyValidation = this.validateProperty($sourceKey, $sourceValue, $source, $target)
          if(propertyValidation.valid === true) { validation.advance.push(propertyValidation) } 
          else if(propertyValidation.valid === false) { validation.deadvance.push(propertyValidation) } 
          else if(propertyValidation.valid === undefined) { validation.unadvance.push(propertyValidation )}
          sourcePropertyIndex++
        }
        if(validation.advance.length) { validation.valid = true }
        else if(validation.deadvance.length) { validation.valid = false }
        else if(validation.unadvance.length) { validation.valid = undefined }
        else { validation.valid = true }
        return validation
      } },
      'validateProperty': { value: function() {
        const { $key, $value, $source, $target } = parseValidatePropertyArguments(...arguments)
        const { target, path, required, schema, type, verificationType } = this
        let propertyDefinition
        if(type === 'array') { propertyDefinition = target[0] }
        else if(type === 'object') { propertyDefinition = target[$key] }
        const propertyValidation = new Validation({
          required,
          verificationType,
          definition: propertyDefinition,
          key: $key,
          value: $value,
        }, this)
        if(propertyDefinition === undefined) {
          const verification = new Verification({
            type: null,
            definition: null,
            key: $key,
            value: $value,
          }, this)
          verification.pass = false
          propertyValidation.unadvance.push(verification)
        }
        else {
          iteratePropertyDefinitionValidators:
          for(const [$validatorIndex, $validator] of Object.entries(propertyDefinition.validators)) {
            const verification = $validator.validate($key, $value, $source, $target)
            if(verification.pass === true) { propertyValidation.advance.push(verification) }
            else if(verification.pass === false) { propertyValidation.deadvance.push(verification) }
            else if(verification.pass === undefined) { propertyValidation.unadvance.push(verification) }
            if(this.verificationType === 'one' && propertyValidation.deadvance.length) {
              break iteratePropertyDefinitionValidators
            }
          }
        }
        if(propertyValidation.deadvance.length) { propertyValidation.valid = false }
        else if(propertyValidation.advance.length) { propertyValidation.valid = true }
        else if(propertyValidation.unadvance.length) { propertyValidation.valid = false }
        return propertyValidation
      } },
    })
  }
}

export default Schema