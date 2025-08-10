// import typeOf from '../type-of/index.js'
// import { ObjectKeys } from '../variables/index.js'
// import { TypeValidators, Tensors, Getters, Setters } from '../tensors/index.js'
// import  from '../variables/index.js'
// import entities from '../entities/index.js'
// const Options = {
//   getters: [Getters.Object, Getters.Map],
//   setters: [Setters.Object, Setters.Map],
//   typeValidators: [TypeValidators.Object, TypeValidators.Map],
// }




import {
  assign as recursiveAssign,
  tensors, typedObjectLiteral, typeOf
  * as Variables, 
} from 'recourse'
// import Change from '../../../change/index.js'
import { ModelEvent, ValidatorEvent } from '../../../events/index.js'
import Options from '../options/index.js'
const { ObjectKeys } = Variables
const { TypeValidators, Tensors, Getters, Setters } = tensors

export default function assignSources($target, $options, ...$sources) {
  // const options = Object.assign({}, $options)
  // const assignObject = 'assign'
  // const assignArray = options.assignArray || 'assign'
  if(!$target) { return $target}
  const { path, schema, source, receiver, target } = $target
  const options = Object.assign({}, Options, $options)
  const {
    // assignObject, assignArray, assignMap, 
    enableValidation, mutatorEvents, required, 
    sourceTree, validationEvents, 
  } = options
  const assignedSources = []

  const getters = new Tensors(options.getters, options.typeValidators)
  const setters = new Tensors(options.setters, options.typeValidators)
  // >>>>>
  const typeOfTarget = typeOf($target)
  iterateSources: 
  for(const $source of $sources) {
    const assignedSource = typeOf($source)
    if(!Variables.ObjectKeys.includes(typeOf($source))) continue iterateSources
    const sourceEntries = entities($source, 'entries', { recurse: false, })
    iterateSourceEntries: 
    for(const [$sourcePropertyKey, $sourcePropertyValue] of sourceEntries) {
      const targetPropertyValue = getters.cess($target, $sourcePropertyKey)
      const typeOfTargetPropertyValue = typeOf(targetPropertyValue)
      const typeOfSourcePropertyValue = typeOf($sourcePropertyValue)
      if(typeOfTarget === 'array' && type === 'assignConcat') {
        setters.cess($target, $target.length, $sourcePropertyValue)
      }
      else if(
        Variables.ObjectKeys.includes(typeOfSourcePropertyValue) &&
        Variables.ObjectKeys.includes(typeOfTargetPropertyValue)
      ) {
        assignSources(targetPropertyValue, type, $sourcePropertyValue)
      }
      else {
        setters.cess($target, $sourcePropertyKey, $sourcePropertyValue)
      }
    }
  }
  return $target
}

export default function assign($model, $options, ...$sources) {
  const options = Object.assign({}, $options)
  const assignObject = 'assign'
  const assignArray = options.assignArray || 'assign'
  const { path, schema, source, receiver, target } = $model
  // <<<<<
  const { enableValidation, mutatorEvents, required, sourceTree, validationEvents } = options
  const assignedSources = []
  // const assignChange = new Change({ preter: $model })
  iterateAssignSources: 
  for(let $source of $sources) {
    let assignedSource
    // const assignSourceChange = new Change({ preter: $model })
    if(Array.isArray($source)) { assignedSource = [] }
    else if($source && typeof $source === 'object') { assignedSource = {} }
    let validObject, validObjectReport
    if(enableValidation && schema) {
      validObject = schema.validate($source, $model.valueOf())
      validObjectReport = validObject.report()
    }
    iterateSourceProperties:
    for(let [$sourceKey, $sourceValue] of Object.entries($source)) {
      // const assignSourcePropertyChange = new Change({ preter: receiver[$sourceKey] })
      // const assignSourcePropertyKeyChange = new Change({ preter: receiver[$sourceKey] })
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
        if(schema?.type === 'array') { subschema = schema.receiver[0].type.value }
        else if(schema?.type === 'object') { subschema = schema.receiver[$sourceKey].type.value }
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
          Object.assign(target, { [$sourceKey]: $sourceValue})
          Object.assign(assignedSource, assignment)
        }
        else {
          if(receiver[$sourceKey] instanceof $model.constructor) {
            sourceValue = receiver[$sourceKey]
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
          Object.assign(target, { [$sourceKey]: $sourceValue})
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
        Object.assign(target, { [$sourceKey]: $sourceValue})
        Object.assign(assignedSource, assignment)
      }
      if(mutatorEvents) {
        const modelEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey)
        if(mutatorEvents['assignSourceProperty:$key']) {
          const type = ['assignSourceProperty', $sourceKey].join(':')
          // assignSourcePropertyKeyChange.anter = receiver[$sourceKey]
          $model.dispatchEvent(
            new ModelEvent(type, {
              path: modelEventPath,
              value: sourceValue,
              // change: assignSourcePropertyKeyChange,
              detail: {
                source: assignedSource,
              }
            }, $model)
          )
        }
        if(mutatorEvents['assignSourceProperty']) {
          // assignSourcePropertyChange.anter = receiver[$sourceKey]
          $model.dispatchEvent(
            new ModelEvent('assignSourceProperty', {
              path: modelEventPath,
              value: sourceValue,
              // change: assignSourcePropertyChange,
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
      // assignSourceChange.anter = $model
      $model.dispatchEvent(
        new ModelEvent('assignSource', {
          path,
          // change: assignSourceChange,
          detail: {
            source: assignedSource,
          },
        }, $model)
      )
    }
  }
  if(mutatorEvents && mutatorEvents['assign']) {
    // assignChange.anter = $model
    $model.dispatchEvent(
      new ModelEvent('assign', { 
        path,
        // change: assignChange,
        detail: {
          sources: assignedSources,
        },
      }, $model)
    )
  }
  return $model
}