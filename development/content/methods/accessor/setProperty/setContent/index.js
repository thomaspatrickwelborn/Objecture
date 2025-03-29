import { ContentEvent } from '../../../../events/index.js'
import Content from '../../../../index.js'
import Change from '../../../../change/index.js'
export default function setContent($content, $options, $properties) {
  iterateProperties: 
  for(const [$propertyKey, $propertyValue] of Object.entries($properties)) {
    $content.set($propertyKey, $propertyValue, $options)
  }
  // Set Property Event
  const { path } = $content
  const { events } = $options
  if(events && events['set']) {
    $content.dispatchEvent(
      new ContentEvent('set', {
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