import { ContentEvent } from '../../../events/index.js'
export default function copyWithin($content, $options) {
  const { target, path } = $content
  const { enableValidation, validationEvents, events } = $options
  const $arguments = [...arguments]
  const copyTarget = (
    arguments[0] >= 0
  ) ? arguments[0]
    : target.length = arguments[0]
  const start = (
    arguments[1] >= 0
  ) ? arguments[1]
    : target.length + arguments[1]
  const end = (
    arguments[2] === undefined
  ) ? target.length
    : (
    arguments[2] >= 0
  ) ? arguments[2]
    : target.length + arguments[2]
  const copiedItems = []
  let copyIndex = start
  let targetIndex = copyTarget
  iterateCopyIndex: 
  while(copyIndex < end) {
    const copyItem = target[copyIndex]
    copiedItems.push(copyItem)
    Array.prototype.copyWithin.call(
      target,
      targetIndex,
      copyIndex,
      copyIndex + 1
    )
    $content.reenableEvents({ enable: true })
    // Array Copy Within Index Event Data
    if(events) {
      const contentEventPath = (path)
        ? [path, copyIndex].join('.')
        : String(copyIndex)
      if(events['copyWithinIndex']) {
        $content.dispatchEvent(
          new ContentEvent(
            'copyWithinIndex',
            {
              path: contentEventPath,
              value: copyItem,
              detail: {
                target: targetIndex,
                start: copyIndex,
                end: copyIndex + 1,
                item: copyItem,
              },
            },
            $content
          )
        )
      }
      if(events['copyWithinIndex:$index']) {
        const type  = ['copyWithinIndex', ':', copyIndex].join('')
        $content.dispatchEvent(
          new ContentEvent(
            type,
            {
              path: contentEventPath,
              value: copyItem,
              detail: {
                target: targetIndex,
                start: copyIndex,
                end: copyIndex + 1,
                item: copyItem,
              },
            },
            $content
          )
        )
      }
    }
    copyIndex++
    targetIndex++
  }
  // Array Copy Within Event
  if(events && events['copyWithin']) {
    $content.dispatchEvent(
      new ContentEvent(
        'copyWithin',
        {
          path,
          detail: {
            target: copyTarget,
            start: start,
            end: end,
            items: copiedItems,
          },
        },
        $content
      )
    )
  }
  return $content
}