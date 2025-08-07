import { ModelEvent } from '../../../events/index.js'
export default function copyWithin($model, $options) {
  const { receiver, path } = $model
  const { enableValidation, validationEvents, mutatorEvents } = $options
  const $arguments = [...arguments]
  const copyTarget = (
    arguments[0] >= 0
  ) ? arguments[0]
    : receiver.length = arguments[0]
  const start = (
    arguments[1] >= 0
  ) ? arguments[1]
    : receiver.length + arguments[1]
  const end = (
    arguments[2] === undefined
  ) ? receiver.length
    : (
    arguments[2] >= 0
  ) ? arguments[2]
    : receiver.length + arguments[2]
  const copiedItems = []
  let copyIndex = start
  let receiverIndex = copyTarget
  iterateCopyIndex: 
  while(copyIndex < end) {
    const copyItem = receiver[copyIndex]
    copiedItems.push(copyItem)
    Array.prototype.copyWithin.call(
      receiver,
      receiverIndex,
      copyIndex,
      copyIndex + 1
    )
    $model.retroReenableEvents()
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, copyIndex].join('.')
        : String(copyIndex)
      if(mutatorEvents['copyWithinElement']) {
        $model.dispatchEvent(
          new ModelEvent(
            'copyWithinElement',
            {
              path: modelEventPath,
              value: copyItem,
              detail: {
                receiver: receiverIndex,
                start: copyIndex,
                end: copyIndex + 1,
                item: copyItem,
              },
            },
            $model
          )
        )
      }
      if(mutatorEvents['copyWithinElement:$index']) {
        const type  = ['copyWithinElement', copyIndex].join(':')
        $model.dispatchEvent(
          new ModelEvent(
            type,
            {
              path: modelEventPath,
              value: copyItem,
              detail: {
                receiver: receiverIndex,
                start: copyIndex,
                end: copyIndex + 1,
                item: copyItem,
              },
            },
            $model
          )
        )
      }
    }
    copyIndex++
    receiverIndex++
  }
  // Array Copy Within Event
  if(mutatorEvents && mutatorEvents['copyWithin']) {
    $model.dispatchEvent(
      new ModelEvent(
        'copyWithin',
        {
          path,
          detail: {
            receiver: copyTarget,
            start: start,
            end: end,
            items: copiedItems,
          },
        },
        $model
      )
    )
  }
  return $model
}