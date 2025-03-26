import Content from '../../../index.js'
import { ContentEvent } from '../../../events/index.js'
export default function concat($content, $options) {
  const { target, path, schema } = $content
  const { enableValidation, validationEvents, events } = $options
  const $arguments = [...arguments].reduce(($arguments, $argument) => {
    if(Array.isArray($argument)) { $arguments.push(...$argument) }
    else { $arguments.push($argument) }
    return $arguments
  }, [])
  let valueIndex = target.length
  const values = []
  let targetConcat = [...Array.from(target)]
  let content
  iterateValues: 
  for(const $value of $arguments) {
    // Validation: Value
    if(schema && enableValidation) {
      const validValue = schema.validateProperty(valueIndex, $subvalue, {}, $content)
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
          $content.dispatchEvent(new ValidatorEvent($eventType, validValue, $content))
        }
      }
      if(!validValue.valid) { valueIndex++; continue iterateValues }
    }
    const contentPath = (path)
      ? [path, valueIndex].join('.')
      : String(valueIndex)
    // Value: Object Type
    if(typeof $value === 'object') {
      // Value: Content
      if($value instanceof Content) { $value = $value.valueOf() }
      let subschema = schema?.context[0] || null
      const value = new Content($value, subschema, {
        path: contentPath,
        parent: $content,
      })
      values[valueIndex] = value
    }
    // Value: Primitive Type
    else {
      values[valueIndex] = $value
    }
    targetConcat = Array.prototype.concat.call(targetConcat, values[valueIndex])
    if(events) {
      const contentEventPath = (path)
        ? [path, valueIndex].join('.')
        : String(valueIndex)
      if(events['concatValue']) {
        $content.dispatchEvent(
          new ContentEvent('concatValue', {
            path: contentEventPath,
            value: values[valueIndex],
            detail: {
              valueIndex,
              value: values[valueIndex],
            },
          }, $content)
        )
      }
      if(events['concatValue:$index']) {
        const type = ['concatValue', ':', valueIndex].join('')
        $content.dispatchEvent(
          new ContentEvent('concatValue', {
            path: contentEventPath,
            value: values[valueIndex],
            detail: {
              valueIndex,
              value: values[valueIndex],
            },
          }, $content)
        )
      }
    }
    valueIndex++
  }
  content = new Content(targetConcat, schema, $content.options)
  if(events && events['concat']) {
    $content.dispatchEvent(
      new ContentEvent('concat', {
        path,
        detail: {
          values: content,
        },
      }, $content)
    )
  }
  return content
}