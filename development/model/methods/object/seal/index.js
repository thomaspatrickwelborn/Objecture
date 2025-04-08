import Model from '../../../index.js'
import { ModelEvent } from '../../../events/index.js'
export default function seal($model, $options) {
  const { recursive, mutatorEvents } = $options
  const { target } = $model
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Model) {
        $propertyValue.seal()
        if(mutatorEvents && mutatorEvents['sealProperty']) {
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
  if(mutatorEvents && mutatorEvents['seal']) {
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