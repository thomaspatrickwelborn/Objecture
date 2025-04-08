import { ModelEvent } from '../../../../events/index.js'
import Model from '../../../../index.js'
import Change from '../../../../change/index.js'
export default function setContent($model, $options, $properties) {
  iterateProperties: 
  for(const [$propertyKey, $propertyValue] of Object.entries($properties)) {
    $model.set($propertyKey, $propertyValue, $options)
  }
  // Set Property Event
  const { path } = $model
  const { mutator } = $options
  if(mutator && mutator['set']) {
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