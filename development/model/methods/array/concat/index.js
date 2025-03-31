import Model from '../../../index.js'
import { ModelEvent } from '../../../events/index.js'
export default function concat($model, $options) {
  const { target, path, schema } = $model
  const { enableValidation, validationEvents, events } = $options
  const $arguments = [...arguments].reduce(($arguments, $argument) => {
    if(Array.isArray($argument)) { $arguments.push(...$argument) }
    else { $arguments.push($argument) }
    return $arguments
  }, [])
  let valueIndex = target.length
  const values = []
  let targetConcat = [...Array.from(target)]
  let model
  iterateValues: 
  for(const $value of $arguments) {
    // Validation: Value
    if(schema && enableValidation) {
      const validValue = schema.validateProperty(valueIndex, $subvalue, {}, $model)
      if(schema &&validationEvents) {
        let type, propertyType
        const validatorPath = (path)
          ? [path, valueIndex].join('.')
          : String(valueIndex)
        if(validValue.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', ':', valueIndex].join('')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', ':', valueIndex].join('')
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
    // Value: Object Type
    if(typeof $value === 'object') {
      // Value: Model
      if($value instanceof Model) { $value = $value.valueOf() }
      let subschema = schema?.context[0] || null
      const value = new Model($value, subschema, {
        path: modelPath,
        parent: $model,
      })
      values[valueIndex] = value
    }
    // Value: Primitive Type
    else {
      values[valueIndex] = $value
    }
    targetConcat = Array.prototype.concat.call(targetConcat, values[valueIndex])
    // $model.enableEvents({ enable: true })
    if(events) {
      const modelEventPath = (path)
        ? [path, valueIndex].join('.')
        : String(valueIndex)
      if(events['concatValue']) {
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
      if(events['concatValue:$index']) {
        const type = ['concatValue', ':', valueIndex].join('')
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
  model = new Model(targetConcat, schema, $model.options)
  if(events && events['concat']) {
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