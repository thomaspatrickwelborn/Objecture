import { Coutil } from 'core-plex'
const { impandTree, typedObjectLiteral } = Coutil
import Model from '../../../index.js'
import Change from '../../../change/index.js'
import { ModelEvent } from '../../../events/index.js'
export default function defineProperties($model, $options, $propertyDescriptors) {
  const { events } = $options
  const { path } = $model
  const propertyDescriptorEntries = Object.entries($propertyDescriptors)
  const impandPropertyDescriptors = impandTree($propertyDescriptors, 'value')
  let properties = typedObjectLiteral($model.valueOf())
  const definePropertiesChange = new Change({ preter: $model })
  // Iterate Property Descriptors
  iteratePropertyDescriptors: 
  for(const [
    $propertyKey, $propertyDescriptor
  ] of propertyDescriptorEntries) {
    // Property Descriptor Value Is Direct Instance Of Array/object/Map
    $model.defineProperty($propertyKey, $propertyDescriptor, impandPropertyDescriptors)
  }
  // Define Properties Event
  if(events && events['defineProperties']) {
    // Define Properties Validator Event
    definePropertiesChange.anter = $model
    $model.dispatchEvent(
      new ModelEvent(
        'defineProperties',
        {
          path,
          value: $model.valueOf(),
          detail: {
            descriptors: $propertyDescriptors,
          },
        },
        $model
      )
    )
  }
  return $model
}