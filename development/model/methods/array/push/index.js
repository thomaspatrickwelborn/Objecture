import Model from '../../../index.js'
import { ModelEvent } from '../../../events/index.js'
export default function push($model, $options, ...$elements) {
  const { events } = $options
  const { target, path, schema } = $model
  const { enableValidation, validationEvents } = $model.options
  const elements = []
  let elementsIndex = 0
  iterateElements:
  for(let $element of $elements) {
    // Validation
    if(schema && enableValidation) {
      const validElement = schema.validateProperty(elementsIndex, $element, {}, $model)
      if(validationEvents) {
        let type, propertyType
        const validatorPath = (path)
          ? [path, elementsIndex].join('.')
          : String(elementsIndex)
        if(validElement.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', ':', elementsIndex].join('')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', ':', elementsIndex].join('')
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validElement, $model))
        }
      }
      if(!validElement.valid) { return target.length }
    }
    const modelPath = (path)
      ? [path, elementsIndex].join('.')
      : String(elementsIndex)
    if(typeof $element === 'object') {
      if($element instanceof Model) { $element = $element.valueOf() }
      const subschema = schema?.context[0] || null
      $element = new Model($element, subschema, {
        path: modelPath,
        parent: $model,
      })
      elements.push($element)
      Array.prototype.push.call(target, $element)
    } else {
      elements.push($element)
      Array.prototype.push.call(target, $element)
    }
    // $model.enableEvents({ enable: true })
    if(events) {
      const modelEventPath = (path)
        ? [path, '.', elementsIndex].join('')
        : String(elementsIndex)
      if(events['pushProp']) {
        $model.dispatchEvent(
          new ModelEvent('pushProp', {
            path: modelEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $model)
        )
      }
      if(events['pushProp:$index']) {
        const type = ['pushProp', ':', elementsIndex].join('')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $model)
        )
      }
    }
    elementsIndex++
  }
  // Push Event
  if(events && events['push']) {
    $model.dispatchEvent(
      new ModelEvent('push', {
        path,
        detail: {
          elements,
        },
      }, $model)
    )
  }
  return target.length
}