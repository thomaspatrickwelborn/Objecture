import { splitPath } from 'recourse'
import { ModelEvent } from '../../../../events/index.js'
export default function getContentProperty($model, $options, $path) {
  const { receiver, path } = $model
  const { mutatorEvents, pathkey, subpathError, pathParseInteger } = $options
  if(pathkey === true) {
    const subpaths = splitPath($path, pathParseInteger)
    const propertyKey = subpaths.shift()
    let propertyValue = receiver[propertyKey]
    if(subpaths.length) {
      if(subpathError === false && propertyValue === undefined) { return undefined }
      return propertyValue.get(subpaths.join('.'), $options)
    }
    if(mutatorEvents) {
      if(mutatorEvents['getProperty']) {
        $model.dispatchEvent(
          new ModelEvent('getProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        )
      }
      if(mutatorEvents['getProperty:$key']) {
        const type = ['getProperty', propertyKey].join(':')
        const _path = [path, propertyKey].join('.')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: _path,
            detail: {
              value: propertyValue,
            }
          }, $model)
        )
      }
    }
    return propertyValue
  }
  else if(pathkey === false) {
    const propertyValue = receiver[propertyKey]
    return propertyValue
  }
}