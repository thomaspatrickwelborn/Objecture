import { Coutil } from 'core-plex'
const { regularExpressions} = Coutil
import Content from '../../../../index.js'
import { ContentEvent } from '../../../../events/index.js'
export default function getContentProperty($content, $options, $path) {
  const { target, path } = $content
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
        $content.dispatchEvent(
          new ContentEvent('getProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $content)
        )
      }
      if(events['getProperty:$key']) {
        const type = ['getProperty', ':', propertyKey].join('')
        const _path = [path, '.', propertyKey].join('')
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: _path,
            detail: {
              value: propertyValue,
            }
          }, $content)
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