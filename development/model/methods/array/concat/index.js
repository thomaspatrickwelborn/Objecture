import { Coutil } from 'core-plex'
const { typedObjectLiteral } = Coutil
import Model from '../../../index.js'
import { ModelEvent } from '../../../events/index.js'
export default function concat($model, $options) {
  const { target, path, schema } = $model
  const { enableValidation, validationEvents, mutatorEvents } = $options
  const $arguments = [].concat(...arguments)
  let valueIndex = target.length
  const values = []
  let targetConcat = [...Array.from(target)]
  let model
  iterateValues: 
  for(let $value of $arguments) {
    if(schema && enableValidation) {
      const validValue = schema.validateProperty(valueIndex, $subvalue, {}, $model)
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
    if(typeof $value === 'object') {
      if($value instanceof Model) { $value = $value.valueOf() }
      let subschema = schema?.context[0] || null
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
      if(mutatorEvents['concatValue']) {
        $model.dispatchEvent(
          new ModelEvent('concatValue', {
            path: modelEventPath,
            value: values[valueIndex],
            detail: {
              valueIndex,
              value: values[valueIndex],
            },
          }, $model)
        )
      }
      if(mutatorEvents['concatValue:$index']) {
        const type = ['concatValue', valueIndex].join(':')
        $model.dispatchEvent(
          new ModelEvent('concatValue', {
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