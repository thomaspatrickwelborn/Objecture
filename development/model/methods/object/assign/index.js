import { Coutil } from 'core-plex'
const { recursiveAssign, typedObjectLiteral } = Coutil
import Change from '../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
export default function assign($model, $options, ...$sources) {
  const options = Object.assign({}, $options)
  const assignObject = 'assign'
  const assignArray = options.assignArray || 'assign'
  const { path, schema, source, target } = $model
  const { enableValidation, mutatorEvents, required, sourceTree, validationEvents } = options
  if(schema && enableValidation) {
    let validObject = schema.validate(Object.assign({}, $properties), $model.valueOf())
    if(validationEvents) {
      let type, propertyType
      const validatorPath = path
      if(validObject.valid) { type = 'valid' }
      else { type = 'nonvalid' }
      $model.dispatchEvent(new ValidatorEvent(type, validObject, $model))
    }
    if(!validObject.valid) { return }
  }
  const assignedSources = []
  const assignChange = new Change({ preter: $model })
  iterateAssignSources: 
  for(let $source of $sources) {
    let assignedSource
    const assignSourceChange = new Change({ preter: $model })
    if(Array.isArray($source)) { assignedSource = [] }
    else if($source && typeof $source === 'object') { assignedSource = {} }
    iterateSourceProperties:
    for(let [$sourceKey, $sourceValue] of Object.entries($source)) {
      const assignSourcePropertyChange = new Change({ preter: target[$sourceKey] })
      const assignSourcePropertyKeyChange = new Change({ preter: target[$sourceKey] })
      if(schema && enableValidation) {
        const validatorTarget = $model.valueOf()
        const validatorSource = $source
        const validSourceProperty = schema.validateProperty($sourceKey, $sourceValue, validatorSource, validatorTarget)
        if(validationEvents) {
          let type, propertyType
          const validatorEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey)
          if(validSourceProperty.valid) {
            type = 'validProperty'
            propertyType = ['validProperty', $sourceKey].join(':')
          }
          else {
            type = 'nonvalidProperty'
            propertyType = ['nonvalidProperty', $sourceKey].join(':')
          }
          for(const $eventType of [type, propertyType]) {
            $model.dispatchEvent(new ValidatorEvent($eventType, validSourceProperty, $model))
          }
        }
        if(!validSourceProperty.valid) { continue iterateSourceProperties }
      }
      let sourceValue
      if($sourceValue && typeof $sourceValue === 'object') {
        if($sourceValue instanceof $model.constructor) {
          sourceValue = $sourceValue.valueOf()
        }
        let subschema
        if(schema?.type === 'array') { subschema = schema.context[0] }
        else if(schema?.type === 'object') { subschema = schema.context[$sourceKey] }
        else { subschema = null }
        const modelPath = (path)
          ? [path, $sourceKey].join('.')
          : String($sourceKey)
        if(sourceTree === false) {
          const suboptions = recursiveAssign({}, options, {
            path: modelPath,
            parent: $model,
          })
          sourceValue = new $model.constructor($sourceValue, subschema, suboptions)
          const assignment = { [$sourceKey]: sourceValue }
          Object.assign(target, assignment)
          Object.assign(assignedSource, assignment)
        }
        else {
          if(target[$sourceKey] instanceof $model.constructor) {
            sourceValue = target[$sourceKey]
          }
          else {
            const subproperties = typedObjectLiteral($sourceValue)
            const suboptions = recursiveAssign({}, options, {
              path: modelPath,
              parent: $model,
            })
            sourceValue = new $model.constructor(subproperties, subschema, suboptions)
          }
          const assignment = { [$sourceKey]: sourceValue }
          Object.assign(target, assignment)
          Object.assign(assignedSource, assignment)
          $model.retroReenableEvents()
          if(sourceValue.type === 'array') {
            if(['push', 'unshift'].includes(assignArray)) { sourceValue[assignArray](...$sourceValue) }
            else { sourceValue[assignArray]($sourceValue) }
          }
          else if(sourceValue.type === 'object') { sourceValue[assignObject]($sourceValue) }
        }
      }
      else {
        sourceValue = $sourceValue
        const assignment = { [$sourceKey]: sourceValue }
        Object.assign(target, assignment)
        Object.assign(assignedSource, assignment)
      }
      if(mutatorEvents) {
        const modelEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey)
        if(mutatorEvents['assignSourceProperty:$key']) {
          const type = ['assignSourceProperty', $sourceKey].join(':')
          assignSourcePropertyKeyChange.anter = target[$sourceKey]
          $model.dispatchEvent(
            new ModelEvent(type, {
              path: modelEventPath,
              value: sourceValue,
              change: assignSourcePropertyKeyChange,
              detail: {
                source: assignedSource,
              }
            }, $model)
          )
        }
        if(mutatorEvents['assignSourceProperty']) {
          assignSourcePropertyChange.anter = target[$sourceKey]
          $model.dispatchEvent(
            new ModelEvent('assignSourceProperty', {
              path: modelEventPath,
              value: sourceValue,
              change: assignSourcePropertyChange,
              detail: {
                source: assignedSource,
              }
            }, $model)
          )
        }
      }
    }
    assignedSources.push(assignedSource)
    if(mutatorEvents && mutatorEvents['assignSource']) {
      assignSourceChange.anter = $model
      $model.dispatchEvent(
        new ModelEvent('assignSource', {
          path,
          change: assignSourceChange,
          detail: {
            source: assignedSource,
          },
        }, $model)
      )
    }
  }
  if(mutatorEvents && mutatorEvents['assign']) {
    assignChange.anter = $model
    $model.dispatchEvent(
      new ModelEvent('assign', { 
        path,
        change: assignChange,
        detail: {
          sources: assignedSources,
        },
      }, $model)
    )
  }
  return $model
}