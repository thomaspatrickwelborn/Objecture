import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral, typeOf } = Coutil
import Model from '../../../index.js'
import { ModelEvent } from '../../../events/index.js'
export default function push($model, $options, ...$elements) {
  const options = Object.assign({}, $options)
  options.assignArray = 'push'
  const { assignArray, assignObject, enableValidation, mutatorEvents, validationEvents } = options
  const { target, path, schema } = $model
  const elements = []
  let elementsIndex = 0
  iterateElements:
  for(let $element of $elements) {
    let element
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
    if($element && typeof $element === 'object') {
      $element = ($element instanceof $model.constructor) ? $element.valueOf() : $element
      const subschema = schema?.context[0] || null
      const subproperties = typedObjectLiteral(typeOf($element))
      const submodelOptions = Object.assign({}, options, {
        path: modelPath,
        parent: $model,
      })
      element = new $model.constructor(subproperties, subschema, submodelOptions)
      Array.prototype.push.call(target, element)
      $model.retroReenableEvents()
      if(element.type === 'array') { element[assignArray](...$element) }
      else if(element.type === 'object') { element[assignObject]($element) }
    }
    else {
      element = $element
      Array.prototype.push.call(target, element)
    }
    elements.push(element)
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, '.', elementsIndex].join('')
        : String(elementsIndex)
      if(mutatorEvents['pushProp']) {
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
      if(mutatorEvents['pushProp:$index']) {
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
  if(mutatorEvents && mutatorEvents['push']) {
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