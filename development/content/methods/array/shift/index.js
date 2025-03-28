import { ContentEvent } from '../../../events/index.js'
export default function shift($content, $options) {
  const { events } = $options
  const { target, path } = $content
  const shiftElement = Array.prototype.shift.call(target)
  // $content.enableEvents({ enable: true })
  const shiftElementIndex = 0
  // Array Shift Event
  if(events && events['shift']) {
    const contentEventPath = (path)
      ? [path, shiftElementIndex].join('.')
      : String(shiftElementIndex)
    $content.dispatchEvent(
      new ContentEvent(
        'shift',
        {
          path: contentEventPath,
          value: shiftElement,
          detail: {
            elementIndex: shiftElementIndex,
            element: shiftElement,
          },
        },
        $content
      )
    )
  }
  return shiftElement
}