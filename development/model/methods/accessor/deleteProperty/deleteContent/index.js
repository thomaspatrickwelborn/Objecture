import { ModelEvent } from '../../../../events/index.js'
import Model from '../../../../index.js'
export default function deleteContent($model, $options) {
  const { target } = $model
  for(const [$targetPropertyKey, $targetPropertyValue] of Object.entries(target)) {
    $model.delete($targetPropertyKey, $options)
  }
  // Delete Property Event
  const { path } = $model
  const { events } = $options
  if(events && events['delete']) {
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