import Content from '../../../index.js'
import { ContentEvent } from '../../../events/index.js'
export default function seal($content, $options) {
  const { recursive, events } = $options
  const { target } = $content
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Content) {
        $propertyValue.seal()
        if(events && events['sealProperty']) {
          $content.dispatchEvent(
            new ContentEvent(
              'sealProperty',
              { path: $propertyValue.path },
              $content
            )
          )
        }
      }
    }
  }
  Object.seal(target)
  if(events && events['seal']) {
    $content.dispatchEvent(
      new ContentEvent(
        'seal',
        { path: $content.path },
        $content
      )
    )
  }
  return $content
}