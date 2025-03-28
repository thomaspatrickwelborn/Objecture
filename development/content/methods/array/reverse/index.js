import { ContentEvent } from '../../../events/index.js'
export default function reverse($content, $options) {
  const { events } = $options
  const { target, path } = $content
  Array.prototype.reverse.call(target, ...arguments)
  // $content.enableEvents({ enable: true })
  if(events && events['reverse']) {
    $content.dispatchEvent(
      new ContentEvent(
        'reverse',
        {
          path,
          detail: {
            reference: target
          },
        },
        $content
      )
    )
  }
  return $content
}