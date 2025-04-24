import { ModelEvent, ValidatorEvent } from '../../../../events/index.js'
import Change from '../../../../change/index.js'
export default function setContent($model, $options, $properties) {
  const { path, schema } = $model
  let { enableValidation, mutatorEvents, required, validationEvents  } = $options
  let validation
  if(enableValidation && schema) {
    validation = schema.validate($properties, $model.valueOf())
  }
  iterateProperties: 
  for(const [$propertyKey, $propertyValue] of Object.entries($properties)) {
    $model.set($propertyKey, $propertyValue, Object.assign($options, {
      validation,
      source: $properties,
    }))
  }
  if(enableValidation && schema) {
    if(validationEvents) {
      let type, propertyType
      const validatorPath = path
      if(validation.valid) { type = 'valid' }
      else { type = 'nonvalid' }
      $model.dispatchEvent(new ValidatorEvent(type, validation, $model))
    }
    if(!validation.valid) { return }
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