import { Coutil } from 'core-plex'
const { regularExpressions} = Coutil
import Model from '../../../../index.js'
import { ModelEvent } from '../../../../events/index.js'
export default function getContentProperty($model, $options, $path) {
  const { target, path } = $model
  const { mutatorEvents, pathkey, subpathError } = $options
  if(pathkey === true) {
    const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape))
    const propertyKey = subpaths.shift()
    let propertyValue = target[propertyKey]
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
    const propertyValue = target[propertyKey]
    return propertyValue
  }
}