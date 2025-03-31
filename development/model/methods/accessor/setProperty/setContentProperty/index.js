import { Coutil } from 'core-plex'
const { recursiveAssign, regularExpressions} = Coutil
import Model from '../../../../index.js'
import Change from '../../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../../events/index.js'
export default function setModelProperty($model, $options, $path, $value) {
  const { target, path, schema } = $model
  const { enableValidation, validationEvents, events, pathkey, subpathError, recursive, source } = $options
  // Path Key: true
  if(pathkey === true) {
    // Subpaths
    const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape))
    // Property Key
    const propertyKey = subpaths.shift()
    // Property Value
    let propertyValue
    const modelPath = (path)
      ? [path, propertyKey].join('.')
      : String(propertyKey)
    // Return: Subproperty
    if(subpaths.length) {
      if(recursive && target[propertyKey] === undefined) {
        // Subschema
        let subschema
        if(schema?.type === 'array') { subschema = schema.context[0] }
        else if(schema?.type === 'object') { subschema = schema.context[propertyKey] }
        else { subschema = undefined }
        // Submodel
        let submodel
        if(subschema?.type === 'array') { submodel = [] }
        else if(subschema?.type === 'object') { submodel = {} }
        else {
          if(Number(propertyKey)) { submodel = [] }
          else { submodel = {} }
        }
        propertyValue = new Model(submodel, subschema, recursiveAssign({}, $options, {
          path: modelPath,
          parent: $model,
        }))
      }
      else {
        propertyValue = target[propertyKey]
      }
      // Subpath Error
      if(subpathError === false && propertyValue === undefined) { return undefined }
      propertyValue.set(subpaths.join('.'), $value, $options)
      return propertyValue
    }
    // Validation
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
    // Return: Property
    // Value: Object Literal
    if(typeof $value === 'object') {
      // Value: Model
      if($value instanceof Model) { $value = $value.valueOf() }
      let subschema
      let submodel
      if(schema?.type === 'array') {
        subschema = schema.context[0]
        submodel = []
      }
      else if(schema?.type === 'object') {
        subschema = schema.context[propertyKey]
        submodel = {}
      }
      else { subschema = undefined }
      propertyValue = new Model(submodel, subschema, recursiveAssign(
        {}, $options, {
          path: modelPath,
          parent: $model,
        }
      ))
      target[propertyKey] = propertyValue
      $model.retroReenableEvents()
      propertyValue.set($value)
    }
    // Value: Primitive Literal
    else {
      propertyValue = $value
      target[propertyKey] = propertyValue
    }
    // Root Assignment
    // Set Property Event
    if(events) {
      const modelEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey)
      if(events['setProperty']) {
        $model.dispatchEvent(
          new ModelEvent('setProperty', {
            path: modelEventPath, 
            value: propertyValue,
            // change,
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
            // change,
            detail: {
              value: propertyValue,
            }
          }, $model)
        )
      }
    }
    // Return Property Value
    return propertyValue
  }
  // Path Key: false
  else if(pathkey === false) {
    let propertyKey = $path
    // Property Value: Object
    if(typeof $value === 'object') {
      if($value instanceof Model) { $value = $value.valueOf() }
      let subschema
      let submodel
      if(schema?.type === 'array') {
        subschema = schema.context[0]
        submodel = []
      }
      if(schema?.type === 'object') {
        subschema = schema.context[propertyKey]
        submodel = {}
      }
      else { subschema = undefined }
      const modelPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey)
      propertyValue = new Model(submodel, subschema, recursiveAssign(
        {}, $options, {
          path: modelPath,
          parent: $model,
        }
      ))
      target[propertyKey] = propertyValue
      propertyValue.set($value)
    }
    // Property Value: Primitive Literal
    else {
      propertyValue = $value
      target[propertyKey] = propertyValue
    }
    // Root Assignment
    // Set Property Event
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
    // Return Property Value
    return propertyValue
  }
}