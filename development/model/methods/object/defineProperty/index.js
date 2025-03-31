import { Coutil } from 'core-plex'
const { typedObjectLiteral } = Coutil
import Model from '../../../index.js'
import Change from '../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function defineProperty($model, $options, $propertyKey, $propertyDescriptor) {
  const { descriptorTree, events } = $options
  const { target, path, schema } = $model
  const { enableValidation, validationEvents } = $options
  const propertyValue = $propertyDescriptor.value
  const targetPropertyDescriptor = Object.getOwnPropertyDescriptor(target, $propertyKey) || {}
  const targetPropertyValue = targetPropertyDescriptor.value
  const definePropertyChange = new Change({ preter: targetPropertyValue })
  const definePropertyKeyChange = new Change({ preter: targetPropertyValue })
  const targetPropertyValueIsModelInstance = (
    targetPropertyValue instanceof Model
  ) ? true : false
  // Validation
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
        // $model.enableEvents({ enable: true })
        $model.dispatchEvent(new ValidatorEvent($eventType, validProperty, $model))
      }
    }
    if(!validProperty.valid) { return $model }
  }
  // Property Descriptor Value: Object Type
  if(typeof propertyValue === 'object') {
    // Subschema
    let subschema
    if(schema.type === 'array') { subschema = schema.context[0] }
    else if(schema.type === 'object') { subschema = schema.context[$propertyKey] }
    else { subschema = undefined}
    // Root Property Descriptor Value: Existent Model Instance
    const modelPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey)
    if(targetPropertyValueIsModelInstance) {
      // Descriptor Tree: true
      if(descriptorTree === true) {
        // propertyValue = Object.assign(propertyValue, { path: modelPath, parent: $model })
        targetPropertyValue.defineProperties(propertyValue)
      }
      // Descriptor Tree: false
      else {
        Object.defineProperty(target, $propertyKey, $propertyDescriptor)
      }
    }
    // Root Property Descriptor Value: New Model Instance
    else {
      let _target = typedObjectLiteral(propertyValue)
      const modelObject = new Model(
        _target, subschema, {
          path: modelPath,
          parent: $model,
        }
      )
      modelObject.retroReenableEvents()
      // Root Define Properties, Descriptor Tree
      if(descriptorTree === true) {
        modelObject.defineProperties(propertyValue)
        target[$propertyKey] = modelObject
      } else 
      // Root Define Properties, No Descriptor Tree
      if(descriptorTree === false) {
        Object.defineProperty(target, $propertyKey, $propertyDescriptor)
      }
    }
  }
  // Property Descriptor Value: Primitive Type
  else {
    Object.defineProperty(target, $propertyKey, $propertyDescriptor)
  }
  // $model.enableEvents({ enable: true })
  // Define Property Event
  if(events) {
    const modelEventPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey)
    if(events['defineProperty:$key']) {
      definePropertyKeyChange.anter = target[$sourceKey]
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
    if(events['defineProperty']) {
      definePropertyChange.anter = target[$sourceKey]
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