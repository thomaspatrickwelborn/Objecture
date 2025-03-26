import { ContentEvent } from '../../../../events/index.js'
import Content from '../../../../index.js'
export default function getContent($content, $options) {
  // Get Property Event
  const { path } = $content
  const { events } = $options
  if(events && events['get']) {
    $content.dispatchEvent(
      new ContentEvent('get', {
        path,
        value: $content.valueOf(),
        detail: {
          value: $content.valueOf()
        }
      }, $content)
    )
  }
  return $content
}