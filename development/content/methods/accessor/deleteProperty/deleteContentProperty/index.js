import { Coutil } from 'core-plex'
const { regularExpressions} = Coutil
import Content from '../../../../index.js'
import { ContentEvent } from '../../../../events/index.js'
export default function deleteContentProperty($content, $options, $path) {
  const { target, path, schema } = $content
  const { events, pathkey, subpathError, enableValidation, validationEvents } = $options
  // Path Key: true
  if(pathkey === true) {
    const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape))
    const propertyKey = subpaths.shift()
    let propertyValue = target[propertyKey]

    // Return: Subproperty
    if(subpaths.length) {
      // Subpath Error
      if(subpathError === false && propertyValue === undefined) { return undefined }
      return propertyValue.delete(subpaths.join('.'), $options)
    }
    // Validation
    if(schema && enableValidation) {
      const differedPropertyProxy = $content.valueOf()
      delete differedPropertyProxy[propertyKey]
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, {}, $content)
      if(validationEvents) {
        let type, propertyType
        const validatorEventPath = (path)
          ? [path, propertyKey].join('.')
          : String(propertyKey)
        if(validTargetProp.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', ':', propertyKey].join('')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', ':', propertyKey].join('')
        }
        for(const $eventType of [type, propertyType]) {
          $content.dispatchEvent(
            new ValidatorEvent($eventType, Object.assign(validTargetProp, {
              path: validatorEventPath
            }), $content)
          )
        }
      }
      if(!validTargetProp.valid) { return }
    }
    if(typeof propertyValue === 'object') {
      propertyValue.delete($options)
    }
    delete target[propertyKey]
    // Delete Property Event
    if(events) {
      if(events['deleteProperty']) {
        $content.dispatchEvent(
          new ContentEvent('deleteProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $content)
        )
      }
      if(events['deleteProperty:$key']) {
        const type = ['deleteProperty', ':', propertyKey].join('')
        const _path = [path, '.', propertyKey].join('')
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: _path,
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $content)
        )
      }
    }
    return undefined
  }
  // Path Key: false
  else if(pathkey === false) {
    const propertyKey = $path
    const propertyValue = target[propertyKey]

    // Validation
    if(schema && enableValidation) {
      const differedPropertyProxy = $content.valueOf()
      delete differedPropertyProxy[propertyKey]
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, $content, $content)
      if(validationEvents) {
        let type, propertyType
        const validatorEventPath = (path)
          ? [path, propertyKey].join('.')
          : String(propertyKey)
        if(validTargetProp.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', ':', propertyKey].join('')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', ':', propertyKey].join('')
        }
        for(const $eventType of [type, propertyType]) {
          $content.dispatchEvent(
            new ValidatorEvent($eventType, validTargetProp, $content)
          )
        }
      }
      if(!validTargetProp.valid) { return }
    }
  
    if(propertyValue instanceof Content) {
      propertyValue.delete($options)
    }
    delete target[propertyKey]
    // Delete Property Event
    if(events) {
      if(events['deleteProperty']) {
        $content.dispatchEvent(
          new ContentEvent('deleteProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $content)
        )
      }
      if(events['deleteProperty:$key']) {
        const type = ['deleteProperty', ':', propertyKey].join('')
        const _path = [path, '.', propertyKey].join('')
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: _path,
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $content)
        )
      }
    }
    return undefined
  }
}