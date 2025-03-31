import Model from '../../../index.js'
import { ModelEvent } from '../../../events/index.js'
export default function seal($model, $options) {
  const { recursive, events } = $options
  const { target } = $model
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Model) {
        $propertyValue.seal()
        if(events && events['sealProperty']) {
          $model.dispatchEvent(
            new ModelEvent(
              'sealProperty',
              { path: $propertyValue.path },
              $model
            )
          )
        }
      }
    }
  }
  Object.seal(target)
  if(events && events['seal']) {
    $model.dispatchEvent(
      new ModelEvent(
        'seal',
        { path: $model.path },
        $model
      )
    )
  }
  return $model
}