import { ModelEvent, ValidatorEvent } from '../../../../events/index.js'
import Change from '../../../../change/index.js'
export default function setContent($model, $options, $properties) {
  const { path, schema } = $model
  const { enableValidation, mutatorEvents, required, validationEvents  } = $options
  if(required && schema && enableValidation) {
    let validObject = schema.validate($properties, $model.valueOf())
    if(validationEvents) {
      let type, propertyType
      const validatorPath = path
      if(validObject.valid) { type = 'valid' }
      else { type = 'nonvalid' }
      $model.dispatchEvent(new ValidatorEvent(type, validObject, $model))
    }
    if(!validObject.valid) { return }
  }
  iterateProperties: 
  for(const [$propertyKey, $propertyValue] of Object.entries($properties)) {
    $model.set($propertyKey, $propertyValue, Object.assign($options, {
      source: $properties
    }))
  }
  if(mutatorEvents && mutatorEvents['set']) {
    $model.dispatchEvent(
      new ModelEvent('set', {
        path,
        value: $model.valueOf(),
        detail: {
          value: $model.valueOf()
        }
      }, $model)
    )
  }
  return $model
}