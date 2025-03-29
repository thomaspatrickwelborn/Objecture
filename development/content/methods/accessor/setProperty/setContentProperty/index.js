import { Coutil } from 'core-plex'
const { recursiveAssign, regularExpressions} = Coutil
import Content from '../../../../index.js'
import Change from '../../../../change/index.js'
import { ContentEvent, ValidatorEvent } from '../../../../events/index.js'
export default function setContentProperty($content, $options, $path, $value) {
  const { target, path, schema } = $content
  const { enableValidation, validationEvents, events, pathkey, subpathError, recursive, source } = $options
  // Path Key: true
  if(pathkey === true) {
    // Subpaths
    const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape))
    // Property Key
    const propertyKey = subpaths.shift()
    // Property Value
    let propertyValue
    const contentPath = (path)
      ? [path, propertyKey].join('.')
      : String(propertyKey)
    // Return: Subproperty
    if(subpaths.length) {
      if(recursive && target[propertyKey] === undefined) {
        // Subschema
        let subschema
        if(schema?.type === 'array') { subschema = schema.context[0] }
        else if(schema?.type === 'object') { subschema = schema.context[propertyKey] }
        else { subschema = undefined }
        // Subcontent
        let subcontent
        if(subschema?.type === 'array') { subcontent = [] }
        else if(subschema?.type === 'object') { subcontent = {} }
        else {
          if(Number(propertyKey)) { subcontent = [] }
          else { subcontent = {} }
        }
        propertyValue = new Content(subcontent, subschema, recursiveAssign({}, $options, {
          path: contentPath,
          parent: $content,
        }))
      }
      else {
        propertyValue = target[propertyKey]
      }
      // Subpath Error
      if(subpathError === false && propertyValue === undefined) { return undefined }
      propertyValue.set(subpaths.join('.'), $value, $options)
      return propertyValue
    }
    // Validation
    if(schema && enableValidation) {
      const validTargetProp = schema.validateProperty(propertyKey, $value, source, $content)
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
          $content.dispatchEvent(new ValidatorEvent($eventType, validTargetProp, $content))
        }
      }
      if(!validTargetProp.valid) { return }
    }
    // Return: Property
    // Value: Object Literal
    if(typeof $value === 'object') {
      // Value: Content
      if($value instanceof Content) { $value = $value.valueOf() }
      let subschema
      let subcontent
      if(schema?.type === 'array') {
        subschema = schema.context[0]
        subcontent = []
      }
      else if(schema?.type === 'object') {
        subschema = schema.context[propertyKey]
        subcontent = {}
      }
      else { subschema = undefined }
      propertyValue = new Content(subcontent, subschema, recursiveAssign(
        {}, $options, {
          path: contentPath,
          parent: $content,
        }
      ))
      target[propertyKey] = propertyValue
      $content.retroReenableEvents()
      propertyValue.set($value)
    }
    // Value: Primitive Literal
    else {
      propertyValue = $value
      target[propertyKey] = propertyValue
    }
    // Root Assignment
    // Set Property Event
    if(events) {
      const contentEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey)
      if(events['setProperty']) {
        $content.dispatchEvent(
          new ContentEvent('setProperty', {
            path: contentEventPath, 
            value: propertyValue,
            // change,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $content)
        )
      }
      if(events['setProperty:$key']) {
        const type = ['setProperty', ':', propertyKey].join('')
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath, 
            value: propertyValue,
            // change,
            detail: {
              value: propertyValue,
            }
          }, $content)
        )
      }
    }
    // Return Property Value
    return propertyValue
  }
  // Path Key: false
  else if(pathkey === false) {
    let propertyKey = $path
    // Property Value: Object
    if(typeof $value === 'object') {
      if($value instanceof Content) { $value = $value.valueOf() }
      let subschema
      let subcontent
      if(schema?.type === 'array') {
        subschema = schema.context[0]
        subcontent = []
      }
      if(schema?.type === 'object') {
        subschema = schema.context[propertyKey]
        subcontent = {}
      }
      else { subschema = undefined }
      const contentPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey)
      propertyValue = new Content(subcontent, subschema, recursiveAssign(
        {}, $options, {
          path: contentPath,
          parent: $content,
        }
      ))
      target[propertyKey] = propertyValue
      propertyValue.set($value)
    }
    // Property Value: Primitive Literal
    else {
      propertyValue = $value
      target[propertyKey] = propertyValue
    }
    // Root Assignment
    // Set Property Event
    if(events) {
      const contentEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey)
      if(events['setProperty']) {
        $content.dispatchEvent(
          new ContentEvent('setProperty', {
            path: contentEventPath, 
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $content)
        )
      }
      if(events['setProperty:$key']) {
        const type = ['setProperty', ':', propertyKey].join('')
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath, 
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $content)
        )
      }
    }
    // Return Property Value
    return propertyValue
  }
}