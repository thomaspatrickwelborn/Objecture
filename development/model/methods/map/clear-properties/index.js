import { assign } from 'recourse'
import deleteContent from './delete-content/index.js'
export default function clearProperties($model, $options, ...$arguments) {
  const clearProperties = deleteContent($model, $options, ...$arguments)
  return clearProperties
}