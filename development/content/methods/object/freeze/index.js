import Content from '../../../index.js'
import { ContentEvent } from '../../../events/index.js'
export default function freeze($content, $options) {
  const { recursive, events } = $options
  const { target, path } = $content
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Content) {
        $propertyValue.freeze()
      }
      else { Object.freeze($propertyValue) }
      if(events && events['freeze']) {
        $content.dispatchEvent(
          new ContentEvent(
            'freeze',
            { path },
            $content
          )
        )
      }
    }
  }
  Object.freeze(target)
  return $content
}