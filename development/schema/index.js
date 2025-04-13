import Model from '../model/index.js'
import { Coutil } from 'core-plex'
const { typedObjectLiteral, typeOf } = Coutil
import Context from './context/index.js'
import Verification from './verification/index.js'
import Validation from './validation/index.js'
import { RequiredValidator } from './validators/index.js'
import Options from './options/index.js' 

export default class Schema extends EventTarget {
  constructor($properties = {}, $options = {}) {
    super()
    Object.defineProperty(this, 'options', { configurable: true, get() {
      const options = Options($options)
      Object.defineProperty(this, 'options', { value: options })
      return options
    }})
    Object.defineProperty(this, 'type', { configurable: true, get() { 
      const type = typeOf($properties)
      Object.defineProperty(this, 'options', { value: type })
      return type
    }})
    Object.defineProperty(this, 'parent', { configurable: true, get() {
      const parent = (this.options.parent) ? this.options.parent : null
      Object.defineProperty(this, 'parent', { value: parent })
      return parent
    } })
    Object.defineProperty(this, 'root', { configurable: true, get() {
      let root = this
      iterateParents: 
      while(root) {
        if([undefined, null].includes(root.parent)) { break iterateParents }
        root = root.parent
      }
      return root
    } })
    Object.defineProperty(this, 'key', { configurable: true, get() {
      const key = (this.path) ? this.path.split('.').pop() : null
      Object.defineProperty(this, 'key', { value: key })
      return key
    } })
    Object.defineProperty(this, 'path', { configurable: true, get() {
      const path = (this.options.path)
        ? String(this.options.path)
        : null
      Object.defineProperty(this, 'path', { value: path })
      return path
    } })
    Object.defineProperty(this, 'required', { configurable: true, get() {
      const required = (this.options.required) ? this.options.required : null
      Object.defineProperty(this, 'required', { value: required })
      return required
    } })
    Object.defineProperty(this, 'requiredProperties', { configurable: true, get() {
      const requiredProperties = typedObjectLiteral(this.type)
      iterateContextEntries: 
      for(const [$propertyKey, $propertyDefinition] of Object.entries(this.context)) {
        if($propertyDefinition.required?.value === true) { requiredProperties[$propertyKey] = $propertyDefinition }
      }
      Object.defineProperty(this, 'requiredProperties', { value: requiredProperties })
      return requiredProperties
    } })

    Object.defineProperty(this, 'requiredPropertiesSize', { configurable: true, get() {
      const requiredPropertiesSize = Object.keys(this.requiredProperties).length
      Object.defineProperty(this, 'requiredPropertiesSize', { value: requiredPropertiesSize })
      return requiredPropertiesSize
    } })

    Object.defineProperty(this, 'verificationType', { configurable: true, get() {
      const verificationType = this.options.verificationType
      Object.defineProperty(this, 'verificationType', { value: verificationType })
      return verificationType
    } })

    Object.defineProperty(this, 'context', { configurable: true, get() {
      const context = new Context($properties, this)
      Object.defineProperty(this, 'context', { value: context })
      return context
    } })

    Object.defineProperty(this, 'validate', { value: function() {
      const { $sourceName, $source, $target } = this.#parseValidateArguments(...arguments)
      const validation = new Validation({
        definition: this.context,
        path: this.path,
        key: $sourceName, 
        value: $source,
        properties: typedObjectLiteral(this.type),
      })
      const sourceProperties = Object.entries($source)
      let sourcePropertyIndex = 0
      let deadvancedRequiredProperties = []
      // Iterate Model Properties 
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
      if(this.required === true) {
        if(validation.deadvance.length) { validation.valid = false }
        else if(validation.advance.length) { validation.valid = true }
        else if(validation.unadvance.length) { validation.valid = undefined }
        else { validation.valid = false }
      }
      else if(this.required === false) {
        if(deadvancedRequiredProperties.length) { validation.valid = false }
        else if(validation.advance.length) { validation.valid = true }
        else if(validation.deadvance.length) { validation.valid = false }
        else if(validation.unadvance.length) { validation.valid = undefined }
        else { validation.valid = false }
      }
      return validation
    } })

    Object.defineProperty(this, 'validateProperty', { value: function() {
      const { $key, $value, $source, $target } = this.#parseValidatePropertyArguments(...arguments)
      let propertyDefinition
      if(this.type === 'array') { propertyDefinition = this.context[0] }
      else if(this.type === 'object') { propertyDefinition = this.context[$key] }
      const { path } = this
      const propertyValidationPath = (path) ? [path, $key].join('.') : $key
      const propertyValidation = new Validation({
        // type: this.required,
        definition: propertyDefinition,
        path: propertyValidationPath,
        key: $key,
        value: $value,
      })
      // Context Value: Undefined
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
      // Context Value: Object
      else if(propertyDefinition instanceof Schema) {
        let validation
        if($target && $target[$key]) { validation = propertyDefinition.validate($key, $value, $target[$key]) }
        else { validation = propertyDefinition.validate($key, $value) }
        if(validation.valid === true) { propertyValidation.advance.push(validation) }
        else if(validation.valid === false) { propertyValidation.deadvance.push(validation) }
        else if(validation.valid === undefined) { propertyValidation.unadvance.push(validation) }
      }
      // Context Value: Primitive
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
    } })
  }
  #parseValidateArguments() {
    let $arguments = [...arguments]
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
  #parseValidatePropertyArguments() {
    let $arguments = [...arguments]
    let [$key, $value, $source, $target] = $arguments
    // const ModelClassString = Model.toString()
    const sourceIsModelClassInstance = ($source instanceof Model)
    $source = (sourceIsModelClassInstance) ? $source.valueOf() : $source
    const $targetIsModelClassInstance = ($target instanceof Model)
    $target = ($targetIsModelClassInstance) ? $target.valueOf() : $target
    return { $key, $value, $source, $target }
  }
}