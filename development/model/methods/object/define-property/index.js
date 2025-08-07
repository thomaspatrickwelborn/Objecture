import { impand, assign, typedObjectLiteral } from 'recourse'
import Change from '../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function defineProperty($model, $options, $propertyKey, $propertyDescriptor) {
  const options = Object.assign({}, $options)
  const assignObject = 'defineProperties'
  const assignArray = options.assignArray || 'defineProperties'
  const {
    descriptorTree, enableValidation, mutatorEvents, 
    validation, validationEvents, validationReport
  } = options
  const { receiver, path, schema } = $model
  const propertyValue = $propertyDescriptor.value
  const receiverPropertyDescriptor = Object.getOwnPropertyDescriptor(receiver, $propertyKey) || {}
  const receiverPropertyValue = receiverPropertyDescriptor.value
  const definePropertyChange = new Change({ preter: receiverPropertyValue })
  const definePropertyKeyChange = new Change({ preter: receiverPropertyValue })
  const receiverPropertyValueIsModelInstance = receiverPropertyValue instanceof $model.constructor
  if(schema && enableValidation) {
    const validProperty = schema.validateProperty(
      $propertyKey, 
      impand(propertyValue, 'value') || propertyValue,
      {},
      $model.valueOf()
    )
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
    if(receiverPropertyValueIsModelInstance) {
      if(descriptorTree === true) {
        receiverPropertyValue.defineProperties($propertyDescriptor)
      }
      else {
        Object.defineProperty(receiver, $propertyKey, $propertyDescriptor)
      }
    }
    else {
      let subschema
      if(schema) {
        if(schema.type === 'array') { subschema = schema.receiver[0].type.value }
        else if(schema.type === 'object') { subschema = schema.receiver[$propertyKey].type.value }
        else { subschema = undefined }
      }
      let subreceiver = typedObjectLiteral(propertyValue)
      const suboptions = assign({}, options, {
        path: modelPath,
        parent: $model,
      })
      const submodel = new $model.constructor(
        subreceiver, subschema, suboptions
      )
      if(descriptorTree === true) {
        receiver[$propertyKey] = submodel
        $model.retroReenableEvents()
        if(submodel.type === 'array') {
          if(['push', 'unshift'].includes(assignArray)) { submodel[assignArray](...propertyValue) }
          else { submodel[assignArray](propertyValue) }
        }
        else if(submodel.type === 'object') { submodel[assignObject](propertyValue) }
      }
      else if(descriptorTree === false) {
        Object.defineProperty(receiver, $propertyKey, $propertyDescriptor)
      }
    }
  }
  else {
    Object.defineProperty(receiver, $propertyKey, $propertyDescriptor)
  }
  if(mutatorEvents) {
    const modelEventPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey)
    if(mutatorEvents['defineProperty:$key']) {
      definePropertyKeyChange.anter = receiver[$propertyKey]
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
      definePropertyChange.anter = receiver[$propertyKey]
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