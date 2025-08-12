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
  if(isPropertyDefinition($properties, $schema)) { return $properties }
  iterateProperties: 
  for(const [
    $propertyKey, $propertyValue
  ] of Object.entries($properties)) {
    let propertyDefinition = {}
    const typeOfPropertyValue = typeOf($propertyValue)
    const propertyValueIsPropertyDefinition = isPropertyDefinition($propertyValue, $schema)
    if(variables.TypeValues.includes($propertyValue)) {
      Object.assign(propertyDefinition, { type: { value: $propertyValue } })
    }
    else if(variables.TypeKeys.includes($propertyValue)) {
      Object.assign(propertyDefinition, { type: { value: variables.Types[$propertyValue] } })
    }
    else if(!propertyValueIsPropertyDefinition) {
      const subpropertyPath = ($schema.path) ? [$schema.path, $propertyKey].join('.') : $propertyKey
      Object.assign(propertyDefinition, {
        type: { type: 'type', value: new $schema.constructor($propertyValue, Object.assign({}, $schema.options, {
          parent: $schema,
          path: subpropertyPath
        })) }
      })
    }
    else if(propertyValueIsPropertyDefinition) {
      for(const [$propertyValidatorName, $propertyValidator] of Object.entries($propertyValue)) {
        const propertyValidatorIsValidatorDefinition = isValidatorDefinition($propertyValidator, $schema)
        if(!propertyValidatorIsValidatorDefinition) {
          let propertyValidator
          if($propertyValidatorName === 'type') {
            if($propertyValidator && typeof $propertyValidator === 'object') {
              const subpropertyPath = ($schema.path) ? [$schema.path, $propertyKey].join('.') : $propertyKey
              propertyValidator = new $schema.constructor($propertyValidator, Object.assign({}, $schema.options, {
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
        else if(propertyValidatorIsValidatorDefinition) {
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
function isPropertyDefinition($object, $schema) {
  if(!$object || $object instanceof Schema) { return false }
  const typeKey = $schema.options.properties.type
  return Object.hasOwn($object, typeKey)
}
function isValidatorDefinition($object, $schema) {
  if(!$object) { return false }
  const valueKey = $schema.options.properties.value
  return Object.hasOwn($object, valueKey)
}

export {
  parseValidateArguments,
  parseValidatePropertyArguments,
  parseProperties,
}