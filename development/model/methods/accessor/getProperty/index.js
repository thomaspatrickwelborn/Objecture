import { Coutil } from 'core-plex'
const { recursiveAssign } = Coutil
import getModel from './getModel/index.js'
import getModelProperty from './getModelProperty/index.js'
export default function getProperty($model, $options, ...$arguments) {
  let getProperty
  const options = recursiveAssign({}, $model.options, $options)
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { recursiveAssign(options, $arguments[1]) }
    getProperty = getModelProperty($model, options, ...$arguments)
  }
  else {
    if($arguments.length === 1) { recursiveAssign(options, $arguments[0]) }
    getProperty = getModel($model, options, ...$arguments)
  }
  return getProperty
}