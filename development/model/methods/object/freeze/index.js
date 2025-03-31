import Model from '../../../index.js'
import { ModelEvent } from '../../../events/index.js'
export default function freeze($model, $options) {
  const { recursive, events } = $options
  const { target } = $model
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Model) {
        $propertyValue.freeze()
        if(events && events['freezeProperty']) {
          $model.dispatchEvent(
            new ModelEvent(
              'freezeProperty',
              { path: $propertyValue.path },
              $model
            )
          )
        }
      }
    }
  }
  Object.freeze(target)
  if(events && events['freeze']) {
    $model.dispatchEvent(
      new ModelEvent(
        'freeze',
        { path: $model.path },
        $model
      )
    )
  }
  return $model
}