import Content from '../../../index.js'
import { ContentEvent } from '../../../events/index.js'
export default function push($content, $options, ...$elements) {
  const { events } = $options
  const { target, path, schema } = $content
  const { enableValidation, validationEvents } = $content.options
  const elements = []
  let elementsIndex = 0
  iterateElements:
  for(let $element of $elements) {
    // Validation
    if(schema && enableValidation) {
      const validElement = schema.validateProperty(elementsIndex, $element, {}, $content)
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
          $content.dispatchEvent(new ValidatorEvent($eventType, validElement, $content))
        }
      }
      if(!validElement.valid) { return target.length }
    }
    const contentPath = (path)
      ? [path, elementsIndex].join('.')
      : String(elementsIndex)
    if(typeof $element === 'object') {
      if($element instanceof Content) { $element = $element.valueOf() }
      const subschema = schema?.context[0] || null
      $element = new Content($element, subschema, {
        path: contentPath,
        parent: $content,
      })
      elements.push($element)
      Array.prototype.push.call(target, $element)
    } else {
      elements.push($element)
      Array.prototype.push.call(target, $element)
    }
    $content.reenableEvents({ enable: true })
    if(events) {
      const contentEventPath = (path)
        ? [path, '.', elementsIndex].join('')
        : String(elementsIndex)
      if(events['pushProp']) {
        $content.dispatchEvent(
          new ContentEvent('pushProp', {
            path: contentEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $content)
        )
      }
      if(events['pushProp:$index']) {
        const type = ['pushProp', ':', elementsIndex].join('')
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $content)
        )
      }
    }
    elementsIndex++
  }
  // Push Event
  if(events && events['push']) {
    $content.dispatchEvent(
      new ContentEvent('push', {
        path,
        detail: {
          elements,
        },
      }, $content)
    )
  }
  return target.length
}