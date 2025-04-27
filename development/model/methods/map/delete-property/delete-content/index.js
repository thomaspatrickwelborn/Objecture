import { ModelEvent } from '../../../../events/index.js'
export default function deleteContent($model, $options) {
  const { target } = $model
  for(const [$targetPropertyKey, $targetPropertyValue] of Object.entries(target)) {
    $model.delete($targetPropertyKey, $options)
  }
  const { path } = $model
  const { mutatorEvents } = $options
  if(mutatorEvents && mutatorEvents['delete']) {
    $model.dispatchEvent(
      new ModelEvent('delete', {
        path,
        detail: {
          value: $model.valueOf()
        }
      }, $model)
    )
  }
  return $model
}