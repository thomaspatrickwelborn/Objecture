import { ModelEvent } from '../../../events/index.js'
export default function pop($model, $options) {
  const { mutatorEvents } = $options
  const { receiver, path } = $model
  const popElement = Array.prototype.pop.call(receiver)
  const popElementIndex = receiver.length - 1
  $model.retroReenableEvents()
  if(mutatorEvents && mutatorEvents['pop']) {
    const modelEventPath = (path)
      ? [path, popElementIndex].join('.')
      : String(popElementIndex)
      $model.dispatchEvent(
      new ModelEvent(
        'pop',
        {
          path: modelEventPath,
          value: popElement,
          detail: {
            elementIndex: popElementIndex,
            element: popElement,
          },
        },
        $model
      )
    )
  }
  return popElement
}