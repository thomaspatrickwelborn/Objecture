import { typedObjectLiteral } from 'recourse'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function fill($model, $options, ...$arguments) {
  const options = Object.assign({}, $options)
  const { target, path, schema } = $model
  const assignObject = options.assignObject
  const assignArray = options.assignArray || assignObject
  const { enableValidation, lengthen, mutatorEvents, validationEvents } = options
  const filled = []
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
  if(lengthen && target.length < $end) { target.length = $end }
  let fillIndex = $start
  iterateFillIndexes: 
  while(
    fillIndex < target.length &&
    fillIndex < $end
  ) {
    if(schema && enableValidation) {
      let validValue = schema.validate(validValue, $model.valueOf())
      if(validationEvents) {
        let type, propertyType
        const validatorPath = (path)
          ? [path, fillIndex].join('.')
          : String(fillIndex)
        if(validValue.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', fillIndex].join(':')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', fillIndex].join(':')
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
    let $value = $arguments[0]
    let value
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf() }
      const subschema = schema?.target[0].type.value || null
      const subproperties = typedObjectLiteral($value)
      const suboptions = Object.assign({}, options, {
        path: modelPath,
        parent: $model,
      })
      value = new $model.constructor(subproperties, subschema, suboptions)
    }
    Array.prototype.fill.call(target, value, fillIndex, fillIndex + 1)
    $model.retroReenableEvents()
    if(value.type === 'array') {
      if(['push', 'unshift'].includes(assignArray)) { value[assignArray](...$value) }
      else { value[assignArray]($value) }
    }
    else if(value.type === 'object') { value[assignObject]($value) }
    filled.push(value)
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, fillIndex].join('.')
        : String(fillIndex)
      if(mutatorEvents['fillElement']) {
        $model.dispatchEvent(
          new ModelEvent('fillElement', {
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
      if(mutatorEvents['fillElement:$index']) {
        const type = ['fillElement', fillIndex].join(':')
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
  if(mutatorEvents && mutatorEvents['fill']) {
    $model.dispatchEvent(
      new ModelEvent('fill', {
        path,
        detail: {
          start: $start,
          end: $end,
          filled,
        },
      },
      $model)
    )
  }
  return $model
}