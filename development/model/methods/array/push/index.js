import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral, typeOf } = Coutil
import Model from '../../../index.js'
import { ModelEvent } from '../../../events/index.js'
export default function push($model, $options, ...$elements) {
  const { events } = $options
  const { target, path, schema } = $model
  console.log($model.options)
  const { enableValidation, validationEvents } = $model.options
  const elements = []
  let elementsIndex = 0
  iterateElements:
  for(let $element of $elements) {
    let element
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
      $element = ($element instanceof Model) ? $element.valueOf() : $element
      const subschema = schema?.context[0] || null
      const submodel = typedObjectLiteral(typeOf($element))
      element = new $model.constructor(submodel, subschema, recursiveAssign({}, $model.options, {
        path: modelPath,
        parent: $model,
      }))
      Array.prototype.push.call(target, element)
      $model.retroReenableEvents()
      element[element.options.assignMethod]($element)

    } else {
      element = $element
      Array.prototype.push.call(target, element)
    }
    elements.push(element)
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