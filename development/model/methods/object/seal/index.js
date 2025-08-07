import { ModelEvent } from '../../../events/index.js'
export default function seal($model, $options) {
  const { recursive, mutatorEvents } = $options
  const { receiver } = $model
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(receiver)) {
      if($propertyValue instanceof $model.constructor) {
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
  Object.seal(receiver)
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