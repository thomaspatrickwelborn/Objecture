import { Coutil } from 'core-plex'
const {
  expandTree, typedObjectLiteral, typeOf, variables
} = Coutil
import Schema from '../index.js'
import {
  RequiredValidator, TypeValidator, RangeValidator, 
  LengthValidator, EnumValidator, MatchValidator
} from '../validators/index.js'
export default class Context extends EventTarget {
  #properties
  #schema
  #type
  #proxy
  #target
  constructor($properties, $schema) {
    super()
    this.#properties = $properties
    this.schema = $schema
    return this.proxy
  }
  get required() { return this.schema.options.required }
  get schema() { return this.#schema }
  set schema($schema) {
    if(this.#schema !== undefined) return
    this.#schema = $schema
    return this.#schema
  }
  get type() {
    if(this.#type !== undefined) return this.#type
    this.#type = typeOf(this.#properties)
    return this.#type
  }
  get proxy() {
    if(this.#proxy !== undefined) return this.#proxy
    this.#proxy = new Proxy(this.target, this)
    return this.#proxy
  }
  get target() {
    if(this.#target !== undefined) return this.#target
    let properties
    const target = typedObjectLiteral(this.type)
    if(this.type === 'array') {
      properties = this.#properties.slice(0, 1)
    }
    else if(this.type === 'object') {
      properties = this.#properties
    }
    this.#target = this.parseProperties(properties)
    return this.#target
  }
  isPropertyDefinition($object) {
    const typeKey = this.schema.options.context.properties.type
    return ($object) ? Object.hasOwn($object, typeKey) : false
  }
  isValidatorDefinition($object) {
    const valueKey = this.schema.options.context.properties.value
    return Object.hasOwn($object, valueKey)
  }
  parseProperties($properties) {
    const properties = typedObjectLiteral($properties)
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries($properties)) {
      let propertyDefinition = {}
      const typeOfPropertyValue = typeOf($propertyValue)
      const isPropertyDefinition = this.isPropertyDefinition($propertyValue)
      if(variables.TypeValues.includes($propertyValue)) {
        Object.assign(propertyDefinition, { type:  { value: $propertyValue } })
      }
      else if(variables.TypeKeys.includes($propertyValue)) {
        Object.assign(propertyDefinition, { type: { value: variables.Types[$propertyValue] } })
      }
      else if(!isPropertyDefinition) {
        propertyDefinition = new Schema($propertyValue, this.schema.options)
        Object.assign(properties, { [$propertyKey]: propertyDefinition })
        continue iterateProperties
      }
      else if(isPropertyDefinition) {
        for(const [$propertyValidatorName, $propertyValidator] of Object.entries($propertyValue)) {
          const isValidatorDefinition = this.isValidatorDefinition($propertyValidator)
          if(!isValidatorDefinition) {
            Object.assign(propertyDefinition, { [$propertyValidatorName]: { value: $propertyValidator } })
          }
          else if(isValidatorDefinition) {
            Object.assign(propertyDefinition, { [$propertyValidatorName]: $propertyValidator })
          }

        }
      }
      Object.assign(propertyDefinition, { validators: [] })
      Object.assign(properties, { [$propertyKey]: propertyDefinition })
      const validators = new Map()
      const contextRequired = this.required
      if(contextRequired === true) { validators.set('required', Object.assign({}, propertyDefinition.required, {
        type: 'required', value: true, validator: RequiredValidator 
      })) }
      else if(propertyDefinition.required) { validators.set('required', Object.assign({}, propertyDefinition.required, {
        type: 'required', value: true, validator: RequiredValidator  }))
      }
      if(propertyDefinition.type) { validators.set('type', Object.assign({}, propertyDefinition.type, {
        type: 'type', validator: TypeValidator
      })) }
      else { validators.set('type', Object.assign({}, propertyDefinition.type, {
        type: 'type', value: undefined, validator: TypeValidator
      })) }
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
        propertyDefinition.validators.push(new ValidatorClass($validatorSettings, this.schema))
      }
    }
    return properties
  }
}