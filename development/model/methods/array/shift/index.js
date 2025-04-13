import { ModelEvent } from '../../../events/index.js'
export default function shift($model, $options) {
  const { mutatorEvents } = $options
  const { target, path } = $model
  const shiftElement = Array.prototype.shift.call(target)
  const shiftElementIndex = 0
  $model.retroReenableEvents()
  if(mutatorEvents && mutatorEvents['shift']) {
    const modelEventPath = (path)
      ? [path, shiftElementIndex].join('.')
      : String(shiftElementIndex)
    $model.dispatchEvent(
      new ModelEvent(
        'shift',
        {
          path: modelEventPath,
          value: shiftElement,
          detail: {
            elementIndex: shiftElementIndex,
            element: shiftElement,
          },
        },
        $model
      )
    )
  }
  return shiftElement
}