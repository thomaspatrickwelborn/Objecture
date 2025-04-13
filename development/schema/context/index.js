import { Coutil } from 'core-plex'
const {
  expandTree, isPropertyDefinition, typedObjectLiteral, typeOf, variables
} = Coutil
import {
  RequiredValidator, TypeValidator, RangeValidator, LengthValidator, EnumValidator, MatchValidator
} from '../validators/index.js'
import Schema from '../index.js'
import Handler from './handler/index.js'
export default class Context extends EventTarget {
  #properties
  #schema
  #type
  #proxy
  #target
  #_handler
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
    this.#type = typeOf(typedObjectLiteral(this.#properties))
    return this.#type
  }
  get proxy() {
    if(this.#proxy !== undefined) return this.#proxy
    this.#proxy = new Proxy(this.target, this.#handler)
    return this.#proxy
  }
  get #handler() {
    if(this.#_handler !== undefined) return this.#_handler
    this.#_handler = new Handler(this)
    return this.#_handler
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
    iterateProperties: 
    for(const [
      $propertyKey, $propertyDefinition
    ] of Object.entries(properties)) {
      const typeOfPropertyDefinition = typeOf($propertyDefinition)
      let propertyDefinition
      // Property Definition: Schema
      if($propertyDefinition instanceof Schema) {
        propertyDefinition = $propertyDefinition
      }
      // Property Definition: String, Number, Boolean, Object, Array, null, undefined
      else if(variables.TypeValues.includes($propertyDefinition)) {
        propertyDefinition = expandTree($propertyDefinition, 'type.value')
      }
      // Property Definition: 'string', 'number', 'bigint', 'boolean', 'object', 'array', 'null', 'undefined'
      else if(variables.TypeKeys.includes($propertyDefinition)) {
        propertyDefinition = expandTree(variables.TypeValues[
          variables.TypeKeys.indexOf($propertyDefinition)
        ], 'type.value')
      }
      // Property Definition: Object Literal
      else if(['array', 'object'].includes(typeOfPropertyDefinition)) {
        let propertyDefinitionIsPropertyDefinition = isPropertyDefinition($propertyDefinition)
        if(propertyDefinitionIsPropertyDefinition === false) {
          const { path } = this.schema
          const schemaPath = (path)
            ? [path, $propertyKey].join('.')
            : String($propertyKey)
          const parent = this.schema
          propertyDefinition = new Schema($propertyDefinition, Object.assign({}, this.schema.options, {
            path: schemaPath,
            parent: parent,
          }))
        }
        else if(propertyDefinitionIsPropertyDefinition === true) {
          propertyDefinition = { validators: [] }
          // Property Definition: 
          iteratePropertyValidators: 
          for(const [
            $propertyValidatorName, $propertyValidator
          ] of Object.entries($propertyDefinition)) {
            if($propertyValidatorName === 'validators') { continue iteratePropertyValidators }
            const typeOfPropertyValidator = typeOf($propertyValidator)
            let propertyValidator
            if(typeOfPropertyValidator === 'object') {
              propertyValidator = $propertyValidator
            }
            else {
              propertyValidator = {
                value: $propertyValidator
              }
            }
            propertyDefinition[$propertyValidatorName] = propertyValidator
          }
          $propertyDefinition.validators = $propertyDefinition.validators || []
          iterateAlterPropertyValidators: 
          for(const $propertyDefinitionValidator of $propertyDefinition.validators) {
            for(const $Validator of [
              RequiredValidator, TypeValidator, RangeValidator, LengthValidator, EnumValidator, MatchValidator
            ]) {
              if($propertyDefinitionValidator instanceof $Validator === false) {
                propertyDefinition.validators.push($propertyDefinitionValidator)
              }
            }
          }
        }
      }
      if(propertyDefinition instanceof Schema === false) {
        propertyDefinition = this.#parsePropertyDefinition(propertyDefinition)
      }
      target[$propertyKey] = propertyDefinition
    }
    this.#target = target
    return this.#target
  }
  #parsePropertyDefinition($propertyDefinition) {
    const propertyDefinition = $propertyDefinition
    propertyDefinition.validators = []
    const validators = new Map()
    const contextRequired = this.required
    const {
      required,
      type,
      range, min, max, 
      length, minLength, maxLength, 
      match,
    } = propertyDefinition
    // Required
    if(contextRequired === true) { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: true, validator: RequiredValidator 
    })) }
    else if(required?.value === true) { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: true, validator: RequiredValidator  }))
    }
    else { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: false, validator: RequiredValidator 
    })) }
    // Type
    if(type) { validators.set('type', Object.assign({}, type, {
      type: 'type', validator: TypeValidator
    })) }
    else { validators.set('type', Object.assign({}, type, {
      type: 'type', value: undefined, validator: TypeValidator
    })) }
    // Range
    if(range) { validators.set('range', Object.assign({}, range, {
      type: 'range', validator: RangeValidator
    })) }
    else if(min || max) { validators.set('range', Object.assign({}, {
      type: 'range', min, max, validator: RangeValidator
    })) }
    // Length
    if(length) { validators.set('length', Object.assign({}, length, {
      type: 'length', validator: LengthValidator
    })) }
    else if(minLength || maxLength) { validators.set('length', Object.assign({}, {
      type: 'length', min: minLength, max: maxLength, validator: LengthValidator
    })) }
    // Enum
    if(propertyDefinition.enum) { validators.set('enum', Object.assign({}, propertyDefinition.enum, {
      type: 'enum', validator: EnumValidator
    })) }
    // Match
    if(match) { validators.set('match', Object.assign({}, match, {
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
    return propertyDefinition
  }
}
