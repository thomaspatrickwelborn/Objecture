import { ModelEvent } from '../../../events/index.js'
export default function reverse($model, $options) {
  const { mutatorEvents } = $options
  const { target, path } = $model
  Array.prototype.reverse.call(target, ...arguments)
  $model.retroReenableEvents()
  if(mutatorEvents && mutatorEvents['reverse']) {
    $model.dispatchEvent(
      new ModelEvent(
        'reverse',
        {
          path,
          detail: {
            reference: target
          },
        },
        $model
      )
    )
  }
  return $model
}