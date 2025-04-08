import { ModelEvent } from '../../../events/index.js'
export default function pop($model, $options) {
  const { mutatorEvents } = $options
  const { target, path } = $model
  const popElement = Array.prototype.pop.call(target)
  // $model.enableEvents({ enable: true })
  const popElementIndex = target.length - 1
  // Array Pop Event
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