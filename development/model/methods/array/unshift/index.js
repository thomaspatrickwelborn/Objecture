import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function unshift($model, $options, ...$elements) {
  const options = Object.assign({}, $options)
  const assignArray = 'unshift'
  const assignObject = options.assignObject
  const { enableValidation, mutatorEvents, validationEvents } = options
  const elements = []
  const elementsLength = $elements.length
  let elementIndex = elementsLength - 1
  let elementCoindex = 0
  iterateElements:
  while(elementIndex > -1) {
    const elementsLength = $elements.length
    let $element = $elements[elementIndex]
    let element
    const targetElement = target[elementIndex]
    const targetElementIsModelInstance = (
      targetElement instanceof $model.constructor
    ) ? true : false
    // Validation
    if(schema && enableValidation) {
      const validElement = schema.validateProperty(elementIndex, $element, {}, $model)
      if(validationEvents) {
        let type, propertyType
        const validatorEventPath = (path)
          ? [path, '.', elementCoindex].join('')
          : elementCoindex
        if(validElement.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', ':', elementCoindex].join('')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', ':', elementCoindex].join('')
        }
        // $model.enableEvents({ enable: true })
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validElement, $model))
        }
      }
      if(!validElement.valid) { return $model.length }
    }
    // const change = {
    //   preter: {
    //     key: elementCoindex,
    //     value: target[elementCoindex],
    //   },
    //   anter: {
    //     key: elementCoindex,
    //     value: undefined,
    //   },
    //   conter: undefined,
    // }
    // Element: Object Type
    if($element && typeof $element === 'object') {
      const subschema = schema?.context[0] || null
      const modelPath = (path)
        ? path.concat('.', elementCoindex)
        : String(elementCoindex)
      element = new $model.constructor($element, subschema, {
        path: modelPath,
        parent: $model,
      })
      if(element.type === 'array') { element[assignArray](...$value) }
      else if(element.type === 'object') { element[assignObject]($value) }
    }
    // Element: Primitive Type
    else {
      element = $element
      elements.unshift(element)
      Array.prototype.unshift.call(target, $element)
    }
    // change.anter.value = element
    // change.conter = (targetElementIsModelInstance)
    //   ? (targetElement.toString() !== JSON.stringify(element))
    //   : (JSON.stringify(targetElement) !== JSON.stringify(element))
    // Array Unshift Prop Event
    // $model.enableEvents({ enable: true })
    if(mutatorEvents) {
      const type = ['unshiftProp', elementCoindex].join(':')
      const modelEventPath = (path)
        ? [path, elementCoindex].join('.')
        : String(elementCoindex)
      if(mutatorEvents['unshiftProp']) {
        $model.dispatchEvent(
          new ModelEvent('unshiftProp', {
            path: modelEventPath,
            value: element,
            // change,
            detail: {
              elementIndex: elementCoindex, 
              element: element,
            },
          }, $model)
        )
      }
      if(mutatorEvents['unshiftProp:$index']) {
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath,
            value: element,
            // change,
            detail: {
              elementIndex: elementCoindex, 
              element: element,
            },
          }, $model)
        )
      }

    }
    elementIndex--
    elementCoindex++
  }
  // Array Unshift Event
  if(mutatorEvents && mutatorEvents['unshift'] && elements.length) {
    $model.dispatchEvent(
      new ModelEvent('unshift', {
        path,
        detail: {
          elements,
        },
      },
      $model)
    )
  }
  return $model.length
}