import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral } = Coutil
import Model from '../../../index.js'
import Change from '../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function defineProperty($model, $options, $propertyKey, $propertyDescriptor) {
  const options = Object.assign({}, $options)
  options.assignArray = 'defineProperties'
  options.assignObject = 'defineProperties'
  const {
    assignArray, assignObject, descriptorTree, enableValidation, mutatorEvents, validationEvents
  } = options
  const { target, path, schema } = $model
  const propertyValue = $propertyDescriptor.value
  const targetPropertyDescriptor = Object.getOwnPropertyDescriptor(target, $propertyKey) || {}
  const targetPropertyValue = targetPropertyDescriptor.value
  const definePropertyChange = new Change({ preter: targetPropertyValue })
  const definePropertyKeyChange = new Change({ preter: targetPropertyValue })
  const targetPropertyValueIsModelInstance = (targetPropertyValue instanceof Model) ? true : false
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
        targetPropertyValue.defineProperties($propertyDescriptor)
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
      let subtarget = typedObjectLiteral(propertyValue)
      const submodel = new $model.constructor(
        subtarget, subschema, recursiveAssign({}, options, {
          path: modelPath,
          parent: $model,
        })
      )
      if(descriptorTree === true) {
        target[$propertyKey] = submodel
        $model.retroReenableEvents()
        if(submodel.type === 'array') { submodel[assignArray](propertyValue) }
        else if(submodel.type === 'object') { submodel[assignObject](propertyValue) }
      }
      else if(descriptorTree === false) {
        Object.defineProperty(target, $propertyKey, $propertyDescriptor)
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