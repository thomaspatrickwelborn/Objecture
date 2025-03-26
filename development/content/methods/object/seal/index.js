import Content from '../../../index.js'
import { ContentEvent } from '../../../events/index.js'
export default function seal($content, $options) {
  const { recursive, events } = $options
  const { target, path } = $content
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Content) {
        $propertyValue.seal()
      }
      else { Object.seal($propertyValue) }
      if(events && events['seal']) {
        $content.dispatchEvent(
          new ContentEvent(
            'seal',
            { path },
            $content
          )
        )
      }
    }
  }
  Object.seal(target)
  return $content
}