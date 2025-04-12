import { ModelEvent } from '../../../events/index.js'
export default function freeze($model, $options) {
  const { recursive, mutatorEvents } = $options
  const { target } = $model
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof $model.constructor) {
        $propertyValue.freeze()
        if(mutatorEvents && mutatorEvents['freezeProperty']) {
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
  if(mutatorEvents && mutatorEvents['freeze']) {
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