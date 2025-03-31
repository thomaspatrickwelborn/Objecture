import { ModelEvent } from '../../../events/index.js'
export default function shift($model, $options) {
  const { events } = $options
  const { target, path } = $model
  const shiftElement = Array.prototype.shift.call(target)
  // $model.enableEvents({ enable: true })
  const shiftElementIndex = 0
  // Array Shift Event
  if(events && events['shift']) {
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