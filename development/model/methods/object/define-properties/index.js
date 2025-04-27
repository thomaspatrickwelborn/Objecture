import { Coutil } from 'core-plex'
const { typedObjectLiteral } = Coutil
import Change from '../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function defineProperties($model, $options, $propertyDescriptors) {
  const { path, schema } = $model
  const { enableValidation, mutatorEvents, required, validationEvents } = $options
  let validObject, validObjectReport
  if(enableValidation && schema) {
    validObject = schema.validate(Object.defineProperties(
      typedObjectLiteral(schema.type), $propertyDescriptors), $model.valueOf()
    )
    validObjectReport = validObject.report()
  }
  const propertyDescriptorEntries = Object.entries($propertyDescriptors)
  const definePropertiesChange = new Change({ preter: $model })
  iteratePropertyDescriptors: 
  for(const [
    $propertyKey, $propertyDescriptor
  ] of propertyDescriptorEntries) {
    $model.defineProperty($propertyKey, $propertyDescriptor, {
      validationReport: validObjectReport
    })
  }
  if(enableValidation && schema) {
    if(validationEvents) {
      let type, propertyType
      const validatorPath = path
      if(validObject.valid) { type = 'valid' }
      else { type = 'nonvalid' }
      $model.dispatchEvent(new ValidatorEvent(type, validObject, $model))
    }
    if(!validObject.valid) { return }
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