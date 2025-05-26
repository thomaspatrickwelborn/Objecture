import { regularExpressions } from 'recourse'
import { ModelEvent, ValidatorEvent } from '../../../../events/index.js'
export default function deleteContentProperty($model, $options, $path) {
  const { target, path, schema } = $model
  const { mutatorEvents, pathkey, subpathError, enableValidation, validationEvents } = $options
  if(pathkey === true) {
    const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape))
    const propertyKey = subpaths.shift()
    let propertyValue = target[propertyKey]
    if(subpaths.length) {
      if(subpathError === false && propertyValue === undefined) { return undefined }
      return propertyValue.delete(subpaths.join('.'), $options)
    }
    if(schema && enableValidation) {
      const differedPropertyProxy = $model.valueOf()
      delete differedPropertyProxy[propertyKey]
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, {}, $model.valueOf())
      if(validationEvents) {
        let type, propertyType
        const validatorEventPath = (path)
          ? [path, propertyKey].join('.')
          : String(propertyKey)
        if(validTargetProp.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', propertyKey].join(':')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', propertyKey].join(':')
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(
            new ValidatorEvent($eventType, Object.assign(validTargetProp, {
              path: validatorEventPath
            }), $model)
          )
        }
      }
      if(!validTargetProp.valid) { return }
    }
    if(propertyValue && typeof propertyValue === 'object') {
      propertyValue.delete($options)
    }
    delete target[propertyKey]
    if(mutatorEvents) {
      if(mutatorEvents['deleteProperty']) {
        $model.dispatchEvent(
          new ModelEvent('deleteProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        )
      }
      if(mutatorEvents['deleteProperty:$key']) {
        const type = ['deleteProperty', propertyKey].join(':')
        const _path = [path, propertyKey].join('.')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: _path,
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $model)
        )
      }
    }
    return undefined
  }
  else if(pathkey === false) {
    const propertyKey = $path
    const propertyValue = target[propertyKey]

    if(schema && enableValidation) {
      const differedPropertyProxy = $model.valueOf()
      delete differedPropertyProxy[propertyKey]
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, $model.valueOf())
      if(validationEvents) {
        let type, propertyType
        const validatorEventPath = (path)
          ? [path, propertyKey].join('.')
          : String(propertyKey)
        if(validTargetProp.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', propertyKey].join(':')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', propertyKey].join(':')
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(
            new ValidatorEvent($eventType, validTargetProp, $model)
          )
        }
      }
      if(!validTargetProp.valid) { return }
    }
  
    if(propertyValue instanceof $model.constructor) {
      propertyValue.delete($options)
    }
    delete target[propertyKey]
    if(mutatorEvents) {
      if(mutatorEvents['deleteProperty']) {
        $model.dispatchEvent(
          new ModelEvent('deleteProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        )
      }
      if(mutatorEvents['deleteProperty:$key']) {
        const type = ['deleteProperty', propertyKey].join(':')
        const _path = [path, propertyKey].join('.')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: _path,
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $model)
        )
      }
    }
    return undefined
  }
}