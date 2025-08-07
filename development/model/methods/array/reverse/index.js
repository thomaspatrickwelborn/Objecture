import { ModelEvent } from '../../../events/index.js'
export default function reverse($model, $options) {
  const { mutatorEvents } = $options
  const { receiver, path } = $model
  Array.prototype.reverse.call(receiver, ...arguments)
  $model.retroReenableEvents()
  if(mutatorEvents && mutatorEvents['reverse']) {
    $model.dispatchEvent(
      new ModelEvent(
        'reverse',
        {
          path,
          detail: {
            reference: receiver
          },
        },
        $model
      )
    )
  }
  return $model
}