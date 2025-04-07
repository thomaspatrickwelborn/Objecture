import { Coutil } from 'core-plex'
const { recursiveAssign, regularExpressions, typeOf } = Coutil
import Model from '../../../../index.js'
import Change from '../../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../../events/index.js'
export default function setContentProperty($model, $options, $path, $value) {
  const { target, path, schema } = $model
  const { enableValidation, validationEvents, events, pathkey, subpathError, recursive, source } = $options
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
        if(schema?.type === 'array') { subschema = schema.context[0] }
        else if(schema?.type === 'object') { subschema = schema.context[propertyKey] }
        else { subschema = undefined }
        let submodel
        if(typeOfPropertyValue === 'array') { submodel = [] }
        else if(typeOfPropertyValue === 'object') { submodel = {} }
        else {
          if(isNaN(Number(propertyKey))) { submodel = {} }
          else { submodel = [] }
        }
        propertyValue = new $model.constructor(submodel, subschema, recursiveAssign({}, $options, {
          path: modelPath,
          parent: $model,
        }))
      }
      else {
        propertyValue = target[propertyKey]
      }
      if(subpathError === false && propertyValue === undefined) { return undefined }
      propertyValue.set(subpaths.join('.'), $value, $options)
      return propertyValue
    }
    if(schema && enableValidation) {
      const validTargetProp = schema.validateProperty(propertyKey, $value, source, $model)
      if(validationEvents) {
        let type, propertyType
        const validatorEventPath = (path)
          ? [path, propertyKey].join('.')
          : String(propertyKey)
        if(validTargetProp.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', ':', propertyKey].join('')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', ':', propertyKey].join('')
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validTargetProp, $model))
        }
      }
      if(!validTargetProp.valid) { return }
    }
    if(typeof $value === 'object') {
      if($value instanceof Model) { $value = $value.valueOf() }
      const typeOfPropertyValue= typeOf($value)
      let subschema
      let submodel
      if(schema?.type === 'array') {
        subschema = schema.context[0]
      }
      else if(schema?.type === 'object') {
        subschema = schema.context[propertyKey]
      }
      else { subschema = undefined }
      if(typeOfPropertyValue === 'array') { submodel = [] }
      else if(typeOfPropertyValue === 'object') { submodel = {} }
      else {
        if(isNaN(Number(propertyKey))) { submodel = {} }
        else { submodel = [] }
      }
      propertyValue = new $model.constructor(submodel, subschema, recursiveAssign(
        {}, $options, {
          path: modelPath,
          parent: $model,
        }
      ))
      target[propertyKey] = propertyValue
      $model.retroReenableEvents()
      propertyValue.set($value)
    }
    else {
      propertyValue = $value
      target[propertyKey] = propertyValue
    }
    if(events) {
      const modelEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey)
      if(events['setProperty']) {
        $model.dispatchEvent(
          new ModelEvent('setProperty', {
            path: modelEventPath, 
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        )
      }
      if(events['setProperty:$key']) {
        const type = ['setProperty', ':', propertyKey].join('')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $model)
        )
      }
    }
    return propertyValue
  }
  else if(pathkey === false) {
    let propertyKey = $path
    if(typeof $value === 'object') {
      if($value instanceof Model) { $value = $value.valueOf() }
      const typeOfPropertyValue = typeOf($value)
      let subschema
      let submodel
      if(schema?.type === 'array') {
        subschema = schema.context[0]
      }
      if(schema?.type === 'object') {
        subschema = schema.context[propertyKey]
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
      propertyValue = new $model.constructor(submodel, subschema, recursiveAssign(
        {}, $options, {
          path: modelPath,
          parent: $model,
        }
      ))
      target[propertyKey] = propertyValue
      $model.retroReenableEvents()
      propertyValue.set($value)
    }
    else {
      propertyValue = $value
      target[propertyKey] = propertyValue
    }
    if(events) {
      const modelEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey)
      if(events['setProperty']) {
        $model.dispatchEvent(
          new ModelEvent('setProperty', {
            path: modelEventPath, 
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        )
      }
      if(events['setProperty:$key']) {
        const type = ['setProperty', ':', propertyKey].join('')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $model)
        )
      }
    }
    return propertyValue
  }
}