import { Coutil } from 'core-plex'
const { impandTree, typedObjectLiteral } = Coutil
import Content from '../../../index.js'
import Change from '../../../change/index.js'
import { ContentEvent } from '../../../events/index.js'
export default function defineProperties($content, $options, $propertyDescriptors) {
  const { events } = $options
  const { path } = $content
  const propertyDescriptorEntries = Object.entries($propertyDescriptors)
  const impandPropertyDescriptors = impandTree($propertyDescriptors, 'value')
  let properties = typedObjectLiteral($content.valueOf())
  const definePropertiesChange = new Change({ preter: $content })
  // Iterate Property Descriptors
  iteratePropertyDescriptors: 
  for(const [
    $propertyKey, $propertyDescriptor
  ] of propertyDescriptorEntries) {
    // Property Descriptor Value Is Direct Instance Of Array/object/Map
    $content.defineProperty($propertyKey, $propertyDescriptor, impandPropertyDescriptors)
  }
  $content.reenableEvents({ enable: true })
  // Define Properties Event
  if(events && events['defineProperties']) {
    // Define Properties Validator Event
    definePropertiesChange.anter = $content
    $content.dispatchEvent(
      new ContentEvent(
        'defineProperties',
        {
          path,
          value: $content.valueOf(),
          detail: {
            descriptors: $propertyDescriptors,
          },
        },
        $content
      )
    )
  }
  return $content
}