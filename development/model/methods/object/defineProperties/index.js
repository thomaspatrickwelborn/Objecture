import { Coutil } from 'core-plex'
const { impandTree, typedObjectLiteral } = Coutil
import Model from '../../../index.js'
import Change from '../../../change/index.js'
import { ModelEvent } from '../../../events/index.js'
export default function defineProperties($model, $options, $propertyDescriptors) {
  const { events } = $options
  const { path } = $model
  const propertyDescriptorEntries = Object.entries($propertyDescriptors)
  let properties = typedObjectLiteral($model.valueOf())
  const definePropertiesChange = new Change({ preter: $model })
  iteratePropertyDescriptors: 
  for(const [
    $propertyKey, $propertyDescriptor
  ] of propertyDescriptorEntries) {
    $model.defineProperty($propertyKey, $propertyDescriptor)
  }
  if(events && events['defineProperties']) {
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