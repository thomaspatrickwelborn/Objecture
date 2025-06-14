import { typedObjectLiteral } from 'recourse'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function concat($model, $options) {
  const { target, path, schema } = $model
  const { enableValidation, mutatorEvents, source, validationEvents } = $options
  const $arguments = [].concat(...arguments)
  let valueIndex = target.length
  const values = []
  let targetConcat = [...Array.from(target)]
  let model
  iterateValues: 
  for(let $value of $arguments) {
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf()
      const validatorSource = source || typedObjectLiteral(validatorTarget)
      const validValue = schema.validateProperty(valueIndex, $subvalue, validatorSource, validatorTarget)
      if(schema &&validationEvents) {
        let type, propertyType
        const validatorPath = (path)
          ? [path, valueIndex].join('.')
          : String(valueIndex)
        if(validValue.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', valueIndex].join(':')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', valueIndex].join(':')
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validValue, $model))
        }
      }
      if(!validValue.valid) { valueIndex++; continue iterateValues }
    }
    const modelPath = (path)
      ? [path, valueIndex].join('.')
      : String(valueIndex)
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf() }
      let subschema = schema?.target[0].type.value || null
      const submodel = typedObjectLiteral($value)
      let value = new $model.constructor(submodel, subschema, {
        path: modelPath,
        parent: $model,
      })
      value.concat($value)
      values[valueIndex] = value
    }
    else {
      values[valueIndex] = $value
    }
    targetConcat = Array.prototype.concat.call(targetConcat, values[valueIndex])
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, valueIndex].join('.')
        : String(valueIndex)
      if(mutatorEvents['concatElement']) {
        $model.dispatchEvent(
          new ModelEvent('concatElement', {
            path: modelEventPath,
            value: values[valueIndex],
            detail: {
              valueIndex,
              value: values[valueIndex],
            },
          }, $model)
        )
      }
      if(mutatorEvents['concatElement:$index']) {
        const type = ['concatElement', valueIndex].join(':')
        $model.dispatchEvent(
          new ModelEvent('concatElement', {
            path: modelEventPath,
            value: values[valueIndex],
            detail: {
              valueIndex,
              value: values[valueIndex],
            },
          }, $model)
        )
      }
    }
    valueIndex++
  }
  model = new $model.constructor(targetConcat, schema, $model.options)
  if(mutatorEvents && mutatorEvents['concat']) {
    $model.dispatchEvent(
      new ModelEvent('concat', {
        path,
        detail: {
          values: model,
        },
      }, $model)
    )
  }
  return model
}