import { ContentEvent } from '../../../../events/index.js'
import Content from '../../../../index.js'
export default function deleteContent($content, $options) {
  const { target } = $content
  for(const [$targetPropertyKey, $targetPropertyValue] of Object.entries(target)) {
    $content.delete($targetPropertyKey, $options)
  }
  // Delete Property Event
  const { path } = $content
  const { events } = $options
  if(events && events['delete']) {
    $content.dispatchEvent(
      new ContentEvent('delete', {
        path,
        detail: {
          value: $content.valueOf()
        }
      }, $content)
    )
  }
  return $content
}