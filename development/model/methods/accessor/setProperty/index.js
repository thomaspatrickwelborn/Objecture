import { Coutil } from 'core-plex'
const { recursiveAssign } = Coutil
import setModel from './setModel/index.js'
import setModelProperty from './setModelProperty/index.js'
export default function setProperty($model, $options, ...$arguments) {
  let setProperty
  const options = recursiveAssign({}, $model.options, $options)
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 3) { recursiveAssign(options, $arguments[2]) }
    setProperty = setModelProperty($model, options, ...$arguments)
  }
  else {
    if($arguments.length === 2) { recursiveAssign(options, $arguments[1]) }
    setProperty = setModel($model, options, ...$arguments)
  }
  return setProperty
}