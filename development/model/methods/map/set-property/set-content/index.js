import { ModelEvent, ValidatorEvent } from '../../../../events/index.js'
import Change from '../../../../change/index.js'
export default function setContent($model, $options, $properties) {
  const { path, schema } = $model
  let { enableValidation, mutatorEvents, required, validationEvents  } = $options
  iterateProperties: 
  for(const [$propertyKey, $propertyValue] of Object.entries($properties)) {
    $model.set($propertyKey, $propertyValue, Object.assign($options, {
      source: $properties,
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