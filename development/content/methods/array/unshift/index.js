import Content from '../../../index.js'
import { ContentEvent, ValidatorEvent } from '../../../events/index.js'
export default function unshift($content, $options, ...$elements) {
  const { events } = $options
  const { target, path, schema } = $content
  const { enableValidation, validationEvents } = $options
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
    const targetElementIsContentInstance = (
      targetElement instanceof Content
    ) ? true : false
    // Validation
    if(schema && enableValidation) {
      const validElement = schema.validateProperty(elementIndex, $element, {}, $content)
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
        $content.reenableEvents({ enable: true })
        for(const $eventType of [type, propertyType]) {
          $content.dispatchEvent(new ValidatorEvent($eventType, validElement, $content))
        }
      }
      if(!validElement.valid) { return $content.length }
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
    if(typeof $element === 'object') {
      const subschema = schema?.context[0] || null
      const contentPath = (path)
        ? path.concat('.', elementCoindex)
        : String(elementCoindex)
      element = new Content($element, subschema, {
        path: contentPath,
        parent: $content,
      })
      elements.unshift(element)
      Array.prototype.unshift.call(target, element)
    }
    // Element: Primitive Type
    else {
      element = $element
      elements.unshift(element)
      Array.prototype.unshift.call(target, $element)
    }
    // change.anter.value = element
    // change.conter = (targetElementIsContentInstance)
    //   ? (targetElement.toString() !== JSON.stringify(element))
    //   : (JSON.stringify(targetElement) !== JSON.stringify(element))
    // Array Unshift Prop Event
    $content.reenableEvents({ enable: true })
    if(events) {
      const type = ['unshiftProp', elementCoindex].join(':')
      const contentEventPath = (path)
        ? [path, elementCoindex].join('.')
        : String(elementCoindex)
      if(events['unshiftProp']) {
        $content.dispatchEvent(
          new ContentEvent('unshiftProp', {
            path: contentEventPath,
            value: element,
            // change,
            detail: {
              elementIndex: elementCoindex, 
              element: element,
            },
          }, $content)
        )
      }
      if(events['unshiftProp:$index']) {
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath,
            value: element,
            // change,
            detail: {
              elementIndex: elementCoindex, 
              element: element,
            },
          }, $content)
        )
      }

    }
    elementIndex--
    elementCoindex++
  }
  // Array Unshift Event
  if(events && events['unshift'] && elements.length) {
    $content.dispatchEvent(
      new ContentEvent('unshift', {
        path,
        detail: {
          elements,
        },
      },
      $content)
    )
  }
  return $content.length
}