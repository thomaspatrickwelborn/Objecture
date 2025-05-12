import { Coutil } from 'core-plex'
const { typedObjectLiteral } = Coutil
import Change from '../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function defineProperties($model, $options, $propertyDescriptors) {
  const { path, schema } = $model
  let {
    enableValidation, mutatorEvents, required, 
    validation, validationEvents, validationReport
  } = $options
  const propertyDescriptorEntries = Object.entries($propertyDescriptors)
  const definePropertiesChange = new Change({ preter: $model })
  iteratePropertyDescriptors: 
  for(const [
    $propertyKey, $propertyDescriptor
  ] of propertyDescriptorEntries) {
    $model.defineProperty($propertyKey, $propertyDescriptor, Object.assign({}, $options, {
      validation, validationReport
    }))
  }
  if(mutatorEvents && mutatorEvents['defineProperties']) {
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