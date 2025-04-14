import Model from '../model/index.js'
import { Coutil } from 'core-plex'
const { typedObjectLiteral, typeOf } = Coutil
import Context from './context/index.js'
import Verification from './verification/index.js'
import Validation from './validation/index.js'
import { RequiredValidator } from './validators/index.js'
import Options from './options/index.js' 

const parseValidateArguments = function(...$arguments) {
  let $sourceName, $source, $target
  if($arguments.length === 1) {
    $sourceName = null; $source = $arguments.shift(); $target = null
  }
  else if($arguments.length === 2 && typeof $arguments[0] === 'string') {
    $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = null
  }
  else if($arguments.length === 2 && $arguments[0] && typeof $arguments[0] === 'object') {
    $sourceName = null; $source = $arguments.shift(); $target = $arguments.shift()
  }
  else if($arguments.length === 3 && typeof $arguments[0] === 'string') {
    $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = $arguments.shift()
  }
  return { $sourceName, $source, $target }
}
const parseValidatePropertyArguments = function(...$arguments) {
  let [$key, $value, $source, $target] = $arguments
  const sourceIsModelClassInstance = ($source instanceof Model)
  $source = (sourceIsModelClassInstance) ? $source.valueOf() : $source
  const $targetIsModelClassInstance = ($target instanceof Model)
  $target = ($targetIsModelClassInstance) ? $target.valueOf() : $target
  return { $key, $value, $source, $target }
}
export default class Schema extends EventTarget {
  constructor($properties = {}, $options = {}) {
    super()
    Object.defineProperties(this, {
      'options': { configurable: true, get() {
        const options = Options($options)
        Object.defineProperty(this, 'options', { value: options })
        return options
      } },
      'type': { configurable: true, get() { 
        const type = typeOf($properties)
        Object.defineProperty(this, 'type', { value: type })
        return type
      } },
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
        for(const [$propertyKey, $propertyDefinition] of Object.entries(this.context)) {
          if($propertyDefinition.required?.value === true) { requiredProperties[$propertyKey] = $propertyDefinition }
        }
        Object.defineProperty(this, 'requiredProperties', { value: requiredProperties })
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

      'context': { configurable: true, get() {
        const context = new Context($properties, this)
        Object.defineProperty(this, 'context', { value: context })
        return context
      } },
      'validate': { value: function() {
        const { $sourceName, $source, $target } = parseValidateArguments(...arguments)
        const { context, path, required, type } = this
        const validation = new Validation({
          definition: context,
          path: path,
          key: $sourceName, 
          value: $source,
          properties: typedObjectLiteral(type),
        })
        const sourceProperties = Object.entries($source)
        let sourcePropertyIndex = 0
        let deadvancedRequiredProperties = []
        while(sourcePropertyIndex < sourceProperties.length) {
          const [$sourceKey, $sourceValue] = sourceProperties[sourcePropertyIndex]
          const propertyValidation = this.validateProperty($sourceKey, $sourceValue, $source, $target)
          const deadvancedRequiredPropertyValidation = propertyValidation.deadvance.filter(
            ($verification) => $verification.type === 'required'
          )
          validation.properties[$sourceKey] = propertyValidation
          if(propertyValidation.valid === true) { validation.advance.push(propertyValidation) } 
          else if(propertyValidation.valid === false) { validation.deadvance.push(propertyValidation) } 
          else if(propertyValidation.valid === undefined) { validation.unadvance.push(propertyValidation )}
          deadvancedRequiredProperties = deadvancedRequiredProperties.concat(deadvancedRequiredPropertyValidation)
          sourcePropertyIndex++
        }
        if(required === true) {
          if(validation.deadvance.length) { validation.valid = false }
          else if(validation.advance.length) { validation.valid = true }
          else if(validation.unadvance.length) { validation.valid = undefined }
          else { validation.valid = false }
        }
        else if(required === false) {
          if(deadvancedRequiredProperties.length) { validation.valid = false }
          else if(validation.advance.length) { validation.valid = true }
          else if(validation.deadvance.length) { validation.valid = false }
          else if(validation.unadvance.length) { validation.valid = undefined }
          else { validation.valid = false }
        }
        return validation
      } },
      'validateProperty': { value: function() {
        const { $key, $value, $source, $target } = parseValidatePropertyArguments(...arguments)
        const { context, path, required, type, verificationType } = this
        let propertyDefinition
        if(type === 'array') { propertyDefinition = context[0] }
        else if(type === 'object') { propertyDefinition = context[$key] }
        const propertyValidationPath = (path) ? [path, $key].join('.') : $key
        const propertyValidation = new Validation({
          required, verificationType,
          definition: propertyDefinition,
          path: propertyValidationPath,
          key: $key,
          value: $value,
        })
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
        else if(propertyDefinition instanceof Schema) {
          let validation
          if($target && $target[$key]) { validation = propertyDefinition.validate($key, $value, $target[$key]) }
          else { validation = propertyDefinition.validate($key, $value) }
          if(validation.valid === true) { propertyValidation.advance.push(validation) }
          else if(validation.valid === false) { propertyValidation.deadvance.push(validation) }
          else if(validation.valid === undefined) { propertyValidation.unadvance.push(validation) }
        }
        else {
          iterateContextValueValidators:
          for(const [$validatorIndex, $validator] of Object.entries(propertyDefinition.validators)) {
            const verification = $validator.validate($key, $value, $source, $target)
            if(verification.pass === true) { propertyValidation.advance.push(verification) }
            else if(verification.pass === false) { propertyValidation.deadvance.push(verification) }
            else if(verification.pass === undefined) { propertyValidation.unadvance.push(verification) }
            if(this.verificationType === 'one' && propertyValidation.deadvance.length) { break iterateContextValueValidators }
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