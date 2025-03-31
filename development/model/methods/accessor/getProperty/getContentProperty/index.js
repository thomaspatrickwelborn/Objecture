import { Coutil } from 'core-plex'
const { regularExpressions} = Coutil
import Model from '../../../../index.js'
import { ModelEvent } from '../../../../events/index.js'
export default function getModelProperty($model, $options, $path) {
  const { target, path } = $model
  // Arguments
  const { events, pathkey, subpathError } = $options
  // Path Key: true
  if(pathkey === true) {
    const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape))
    const propertyKey = subpaths.shift()
    let propertyValue = target[propertyKey]
    // Return: Subproperty
    if(subpaths.length) {
      // Subpath Error
      if(subpathError === false && propertyValue === undefined) { return undefined }
      return propertyValue.get(subpaths.join('.'), $options)
    }
    // Get Property Event
    if(events) {
      if(events['getProperty']) {
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
      if(events['getProperty:$key']) {
        const type = ['getProperty', ':', propertyKey].join('')
        const _path = [path, '.', propertyKey].join('')
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
  // Path Key: false
  else if(pathkey === false) {
    const propertyValue = target[propertyKey]
    return propertyValue
  }
}