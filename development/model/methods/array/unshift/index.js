import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral, typeOf } = Coutil
import { ModelEvent } from '../../../events/index.js'
export default function unshift($model, $options, ...$elements) {
  const options = Object.assign({}, $options)
  const assignArray = 'unshift'
  const assignObject = options.assignObject
  const { enableValidation, mutatorEvents, source, validationEvents } = options
  const { target, path, schema } = $model
  const elements = []
  let elementsIndex = 0
  iterateElements:
  for(let $element of $elements) {
    let element
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf()
      const validatorSource = source || typedObjectLiteral(validatorTarget)
      const validElement = schema.validateProperty(elementsIndex, $element, validatorSource, validatorTarget)
      if(validationEvents) {
        let type, propertyType
        const validatorPath = (path)
          ? [path, elementsIndex].join('.')
          : String(elementsIndex)
        if(validElement.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', elementsIndex].join(':')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', elementsIndex].join(':')
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
      const subschema = schema?.target[0].type.value || null
      const subproperties = typedObjectLiteral(typeOf($element))
      const submodelOptions = Object.assign({}, options, {
        path: modelPath,
        parent: $model,
      })
      element = new $model.constructor(subproperties, subschema, submodelOptions)
      Array.prototype.unshift.call(target, element)
      $model.retroReenableEvents()
      if(element.type === 'array') { element[assignArray](...$element) }
      else if(element.type === 'object') { element[assignObject]($element) }
    }
    else {
      element = $element
      Array.prototype.unshift.call(target, element)
    }
    elements.unshift(element)
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, elementsIndex].join('.')
        : String(elementsIndex)
      if(mutatorEvents['unshiftElement']) {
        $model.dispatchEvent(
          new ModelEvent('unshiftElement', {
            path: modelEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $model)
        )
      }
      if(mutatorEvents['unshiftElement:$index']) {
        const type = ['unshiftElement', elementsIndex].join(':')
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
  if(mutatorEvents && mutatorEvents['unshift']) {
    $model.dispatchEvent(
      new ModelEvent('unshift', {
        path,
        detail: {
          elements,
        },
      }, $model)
    )
  }
  return target.length
}