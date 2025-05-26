import { typedObjectLiteral, typeOf, variables } from 'recourse'
import Verification from './verification/index.js'
import Validation from './validation/index.js'
import {
  RequiredValidator, TypeValidator, RangeValidator, 
  LengthValidator, EnumValidator, MatchValidator
} from './validators/index.js'
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
function parseValidateArguments(...$arguments) {
  let $sourceName, $source, $target
  if($arguments.length === 1) {
    $sourceName = null; $source = $arguments.shift(); $target = null
  }
  else if($arguments.length === 2) {
    if(['number', 'string'].includes(typeof $arguments[0])) {
      $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = null
    }
    else if($arguments[0] && typeof $arguments[0] === 'object') {
      $sourceName = null; $source = $arguments.shift(); $target = $arguments.shift()
    }
  }
  else if($arguments.length === 3) {
    if(['number', 'string'].includes(typeof $arguments[0])) {
      $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = $arguments.shift()
    }
  }
  return { $sourceName, $source, $target }
}
function parseValidatePropertyArguments(...$arguments) {
  let [$key, $value, $source, $target] = $arguments
  return { $key, $value, $source, $target }
}
function parseProperties($properties, $schema) {
  const properties = typedObjectLiteral($properties)
  if(_isPropertyDefinition($properties, $schema)) { return $properties }
  iterateProperties: 
  for(const [
    $propertyKey, $propertyValue
  ] of Object.entries($properties)) {
    let propertyDefinition = {}
    const typeOfPropertyValue = typeOf($propertyValue)
    const isPropertyDefinition = _isPropertyDefinition($propertyValue, $schema)
    if(variables.TypeValues.includes($propertyValue)) {
      Object.assign(propertyDefinition, { type: { value: $propertyValue } })
    }
    else if(variables.TypeKeys.includes($propertyValue)) {
      Object.assign(propertyDefinition, { type: { value: variables.Types[$propertyValue] } })
    }
    else if(!isPropertyDefinition) {
      const subpropertyPath = ($schema.path) ? [$schema.path, $propertyKey].join('.') : $propertyKey
      Object.assign(propertyDefinition, {
        type: { type: 'type', value: new Schema($propertyValue, Object.assign({}, $schema.options, {
          parent: $schema,
          path: subpropertyPath
        })) }
      })
    }
    else if(isPropertyDefinition) {
      for(const [$propertyValidatorName, $propertyValidator] of Object.entries($propertyValue)) {
        const isValidatorDefinition = _isValidatorDefinition($propertyValidator, $schema)
        if(!isValidatorDefinition) {
          let propertyValidator
          if($propertyValidatorName === 'type') {
            if($propertyValidator && typeof $propertyValidator === 'object') {
              const subpropertyPath = ($schema.path) ? [$schema.path, $propertyKey].join('.') : $propertyKey
              propertyValidator = new Schema($propertyValidator, Object.assign({}, $schema.options, {
                parent: $schema, 
                path: subpropertyPath,
              }))
            }
            else {
              propertyValidator = $propertyValidator
            }
          }
          else {
            propertyValidator = $propertyValidator
          }
          propertyDefinition[$propertyValidatorName] = {
            type: $propertyValidatorName, value: propertyValidator
          }
        }
        else if(isValidatorDefinition) {
          propertyDefinition[$propertyValidatorName] = $propertyValidator
        }
      }
    }
    propertyDefinition.validators = []
    properties[$propertyKey] = propertyDefinition
    const validators = new Map()
    validators.set('type', Object.assign({}, {
      type: 'type', validator: TypeValidator, value: propertyDefinition.type.value
    }))
    validators.set('required', Object.assign({}, {
      type: 'required', validator: RequiredValidator, value: propertyDefinition.required?.value || false
    }))
    if(propertyDefinition.range) { validators.set('range', Object.assign({}, propertyDefinition.range, {
      type: 'range', validator: RangeValidator
    })) }
    else if(propertyDefinition.min || propertyDefinition.max) { validators.set('range', Object.assign({}, {
      type: 'range', min: propertyDefinition.min, max: propertyDefinition.max, validator: RangeValidator
    })) }
    if(propertyDefinition.length) { validators.set('length', Object.assign({}, propertyDefinition.length, {
      type: 'length', validator: LengthValidator
    })) }
    else if(propertyDefinition.minLength || propertyDefinition.maxLength) { validators.set('length', Object.assign({}, {
      type: 'length', min: propertyDefinition.minLength, max: maxLength, validator: LengthValidator
    })) }
    if(propertyDefinition.enum) { validators.set('enum', Object.assign({}, propertyDefinition.enum, {
      type: 'enum', validator: EnumValidator
    })) }
    if(propertyDefinition.match) { validators.set('match', Object.assign({}, propertyDefinition.match, {
      type: 'match', validator: MatchValidator
    })) }
    delete propertyDefinition.min
    delete propertyDefinition.max
    delete propertyDefinition.minLength
    delete propertyDefinition.maxLength
    for(const [
      $validatorName, $validatorSettings
    ] of validators.entries()) {
      const ValidatorClass = $validatorSettings.validator
      propertyDefinition[$validatorName] = $validatorSettings
      propertyDefinition.validators.push(new ValidatorClass($validatorSettings, $schema))
    }
  }
  return properties
}
function _isPropertyDefinition($object, $schema) {
  if(!$object || $object instanceof Schema) { return false }
  const typeKey = $schema.options.properties.type
  return Object.hasOwn($object, typeKey)
}
function _isValidatorDefinition($object, $schema) {
  if(!$object) { return false }
  const valueKey = $schema.options.properties.value
  return Object.hasOwn($object, valueKey)
}
export default Schema