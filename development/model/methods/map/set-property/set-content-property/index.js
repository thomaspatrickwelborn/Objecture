import { assign, regularExpressions, typedObjectLiteral, typeOf } from 'recourse'
import Change from '../../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../../events/index.js'
export default function setContentProperty($model, $options, $path, $value) {
  const options = Object.assign({}, $options)
  const assignObject = 'set'
  const assignArray = options.assignArray || 'set'
  const { target, path, schema } = $model
  const {
    enableValidation, mutatorEvents, pathkey, 
    recursive, subpathError, 
    validationEvents, source, 
  } = options
  if(pathkey === true) {
    const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape))
    const propertyKey = subpaths.shift()
    let propertyValue
    const typeOfPropertyValue = typeOf($value)
    const modelPath = (path)
      ? [path, propertyKey].join('.')
      : String(propertyKey)
    if(subpaths.length) {
      if(recursive && target[propertyKey] === undefined) {
        let subschema
        if(schema?.type === 'array') { subschema = schema.target[0].type.value }
        else if(schema?.type === 'object') { subschema = schema.target[propertyKey].type.value }
        else { subschema = undefined }
        let submodel
        if(typeOfPropertyValue === 'array') { submodel = [] }
        else if(typeOfPropertyValue === 'object') { submodel = {} }
        else {
          if(isNaN(Number(propertyKey))) { submodel = {} }
          else { submodel = [] }
        }
        const submodelOptions = assign({}, options, {
          path: modelPath,
          parent: $model,
        })
        propertyValue = new $model.constructor(submodel, subschema, submodelOptions)
      }
      else {
        propertyValue = target[propertyKey]
      }
      if(subpathError === false && propertyValue === undefined) { return undefined }
      if(propertyValue.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { propertyValue[assignArray](...$value) }
        else { propertyValue[assignArray]($value) }
      }
      else if(propertyValue.type === 'object') { propertyValue[assignObject](subpaths.join('.'), $value, options) }
      return propertyValue
    }
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf()
      const validatorSource = source || typedObjectLiteral(validatorTarget)
      const validTargetProp = schema.validateProperty(propertyKey, $value, validatorSource, validatorTarget)
      if(validationEvents) {
        let type, propertyType
        if(validTargetProp.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', propertyKey].join(':')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', propertyKey].join(':')
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validTargetProp, $model))
        }
      }
      if(!validTargetProp.valid) { return }
    }
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf() }
      const typeOfPropertyValue= typeOf($value)
      let subschema
      let submodel
      if(schema?.type === 'array') { subschema = schema.target[0].type.value }
      else if(schema?.type === 'object') { subschema = schema.target[propertyKey].type.value }
      else { subschema = undefined }
      if(typeOfPropertyValue === 'array') { submodel = [] }
      else if(typeOfPropertyValue === 'object') { submodel = {} }
      else {
        if(isNaN(Number(propertyKey))) { submodel = {} }
        else { submodel = [] }
      }
      const submodelOptions = assign({}, options, {
        path: modelPath,
        parent: $model,
      })
      propertyValue = new $model.constructor(submodel, subschema, submodelOptions)
      target[propertyKey] = propertyValue
      $model.retroReenableEvents()
      if(propertyValue.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { propertyValue[assignArray](...$value) }
        else { propertyValue[assignArray]($value) }
      }
      else if(propertyValue.type === 'object') { propertyValue[assignObject]($value) }
    }
    else {
      propertyValue = $value
      target[propertyKey] = propertyValue
    }
    // const _propertyValue = (propertyValue === null) ? null : propertyValue.valueOf()
    const _propertyValue = propertyValue.valueOf()
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey)
      if(mutatorEvents['setProperty']) {
        $model.dispatchEvent(
          new ModelEvent('setProperty', {
            path: modelEventPath, 
            value: _propertyValue,
            detail: {
              key: propertyKey,
              value: _propertyValue,
            }
          }, $model)
        )
      }
      if(mutatorEvents['setProperty:$key']) {
        const type = ['setProperty', propertyKey].join(':')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            value: _propertyValue,
            detail: {
              value: _propertyValue,
            }
          }, $model)
        )
      }
    }
    return propertyValue
  }
  else if(pathkey === false) {
    let propertyKey = $path
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf() }
      const typeOfPropertyValue = typeOf($value)
      let subschema
      let submodel
      if(schema?.type === 'array') {
        subschema = schema.target[0].type.value
      }
      if(schema?.type === 'object') {
        subschema = schema.target[propertyKey].type.value
      }
      else { subschema = undefined }
      if(typeOfPropertyValue === 'array') { submodel = [] }
      else if(typeOfPropertyValue === 'object') { submodel = {} }
      else {
        if(isNaN(Number(propertyKey))) { submodel = {} }
        else { submodel = [] }
      }
      const modelPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey)
      const submodelOptions = assign({}, options, {
        path: modelPath,
        parent: $model,
      })
      propertyValue = new $model.constructor(submodel, subschema, submodelOptions)
      target[propertyKey] = propertyValue
      $model.retroReenableEvents()
      if(propertyValue.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { propertyValue[assignArray](...$value) }
        else { propertyValue[assignArray]($value) }
      }
      else if(propertyValue.type === 'object') { propertyValue[assignObject]($value) }
    }
    else {
      propertyValue = $value
      target[propertyKey] = propertyValue
    }
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey)
      if(mutatorEvents['setProperty']) {
        $model.dispatchEvent(
          new ModelEvent('setProperty', {
            path: modelEventPath, 
            value: _propertyValue,
            detail: {
              key: propertyKey,
              value: _propertyValue,
            },
          }, $model)
        )
      }
      if(mutatorEvents['setProperty:$key']) {
        const type = ['setProperty', propertyKey].join(':')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            value: _propertyValue,
            detail: {
              value: _propertyValue,
            }
          }, $model)
        )
      }
    }
    return propertyValue
  }
}