import { ModelEvent } from '../../../events/index.js'
export default function reverse($model, $options) {
  const { events } = $options
  const { target, path } = $model
  Array.prototype.reverse.call(target, ...arguments)
  // $model.enableEvents({ enable: true })
  if(events && events['reverse']) {
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