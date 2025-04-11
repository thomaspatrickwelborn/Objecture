import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral } = Coutil
import Model from '../../../index.js'
import Change from '../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function defineProperty($model, $options, $propertyKey, $propertyDescriptor) {
  const options = Object.assign({}, $options)
  options.assignObject = 'defineProperties'
  const { assignArray, assignObject, descriptorTree, enableValidation, mutatorEvents, validationEvents } = options
  const { target, path, schema } = $model
  const propertyValue = $propertyDescriptor.value
  const targetPropertyDescriptor = Object.getOwnPropertyDescriptor(target, $propertyKey) || {}
  const targetPropertyValue = targetPropertyDescriptor.value
  const definePropertyChange = new Change({ preter: targetPropertyValue })
  const definePropertyKeyChange = new Change({ preter: targetPropertyValue })
  const targetPropertyValueIsModelInstance = (
    targetPropertyValue instanceof Model
  ) ? true : false
  if(schema && enableValidation) {
    const validProperty = schema.validateProperty($propertyKey, propertyValue, $model)
    if(validationEvents) {
      let type, propertyType
      const validatorPath = (path)
        ? [path, $propertyKey].join('.')
        : String($propertyKey)
      if(validProperty.valid) {
        type = 'validProperty'
        propertyType = ['validProperty', $propertyKey].join(':')
      }
      else {
        type = 'nonvalidProperty'
        propertyType = ['nonvalidProperty', $propertyKey].join(':')
      }
      for(const $eventType of [type, propertyType]) {
        $model.dispatchEvent(new ValidatorEvent($eventType, validProperty, $model))
      }
    }
    if(!validProperty.valid) { return $model }
  }
  if(propertyValue && typeof propertyValue === 'object') {
    const modelPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey)
    if(targetPropertyValueIsModelInstance) {
      if(descriptorTree === true) {
        targetPropertyValue.defineProperties(propertyValue)
      }
      else {
        Object.defineProperty(target, $propertyKey, $propertyDescriptor)
      }
    }
    else {
      let subschema
      if(schema) {
        if(schema.type === 'array') { subschema = schema.context[0] }
        else if(schema.type === 'object') { subschema = schema.context[$propertyKey] }
        else { subschema = undefined}
      }
      let _target = typedObjectLiteral(propertyValue)
      const modelObject = new $model.constructor(
        _target, subschema, recursiveAssign({}, $model.options, {
          path: modelPath,
          parent: $model,
        })
      )
      if(descriptorTree === true) {
        target[$propertyKey] = modelObject
        $model.retroReenableEvents()
        if(propertyValue.type === 'array') { modelObject[assignArray](...$value) }
        else if(propertyValue.type === 'object') { modelObject[assignObject]($value) }
      }
      else if(descriptorTree === false) {
        Object.defineProperty(target, $propertyKey, $propertyDescriptor)
        $model.retroReenableEvents()
      }
    }
  }
  else {
    Object.defineProperty(target, $propertyKey, $propertyDescriptor)
  }
  if(mutatorEvents) {
    const modelEventPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey)
    if(mutatorEvents['defineProperty:$key']) {
      definePropertyKeyChange.anter = target[$propertyKey]
      const type = ['defineProperty', $propertyKey].join(':')
      $model.dispatchEvent(
        new ModelEvent(type, {
          path: modelEventPath,
          value: propertyValue,
          change: definePropertyKeyChange,
          detail: {
            prop: $propertyKey,
            descriptor: $propertyDescriptor,
          },
        }, $model
      ))
    }
    if(mutatorEvents['defineProperty']) {
      definePropertyChange.anter = target[$propertyKey]
      $model.dispatchEvent(
        new ModelEvent('defineProperty', {
          path: modelEventPath,
          value: propertyValue,
          change: definePropertyChange,
          detail: {
            prop: $propertyKey,
            descriptor: $propertyDescriptor,
          },
        }, $model
      ))
    }
  }
  return $model
}