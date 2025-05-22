import { Coutil } from 'core-plex'
const { typedObjectLiteral } = Coutil
import { ModelEvent } from '../../../events/index.js'
export default function splice($model, $options) {
  const options = Object.assign({}, $options)
  const assignObject = options.assignObject
  const assignArray = options.assignArray || assignObject
  const { mutatorEvents, source } = options
  const { target, path, schema } = $model
  const { enableValidation, validationEvents } = options
  const $arguments = [...arguments]
  const $start = ($arguments[0] >= 0)
    ? $arguments[0]
    : target.length + $arguments[0]
  const $deleteCount = ($arguments[1] <= 0)
    ? 0
    : (
      $arguments[1] === undefined ||
      $start + $arguments[1] >= target.length
    ) ? target.length - $start
      : $arguments[1]
  const $addItems = $arguments.slice(2)
  const addCount = $addItems.length
  const deleteItems = []
  let deleteItemsIndex = 0
  spliceDelete:
  while(deleteItemsIndex < $deleteCount) {
    const deleteItem = Array.prototype.splice.call(target, $start, 1)[0]
    deleteItems.push(deleteItem)
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, deleteItemsIndex].join('.')
        : String(deleteItemsIndex)
      if(mutatorEvents['spliceDeleteElement']) {
        $model.dispatchEvent(
          new ModelEvent('spliceDeleteElement', {
            path: modelEventPath,
            value: deleteItem,
            detail: {
              index: $start + deleteItemsIndex,
              deleteIndex: deleteItemsIndex,
              deleteItem: deleteItem,
            },
          }, $model)
        )
      }
      if(mutatorEvents['spliceDeleteElement:$index']) {
        const type = ['spliceDeleteElement', deleteItemsIndex].join(':')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath,
            value: deleteItem,
            detail: {
              index: $start + deleteItemsIndex,
              deleteIndex: deleteItemsIndex,
              deleteItem: deleteItem,
            },
          }, $model)
        )
      }
    }
    deleteItemsIndex++
  }
  let addItemsIndex = 0
  spliceAdd: 
  while(addItemsIndex < addCount) {
    let addItem = $addItems[addItemsIndex]
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf()
      const validatorSource = source || typedObjectLiteral(validatorTarget)
      const validAddItem = schema.validateProperty(elementIndex, element, validatorSource, validatorTarget)
      if(validationEvents) {
        let type, propertyType
        const validatorEventPath = (path)
          ? [path, addItemsIndex].join('.')
          : String(addItemsIndex)
        if(validAddItem.valid) {
          type = 'validProperty'
          propertyType = ['validProperty', addItemsIndex].join(':')
        }
        else {
          type = 'nonvalidProperty'
          propertyType = ['nonvalidProperty', addItemsIndex].join(':')
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validAddItem, $model))
        }
      }
      if(!validAddItem.valid) { addItemsIndex++; continue spliceAdd }
    }
    const modelPath = (path)
      ? [path, addItemsIndex].join('.')
      : String(addItemsIndex)
    let startIndex = $start + addItemsIndex
    if(addItem && typeof addItem === 'object') {
      if(addItem instanceof $model.constructor) { addItem = addItem.valueOf() }
      const subschema = schema?.target[0].type.value || null
      const subproperties = typedObjectLiteral(addItem)
      const suboptions = recursiveAssign({}, options, {
        path: modelPath,
        parent: $model,
      })
      addItem = new $model.constructor(subproperties, subschema, suboptions)
      Array.prototype.splice.call(target, startIndex, 0, addItem)
      $model.retroReenableEvents()
      if(addItem.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { addItem[assignArray](...$value) }
        else { addItem[assignArray]($value) }
      }
      else if(addItem.type === 'object') { addItem[assignObject]($value) }
    }
    else {
      Array.prototype.splice.call(target, startIndex, 0, addItem)
    }
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, addItemsIndex].join('.')
        : String(addItemsIndex)
      if(mutatorEvents['spliceAddElement']) {
        $model.dispatchEvent(
          new ModelEvent('spliceAddElement', {
            path: modelEventPath,
            value: addItem,
            detail: {
              index: $start + addItemsIndex,
              addIndex: addItemsIndex,
              addItem: addItem,
            },
          }, $model)
        )
      }
      if(mutatorEvents['spliceAddElement:$index']) {
        const type = ['spliceAddElement', addItemsIndex].join(':')
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath,
            value: addItem,
            detail: {
              index: $start + addItemsIndex,
              addIndex: addItemsIndex,
              addItem: addItem,
            },
          }, $model)
        )
      }
    }
    addItemsIndex++
  }
  if(mutatorEvents && mutatorEvents['splice']) {
    $model.dispatchEvent(
      new ModelEvent('splice', {
        path,
        detail: {
          $start,
          deleted: deleteItems,
          added: $addItems,
          length: target.length,
        },
      },
      $model)
    )
  }
  return deleteItems
}