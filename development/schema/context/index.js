import { Coutil } from 'core-plex'
const { typedObjectLiteral, typeOf, variables } = Coutil
import Schema from '../index.js'
import {
  RequiredValidator, TypeValidator, RangeValidator, 
  LengthValidator, EnumValidator, MatchValidator
} from '../validators/index.js'
class Context extends EventTarget {
  constructor($properties, $schema) {
    super()
    Object.defineProperties(this, {
      'required': { value: $schema.options.required },
      'schema': { value: $schema },
      'type': { value: typeOf($properties) },
      'proxy': { configurable: true, get () {
        const proxy = new Proxy(this.target, this)
        Object.defineProperty(this, 'proxy', { value: proxy })
        return proxy
      } },
      'target': { configurable: true, get() {
        let properties
        const type = this.type
        if(type === 'array') { properties = $properties.slice(0, 1) }
        else if(type === 'object') { properties = $properties }
        const target = parseProperties(properties, this.schema)
        Object.defineProperty(this, 'target', { value: target })
        return target
      } },
    })
    return this.proxy
  }
}
function parseProperties($properties, $schema) {
  const properties = typedObjectLiteral($properties)
  iterateProperties: 
  for(const [
    $propertyKey, $propertyValue
  ] of Object.entries($properties)) {
    let propertyDefinition = {}
    const typeOfPropertyValue = typeOf($propertyValue)
    const isPropertyDefinition = _isPropertyDefinition($propertyValue, $schema)
    if(variables.TypeValues.includes($propertyValue)) {
      Object.assign(propertyDefinition, { type:  { value: $propertyValue } })
    }
    else if(variables.TypeKeys.includes($propertyValue)) {
      Object.assign(propertyDefinition, { type: { value: variables.Types[$propertyValue] } })
    }
    else if(!isPropertyDefinition) {
      const subpropertyPath = ($schema.path) ? [$schema.path, $propertyKey].join('.') : $propertyKey
      propertyDefinition = new Schema($propertyValue, Object.assign({}, $schema.options, {
        parent: $schema,
        path: subpropertyPath
      }))
      Object.assign(properties, { [$propertyKey]: propertyDefinition })
      continue iterateProperties
    }
    else if(isPropertyDefinition) {
      for(const [$propertyValidatorName, $propertyValidator] of Object.entries($propertyValue)) {
        const isValidatorDefinition = _isValidatorDefinition($propertyValidator, $schema)
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
    const contextRequired = $schema.options.required
    if(contextRequired === true) { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: true, validator: RequiredValidator 
    })) }
    else if(propertyDefinition.required) { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: true, validator: RequiredValidator  }))
    }
    else { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: false, validator: RequiredValidator  }))
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
      propertyDefinition.validators.push(new ValidatorClass($validatorSettings, $schema))
    }
  }
  return properties
}
function _isPropertyDefinition($object, $schema) {
  const typeKey = $schema.options.context.properties.type
  return ($object) ? Object.hasOwn($object, typeKey) : false
}
function _isValidatorDefinition($object, $schema) {
  const valueKey = $schema.options.context.properties.value
  return Object.hasOwn($object, valueKey)
}
export default Context