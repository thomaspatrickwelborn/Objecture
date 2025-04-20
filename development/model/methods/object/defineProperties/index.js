import { Coutil } from 'core-plex'
const { typedObjectLiteral } = Coutil
import Change from '../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function defineProperties($model, $options, $propertyDescriptors) {
  const { path, schema } = $model
  const { enableValidation, mutatorEvents, required, validationEvents } = $options
  // let properties = 
  if(enableValidation && required && schema) {
    let validObject = schema.validate(Object.defineProperties(typedObjectLiteral(schema.type), $propertyDescriptors), $model.valueOf())
    if(validationEvents) {
      let type, propertyType
      const validatorPath = path
      if(validObject.valid) { type = 'valid' }
      else { type = 'nonvalid' }
      $model.dispatchEvent(new ValidatorEvent(type, validObject, $model))
    }
    if(!validObject.valid) { return }
  }
  const propertyDescriptorEntries = Object.entries($propertyDescriptors)
  const definePropertiesChange = new Change({ preter: $model })
  iteratePropertyDescriptors: 
  for(const [
    $propertyKey, $propertyDescriptor
  ] of propertyDescriptorEntries) {
    $model.defineProperty($propertyKey, $propertyDescriptor)
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