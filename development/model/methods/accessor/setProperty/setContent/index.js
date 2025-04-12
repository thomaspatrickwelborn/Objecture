import { ModelEvent } from '../../../../events/index.js'
import Change from '../../../../change/index.js'
export default function setContent($model, $options, $properties) {
  iterateProperties: 
  for(const [$propertyKey, $propertyValue] of Object.entries($properties)) {
    $model.set($propertyKey, $propertyValue, $options)
  }
  const { path } = $model
  const { mutatorEvents  } = $options
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