import Content from '../../../index.js'
import { ContentEvent } from '../../../events/index.js'
export default function freeze($content, $options) {
  const { recursive, events } = $options
  const { target } = $content
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Content) {
        $propertyValue.freeze()
        if(events && events['freezeProperty']) {
          $content.dispatchEvent(
            new ContentEvent(
              'freezeProperty',
              { path: $propertyValue.path },
              $content
            )
          )
        }
      }
    }
  }
  Object.freeze(target)
  if(events && events['freeze']) {
    $content.dispatchEvent(
      new ContentEvent(
        'freeze',
        { path: $content.path },
        $content
      )
    )
  }
  return $content
}