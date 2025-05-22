import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral, typeOf } = Coutil
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function push($model, $options, ...$elements) {
  const options = Object.assign({}, $options)
  const assignArray = 'push'
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
      Array.prototype.push.call(target, element)
      $model.retroReenableEvents()
      if(element.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { element[assignArray](...$element) }
        else { element[assignArray]($element) }
      }
      else if(element.type === 'object') { element[assignObject]($element) }
    }
    else {
      element = $element
      Array.prototype.push.call(target, element)
    }
    elements.push(element)
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, elementsIndex].join('.')
        : String(elementsIndex)
      if(mutatorEvents['pushElement']) {
        $model.dispatchEvent(
          new ModelEvent('pushElement', {
            path: modelEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $model)
        )
      }
      if(mutatorEvents['pushElement:$index']) {
        const type = ['pushElement', elementsIndex].join(':')
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