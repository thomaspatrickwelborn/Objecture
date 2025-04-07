import Model from '../../../index.js'
import { ModelEvent } from '../../../events/index.js'
export default function fill($model, $options) {
  const { target, path, schema } = $model
  const { enableValidation, validationEvents, events } = $options
  const $arguments = [...arguments]
  let $start
  if(typeof $arguments[1] === 'number') {
    $start = ($arguments[1] >= 0)
      ? $arguments[1]
      : target.length + $arguments[1]
  }
  else { $start = 0 }
  let $end
  if(typeof $arguments[2] === 'number') {
    $end = ($arguments[2] >= 0)
      ? $arguments[2]
      : target.length + $arguments[2]
  } else { $end = target.length }
  let fillIndex = $start
  iterateFillIndexes: 
  while(
    fillIndex < target.length &&
    fillIndex < $end
  ) {
    if(schema && enableValidation) {
      let validValue = schema.validate(validValue)
      if(validationEvents) {
        let type, propertyType
        const validatorPath = (path)
          ? [path, fillIndex].join('.')
          : String(fillIndex)
        if(validValue.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', ':', fillIndex].join('')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', ':', fillIndex].join('')
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validValue, $model))
        }
      }
      if(!validValue.valid) { continue iterateFillIndexes }
    }
    const modelPath = (path)
      ? [path, fillIndex].join('.')
      : String(fillIndex)
    let value = $arguments[0]
    if(typeof value === 'object') {
      if(value instanceof Model) { value = value.valueOf() }
      const subschema = schema?.context[0] || null
      value = new $model.constructor(value, subschema, {
        path: modelPath,
        parent: $model,
      })
    }
    Array.prototype.fill.call(
      target, value, fillIndex, fillIndex + 1
    )
    // $model.enableEvents({ enable: true })
    // Array Fill Index Event
    if(events) {
      const modelEventPath = (path)
        ? [path, fillIndex].join('.')
        : String(fillIndex)
      if(events['fillIndex']) {
        $model.dispatchEvent(
          new ModelEvent('fillIndex', {
            path: modelEventPath, 
            value: value,
            detail: {
              start: fillIndex,
              end: fillIndex + 1,
              value,
            },
          }, $model)
        )
      }
      if(events['fillIndex:$index']) {
        const type = ['fillIndex', ':', fillIndex].join('')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            detail: {
              start: fillIndex,
              end: fillIndex + 1,
              value,
            },
          }, $model)
        )
      }
    }
    fillIndex++
  }
  // Array Fill Event
  if(events && events['fill']) {
    $model.dispatchEvent(
      new ModelEvent('fill', {
        path,
        detail: {
          start: $start,
          end: $end,
          value,
        },
      },
      $model)
    )
  }
  return $model
}