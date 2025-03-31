import { Coutil } from 'core-plex'
const { typedObjectLiteral, typeOf } = Coutil
import Model from '../model/index.js'
import Context from './context/index.js'
import Verification from './verification/index.js'
import Validation from './validation/index.js'
import { RequiredValidator } from './validators/index.js'
import Options from './options/index.js' 

export default class Schema extends EventTarget{
  #properties
  options
  #type
  #context
  #parent
  #key
  #path
  #requiredProperties
  #requiredPropertiesSize
  constructor($properties = {}, $options = {}) {
    super()
    this.#properties = $properties
    this.options = Options($options)
  }
  get type() {
    if(this.#type !== undefined) return this.#type
    this.#type = typeOf(this.#properties)
    return this.#type
  }
  get parent() {
    if(this.#parent !== undefined)  return this.#parent
    this.#parent = (this.options.parent) ? this.options.parent : null
    return this.#parent
  }
  get root() {
    let root = this
    iterateParents: 
    while(root) {
      if([undefined, null].includes(root.parent)) { break iterateParents }
      root = root.parent
    }
    return root
  }
  get key() {
    if(this.#key !== undefined) { return this.#key }
    if(this.path) { this.#key = this.path.split('.').pop() }
    else { this.#key = null }
    return this.#key
  }
  get path() {
    if(this.#path !== undefined)  return this.#path
    this.#path = (this.options.path)
      ? String(this.options.path)
      : null
    return this.#path
  }
  get required() { return this.options.required }
  get requiredProperties() {
    if(this.#requiredProperties !== undefined) return this.#requiredProperties
    let requiredProperties = typedObjectLiteral(this.type)
    iterateContextEntries: 
    for(const [$propertyKey, $propertyDefinition] of Object.entries(this.context)) {
      if($propertyDefinition.required?.value === true) { requiredProperties[$propertyKey] = $propertyDefinition }
    }
    this.#requiredProperties = requiredProperties
    return this.#requiredProperties
  }
  get requiredPropertiesSize() {
    if(this.#requiredPropertiesSize !== undefined) return this.#requiredPropertiesSize
    this.#requiredPropertiesSize = Object.keys(this.requiredProperties).length
    return this.#requiredPropertiesSize
  }
  get verificationType() { return this.options.verificationType }
  get context() {
    if(this.#context !== undefined) return this.#context
    this.#context = new Context(this.#properties, this)
    return this.#context
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
    else if($arguments.length === 2 && typeof $arguments[0] === 'object') {
      $sourceName = null; $source = $arguments.shift(); $target = $arguments.shift()
    }
    else if($arguments.length === 3 && typeof $arguments[0] === 'string') {
      $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = $arguments.shift()
    }
    return { $sourceName, $source, $target }
  }
  validate() {
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
  validateProperty() {
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
  }
}