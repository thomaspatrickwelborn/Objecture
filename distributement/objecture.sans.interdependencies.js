import Core from 'core-plex';
import { typedObjectLiteral as typedObjectLiteral$2, assign as assign$3, variables as variables$1, typeOf as typeOf$2, tensors as tensors$1, entities, impand, splitPath, freeze as freeze$1 } from 'recourse';

const Primitives = {
  'string': String, 
  'number': Number, 
  'boolean': Boolean, 
  'bigint': BigInt,
  'undefined': undefined,
  'null': null,
};
Object.values(Primitives);
const Objects = {
  'object': Object,
  'array': Array,
};
Object.values(Objects);
const Types = Object.assign({}, Primitives, Objects);
Object.values(Types);
[
 Primitives.String, Primitives.Number, Primitives.Boolean, 
 Objects.Object, Objects.Array
];

var typeOf$1 = ($data) => Object
  .prototype
  .toString
  .call($data).slice(8, -1).toLowerCase();

function typedObjectLiteral$1($value) {
  let _typedObjectLiteral;
  const typeOfValue = typeOf$1($value);
  if(typeOfValue === 'string') {
    const value = $value.toLowerCase();
    if(value === 'object') { _typedObjectLiteral = {}; }
    else if(value === 'array') { _typedObjectLiteral = []; }
  }
  else  {
    if(typeOfValue === 'object') { _typedObjectLiteral = {}; }
    else if(typeOfValue === 'array') { _typedObjectLiteral = []; }
  }
  return _typedObjectLiteral
}

var isArrayLike = ($source) => {
  let isArrayLike;
  const typeOfSource = typeOf$1($source);
  if(typeOfSource === 'array') { isArrayLike = true; }
  else if(
    typeOfSource === 'object' &&
    Number.isInteger($source.length) && $source.length >= 0
  ) {
    iterateSourceKeys: 
    for(const $sourceKey of Object.keys(
      Object.getOwnPropertyDescriptors($source)
    )) {
      if($sourceKey === 'length') { continue iterateSourceKeys }
      isArrayLike = !isNaN($sourceKey);
      if(!isArrayLike) { break iterateSourceKeys }
    }
  }
  else { isArrayLike = false; }
  return isArrayLike
};

function assign$2($target, ...$sources) {
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    if(!$source) continue iterateSources
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfTargetPropertyValue = typeOf$1($target[$sourcePropertyKey]);
      const typeOfSourcePropertyValue = typeOf$1($sourcePropertyValue);
      if(
        typeOfTargetPropertyValue === 'object' &&
        typeOfSourcePropertyValue === 'object'
      ) {
        $target[$sourcePropertyKey] = assign$2($target[$sourcePropertyKey], $sourcePropertyValue);
      }
      else {
        $target[$sourcePropertyKey] = $sourcePropertyValue;
      }
    }
  }
  return $target
}

var Options$1$1 = {
  ancestors: [],
  delimiter: '.',
  depth: 0,
  frozen: false,
  maxDepth: 10,
  nonenumerable: true,
  path: false,
  sealed: false,
  type: false,
};

function getOwnPropertyDescriptor($properties, $propertyKey, $options) {
  const options = Object.assign({}, Options$1$1, $options, {
    ancestors: Object.assign([], $options.ancestors)
  });
  const propertyDescriptor = Object.getOwnPropertyDescriptor($properties, $propertyKey);
  if(!options.nonenumerable && !propertyDescriptor.enumerable) { return }
  if(!options.ancestors.includes($properties)) { options.ancestors.unshift($properties); }
  if(options.ancestors.includes(propertyDescriptor.value)) { return }
  if(options.path) {
    options.path = (typeOf$1(options.path) === 'string') ? [options.path, $propertyKey].join(options.delimiter) : $propertyKey;
    propertyDescriptor.path = options.path;
  }
  if(options.type) { propertyDescriptor.type = typeOf$1(propertyDescriptor.value); }
  if(options.frozen) { propertyDescriptor.frozen = Object.isFrozen(propertyDescriptor.value); }
  if(options.sealed) { propertyDescriptor.sealed = Object.isSealed(propertyDescriptor.value); }
  if(['array', 'object'].includes(typeOf$1(propertyDescriptor.value))) {
    propertyDescriptor.value = getOwnPropertyDescriptors(propertyDescriptor.value, options);
  }
  return propertyDescriptor
}

function getOwnPropertyDescriptors($properties, $options) {
  const propertyDescriptors = {};
  const options = Object.assign({}, Options$1$1, $options);
  if(options.depth >= options.maxDepth) { return propertyDescriptors }
  else { options.depth++; }
  for(const [$propertyKey, $propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors($properties))) {
    const propertyDescriptor = getOwnPropertyDescriptor($properties, $propertyKey, options);
    if(propertyDescriptor !== undefined) { propertyDescriptors[$propertyKey] = propertyDescriptor; }
  }
  return propertyDescriptors
}

var Options$2$1 = {
  typeCoercion: false,
};

function defineProperty$1($target, $propertyKey, $propertyDescriptor, $options) {
  const propertyDescriptor = Object.assign({}, $propertyDescriptor);
  const options = Object.assign({}, Options$2$1, $options);
  const typeOfPropertyValue = typeOf$1(propertyDescriptor.value);
  if(['array', 'object'].includes(typeOfPropertyValue)) {
    const propertyValue = isArrayLike(Object.defineProperties(
      typedObjectLiteral$1(typeOfPropertyValue), propertyDescriptor.value
    )) ? [] : {};
    propertyDescriptor.value = defineProperties$1(propertyValue, propertyDescriptor.value, options);
  }
  else if(
    options.typeCoercion && 
    Object.getOwnPropertyDescriptor(propertyDescriptor, 'type') !== undefined &&
    !['undefined', 'null'].includes(typeOfPropertyValue)
  ) {
    propertyDescriptor.value = Primitives[propertyDescriptor.type](propertyDescriptor.value);
  }
  Object.defineProperty($target, $propertyKey, propertyDescriptor);
  if($propertyDescriptor.sealed) { Object.seal($target[$propertyKey]); }
  if($propertyDescriptor.frozen) { Object.freeze($target[$propertyKey]); }
  return $target
}

function defineProperties$1($target, $propertyDescriptors, $options) {
  const options = Object.assign({}, Options$2$1, $options);
  for(const [
    $propertyKey, $propertyDescriptor
  ] of Object.entries($propertyDescriptors)) {
    defineProperty$1($target, $propertyKey, $propertyDescriptor, options);
  }
  return $target
}

var Options$1$2 = ($options) => {
  const options = assign$2({
    propertyDescriptors: false,
    defineProperties: false,
    replacers: [],
    revivers: [],
  }, $options);
  if(options.propertyDescriptors?.type) {
    options.replacers.push(function BigintReplacer($key, $value) {
      if(typeOf$1($value) === 'bigint') { return String($value) }
      else { return $value }
    });
  }
  return options
};

function JSONMiddlewares($middlewares, $key, $value) {
  let value = $value;
  for(const $middleware of $middlewares) {
    value = $middleware($key, $value);
  }
  return value
}
class LocalStorageRoute extends EventTarget {
  constructor($path, $options) {
    super();
    if(!$path) return null
    const options = Options$1$2($options);
    const db = localStorage;
    Object.defineProperties(this, {
      'path': { value: $path },
      'raw': { value: function raw() { return db.getItem(this.path) } },
      'get': { value: function get() {
        const { path } = this;
        const raw = db.getItem(this.path);
        if(['undefined', undefined].includes(raw)) { return }
        const propertyDescriptors = JSON.parse(raw, JSONMiddlewares.bind(null, options.revivers));
        const dataTypedObjectLiteral = typedObjectLiteral$1(propertyDescriptors);
        const data = (options.propertyDescriptors) ? defineProperties$1(
          dataTypedObjectLiteral, propertyDescriptors, options.defineProperties
        ) : propertyDescriptors;
        this.dispatchEvent(new CustomEvent('get', { detail: { path, raw, data } }));
        return data
      } },
      'set': { value: function set($data) {
        const data = $data;
        const { path } = this;
        let raw = (options.propertyDescriptors) ? JSON.stringify(
          getOwnPropertyDescriptors(data, options.propertyDescriptors), JSONMiddlewares.bind(null, options.replacers)
        ) : JSON.stringify(
          data, JSONMiddlewares.bind(null, options.replacers)
        );
        db.setItem(this.path, raw);
        this.dispatchEvent(new CustomEvent('set', { detail: { path, raw, data } }));
        return 
      } },
      'remove': { value: function remove() {
        const { path } = this;
        const raw = this.raw();
        const data = this.get();
        db.removeItem(this.path);
        this.dispatchEvent(new CustomEvent('remove', { detail: { path, raw, data } }));
        return
      } },
    });
  }
}

class Verification extends EventTarget {
  constructor($settings) {
    super();
    const settings = Object.assign({}, $settings);
    Object.defineProperties(this, {
      'type': { value: settings.type },
      'key': { value: settings.key },
      'value': { value: settings.value },
      'message': { configurable: true, get() {
        let message;
        if(this.pass !== undefined) {
          message = settings.messages[String(this.pass)](this);
          Object.defineProperty(this, 'message', { value: message });
        }
        return message
      } },
      'pass': { writable: true, 
        set pass($pass) {
          Object.defineProperty(this, 'pass', { value: $pass });
        },
      },
    });
  }
}

const Messages$1 = {
  'true': ($validation) => `${$validation.valid}`,
  'false': ($validation) => `${$validation.valid}`,
};
function report($format = "expand", $prevalidation) {
  const prevalidation = $prevalidation || this;
  const schema = prevalidation.schema;
  const validations = [].concat(
    prevalidation.advance, prevalidation.deadvance, prevalidation.unadvance
  );
  if($format === "expand") {
    const _report = typedObjectLiteral$2(schema.type);
    for(const $validation of validations) {
      const verifications = [].concat(
        $validation.advance, $validation.deadvance, $validation.unadvance
      );
      _report[$validation.key] = {};
      for(const $verification of verifications) {
        _report[$validation.key][$verification.type] = {};
        if($verification.validation) {
          _report[$validation.key][$verification.type] = this.report($format, $verification.validation);
        }
        else {
          _report[$validation.key][$verification.type] = $verification;
        }
      }
    }
    return _report
  }
  if($format === "impand") {
    if(prevalidation.valid === false) { return false }
    const _report = typedObjectLiteral$2(schema.type);
    for(const $validation of validations) {
      const verifications = [].concat(
        $validation.advance, $validation.deadvance, $validation.unadvance
      );
      let reportValue;
      iterateVerifications: 
      for(const $verification of verifications) {
        if($verification.type === 'type') {
          if($verification.validation && $validation.valid) {
            reportValue = this.report($format, $verification.validation);
          }
          break iterateVerifications
        }
      }
      if(!reportValue) { reportValue = $validation.valid; }
      _report[$validation.key] = reportValue;
    }
    return _report
  }
}
class Validation extends EventTarget {
  constructor($settings = {}, $schema) {
    super();
    const settings = Object.assign({ messages: Messages$1 }, $settings);
    let valid;
    const advance = [];
    const deadvance = [];
    const unadvance = [];
    Object.defineProperties(this, {
      'schema': { value: $schema },
      'verificationType': { value: settings.verificationType },
      'required': { value: settings.required },
      'definition': { value: settings.definition },
      'key': { value: settings.key },
      'value': { value: settings.value },
      'advance': { value: advance },
      'deadvance': { value: deadvance },
      'unadvance': { value: unadvance },
      'valid': {
        writable: true,
        get valid() { return valid },
        set valid($valid) { Object.defineProperty(this, 'valid', { value: $valid }); }
      },
      'report': { configurable: true, get() {
        const _report = report.bind(this);
        Object.defineProperty(this, 'report', { value: _report });
        return _report
      } },
    });
  }
}

const Messages = {
  'true': ($verification) => `${$verification.pass}`,
  'false': ($verification) => `${$verification.pass}`,
};
class Validator extends EventTarget {
  constructor($definition = {}, $schema) {
    super();
    const definition = Object.freeze(
      Object.assign({ messages: Messages }, $definition)
    );
    Object.defineProperties(this, {
      'definition': { value: definition },
      'schema': { value: $schema },
      'type': { value: definition.type },
      'messages': { value: definition.messages },
      'validate': { configurable: true, get() {
        function validate($key, $value, $source, $target) {
          const { definition, messages, type } = this;
          let verification = new Verification({
            type: type,
            key: $key,
            value: definition.value,
            messages: assign$3({}, messages, definition.messages),
          });
          const validation = definition.validate(...arguments);
          if(typeof validation === 'object') {
            verification.validation = validation;
            verification.pass = validation.valid;
          }
          else { verification.pass = validation; }
          return verification
        }
        const boundValidate = validate.bind(this);
        Object.defineProperty(this, 'validate', {
          value: boundValidate
        });
        return boundValidate
      } },
    });
  }
}

const { ObjectKeys: ObjectKeys$1, TypeKeys } = variables$1;

function parseValidateArguments(...$arguments) {
  let $sourceName, $source, $target;
  if($arguments.length === 1) {
    $sourceName = null; $source = $arguments.shift(); $target = null;
  }
  else if($arguments.length === 2) {
    if(['number', 'string'].includes(typeof $arguments[0])) {
      $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = null;
    }
    else if($arguments[0] && typeof $arguments[0] === 'object') {
      $sourceName = null; $source = $arguments.shift(); $target = $arguments.shift();
    }
  }
  else if($arguments.length === 3) {
    if(['number', 'string'].includes(typeof $arguments[0])) {
      $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = $arguments.shift();
    }
  }
  return { $sourceName, $source, $target }
}
function parseValidatePropertyArguments(...$arguments) {
  let [$key, $value, $source, $target] = $arguments;
  return { $key, $value, $source, $target }
}
function parseProperties($properties, $schema) {
  const properties = typedObjectLiteral($properties);
  if(isPropertyDefinition($properties, $schema)) { return $properties }
  for(const [
    $propertyKey, $propertyValue
  ] of Object.entries($properties)) {
    let propertyDefinition = {};
    typeOf($propertyValue);
    const propertyValueIsPropertyDefinition = isPropertyDefinition($propertyValue, $schema);
    if(variables.TypeValues.includes($propertyValue)) {
      Object.assign(propertyDefinition, { type: { value: $propertyValue } });
    }
    else if(variables.TypeKeys.includes($propertyValue)) {
      Object.assign(propertyDefinition, { type: { value: variables.Types[$propertyValue] } });
    }
    else if(!propertyValueIsPropertyDefinition) {
      const subpropertyPath = ($schema.path) ? [$schema.path, $propertyKey].join('.') : $propertyKey;
      Object.assign(propertyDefinition, {
        type: { type: 'type', value: new $schema.constructor($propertyValue, Object.assign({}, $schema.options, {
          parent: $schema,
          path: subpropertyPath
        })) }
      });
    }
    else if(propertyValueIsPropertyDefinition) {
      for(const [$propertyValidatorName, $propertyValidator] of Object.entries($propertyValue)) {
        const propertyValidatorIsValidatorDefinition = isValidatorDefinition($propertyValidator, $schema);
        if(!propertyValidatorIsValidatorDefinition) {
          let propertyValidator;
          if($propertyValidatorName === 'type') {
            if($propertyValidator && typeof $propertyValidator === 'object') {
              const subpropertyPath = ($schema.path) ? [$schema.path, $propertyKey].join('.') : $propertyKey;
              propertyValidator = new $schema.constructor($propertyValidator, Object.assign({}, $schema.options, {
                parent: $schema, 
                path: subpropertyPath,
              }));
            }
            else {
              propertyValidator = $propertyValidator;
            }
          }
          else {
            propertyValidator = $propertyValidator;
          }
          propertyDefinition[$propertyValidatorName] = {
            type: $propertyValidatorName, value: propertyValidator
          };
        }
        else if(propertyValidatorIsValidatorDefinition) {
          propertyDefinition[$propertyValidatorName] = $propertyValidator;
        }
      }
    }
    propertyDefinition.validators = [];
    properties[$propertyKey] = propertyDefinition;
    const validators = new Map();
    validators.set('type', Object.assign({}, {
      type: 'type', validator: TypeValidator, value: propertyDefinition.type.value
    }));
    validators.set('required', Object.assign({}, {
      type: 'required', validator: RequiredValidator, value: propertyDefinition.required?.value || false
    }));
    if(propertyDefinition.range) { validators.set('range', Object.assign({}, propertyDefinition.range, {
      type: 'range', validator: RangeValidator
    })); }
    else if(propertyDefinition.min || propertyDefinition.max) { validators.set('range', Object.assign({}, {
      type: 'range', min: propertyDefinition.min, max: propertyDefinition.max, validator: RangeValidator
    })); }
    if(propertyDefinition.length) { validators.set('length', Object.assign({}, propertyDefinition.length, {
      type: 'length', validator: LengthValidator
    })); }
    else if(propertyDefinition.minLength || propertyDefinition.maxLength) { validators.set('length', Object.assign({}, {
      type: 'length', min: propertyDefinition.minLength, max: maxLength, validator: LengthValidator
    })); }
    if(propertyDefinition.enum) { validators.set('enum', Object.assign({}, propertyDefinition.enum, {
      type: 'enum', validator: EnumValidator
    })); }
    if(propertyDefinition.match) { validators.set('match', Object.assign({}, propertyDefinition.match, {
      type: 'match', validator: MatchValidator
    })); }
    delete propertyDefinition.min;
    delete propertyDefinition.max;
    delete propertyDefinition.minLength;
    delete propertyDefinition.maxLength;
    for(const [
      $validatorName, $validatorSettings
    ] of validators.entries()) {
      const ValidatorClass = $validatorSettings.validator;
      propertyDefinition[$validatorName] = $validatorSettings;
      propertyDefinition.validators.push(new ValidatorClass($validatorSettings, $schema));
    }
  }
  return properties
}
function isPropertyDefinition($object, $schema) {
  if(!$object || $object instanceof Schema) { return false }
  const typeKey = $schema.options.properties.type;
  return Object.hasOwn($object, typeKey)
}
function isValidatorDefinition($object, $schema) {
  if(!$object) { return false }
  const valueKey = $schema.options.properties.value;
  return Object.hasOwn($object, valueKey)
}

const verificationTypes = ['all', 'one'];
var Options$2 = (...$options) => Object.assign({
  required: false,
  verificationType: verificationTypes[0], 
  strict: false,
  properties: {
    type: 'type',
    value: 'value',
  },
}, ...$options);

let Schema$1 = class Schema extends EventTarget {
  constructor($properties = {}, $options = {}) {
    super();
    Object.defineProperties(this, {
      'options': { value: Options$2($options) },
      'type': { value: typeOf$2($properties) },
      'parent': { configurable: true, get() {
        const { options } = this;
        const parent = (options.parent) ? options.parent : null;
        Object.defineProperty(this, 'parent', { value: parent });
        return parent
      } },
      'root': { configurable: true, get() {
        let root = this;
        iterateParents: 
        while(root) {
          if([undefined, null].includes(root.parent)) { break iterateParents }
          root = root.parent;
        }
        return root
      } },
      'key': { configurable: true, get() {
        const { path } = this;
        const key = (path) ? path.split('.').pop() : null;
        Object.defineProperty(this, 'key', { value: key });
        return key
      } },
      'path': { configurable: true, get() {
        const { options } = this;
        const path = (options.path)
          ? String(options.path)
          : null;
        Object.defineProperty(this, 'path', { value: path });
        return path
      } },
      'required': { configurable: true, get() {
        const required = this.options.required;
        Object.defineProperty(this, 'required', { value: required });
        return required
      } },
      'requiredProperties': { configurable: true, get() {
        const requiredProperties = typedObjectLiteral$2(this.type);
        for(const [$propertyKey, $propertyDefinition] of Object.entries(this.target)) {
          if($propertyDefinition.required?.value === true) {
            requiredProperties[$propertyKey] = $propertyDefinition;
          }
        }
        Object.defineProperty(this, 'requiredProperties', { value: Object.freeze(requiredProperties) });
        return requiredProperties
      } },
      'requiredPropertiesSize': { configurable: true, get() {
        const requiredPropertiesSize = Object.keys(this.requiredProperties).length;
        Object.defineProperty(this, 'requiredPropertiesSize', { value: requiredPropertiesSize });
        return requiredPropertiesSize
      } },
      'verificationType': { configurable: true, get() {
        const verificationType = this.options.verificationType;
        Object.defineProperty(this, 'verificationType', { value: verificationType });
        return verificationType
      } },
      'target': { configurable: true, get() {
        let properties;
        const type = this.type;
        if(type === 'array') { properties = $properties.slice(0, 1); }
        else if(type === 'object') { properties = $properties; }
        const target = parseProperties(properties, this);
        Object.defineProperty(this, 'target', { value: target });
        return target
      } },
      'validate': { value: function(...$arguments) {
        let { $sourceName, $source, $target } = parseValidateArguments(...$arguments);
        $target = $target || typedObjectLiteral$2($source);
        const { target, path, required, type, verificationType } = this;
        let validation = new Validation({
          required, verificationType,
          definition: target,
          key: $sourceName, 
          value: $source,
        }, this);
        const sourceProperties = Object.entries($source);
        let sourcePropertyIndex = 0;
        while(sourcePropertyIndex < sourceProperties.length) {
          const [$sourceKey, $sourceValue] = sourceProperties[sourcePropertyIndex];
          const propertyValidation = this.validateProperty($sourceKey, $sourceValue, $source, $target);
          if(propertyValidation.valid === true) { validation.advance.push(propertyValidation); } 
          else if(propertyValidation.valid === false) { validation.deadvance.push(propertyValidation); } 
          else if(propertyValidation.valid === undefined) { validation.unadvance.push(propertyValidation );}
          sourcePropertyIndex++;
        }
        if(validation.advance.length) { validation.valid = true; }
        else if(validation.deadvance.length) { validation.valid = false; }
        else if(validation.unadvance.length) { validation.valid = undefined; }
        else { validation.valid = true; }
        return validation
      } },
      'validateProperty': { value: function() {
        const { $key, $value, $source, $target } = parseValidatePropertyArguments(...arguments);
        const { target, path, required, schema, type, verificationType } = this;
        let propertyDefinition;
        if(type === 'array') { propertyDefinition = target[0]; }
        else if(type === 'object') { propertyDefinition = target[$key]; }
        const propertyValidation = new Validation({
          required,
          verificationType,
          definition: propertyDefinition,
          key: $key,
          value: $value,
        }, this);
        if(propertyDefinition === undefined) {
          const verification = new Verification({
            type: null,
            definition: null,
            key: $key,
            value: $value,
          }, this);
          verification.pass = false;
          propertyValidation.unadvance.push(verification);
        }
        else {
          iteratePropertyDefinitionValidators:
          for(const [$validatorIndex, $validator] of Object.entries(propertyDefinition.validators)) {
            const verification = $validator.validate($key, $value, $source, $target);
            if(verification.pass === true) { propertyValidation.advance.push(verification); }
            else if(verification.pass === false) { propertyValidation.deadvance.push(verification); }
            else if(verification.pass === undefined) { propertyValidation.unadvance.push(verification); }
            if(this.verificationType === 'one' && propertyValidation.deadvance.length) {
              break iteratePropertyDefinitionValidators
            }
          }
        }
        if(propertyValidation.deadvance.length) { propertyValidation.valid = false; }
        else if(propertyValidation.advance.length) { propertyValidation.valid = true; }
        else if(propertyValidation.unadvance.length) { propertyValidation.valid = false; }
        return propertyValidation
      } },
    });
  }
};

const {
  TypeValidators: TypeValidators$1, Tensors: Tensors$1, Getters: Getters$1, Setters: Setters$1, Deleters
} = tensors$1;

var tensors = {
  typeValidators: [TypeValidators$1.Object, TypeValidators$1.Map],
  getters: [Getters$1.Object, Getters$1.Map],
  setters: [Setters$1.Object, Setters$1.Map],
  deleters: [Deleters.Object, Deleters.Map],
};

// export default {
//   typeValidators: [ModelTypeValidator/*, TypeValidators.Object, TypeValidators.Map*/],
//   getters: [ModelGetter/*, Getters.Object, Getters.Map*/],
//   setters: [ModelSetter/*, Setters.Object, Setters.Map*/],
//   deleters: [ModelDeleter/*, Deleters.Object, Deleters.Map*/],
// }

const Methods = {
  map: {
    get: {
      mutatorEvents: {
        'get': true,
        'getProperty': true,
        'getProperty:$key': true,
      },
    },
    set: {
      recursive: true,
      mutatorEvents: {
        'set': true,
        'setProperty': true,
        'setProperty:$key': true,
      },
    },
    delete: {
      mutatorEvents: {
        'delete': true,
        'deleteProperty': true,
        'deleteProperty:$key': true,
      },
    },
  },
  array: {
    concat: {
      mutatorEvents: {
        'concatElement:$index': true,
        'concatElement': true,
        'concat': true,
      }
    },
    copyWithin: {
      mutatorEvents: {
        'copyWithinElement:$index': true,
        'copyWithinElement': true,
        'copyWithin': true,
      }
    },
    fill: {
      lengthen: true,
      mutatorEvents: {
        'fillElement:$index': true,
        'fillElement': true,
        'fill': true,
      }
    },
    pop: {
      mutatorEvents: { 'pop': true  },
    },
    push: {
      mutatorEvents: {
        'pushElement:$index': true,
        'pushElement': true,
        'push': true,
      }
    },
    reverse: {
      mutatorEvents: { 'reverse': true  },
    },
    shift: {
      mutatorEvents: { 'shift': true  },
    },
    splice: {
      mutatorEvents: {
        'spliceDeleteElement:$index': true,
        'spliceDeleteElement': true,
        'spliceAddElement:$index': true,
        'spliceAddElement': true,
        'splice': true,
      }
    },
    unshift: {
      mutatorEvents: {
        'unshiftElement:$index': true,
        'unshiftElement': true,
        'unshift': true,
      }
    },
  },
  object: {
    assign: {
      mutatorEvents: {
        'assignSourceProperty:$key': true,
        'assignSourceProperty': true,
        'assignSource': true,
        'assign': true,
      },
      sourceTree: true,
      targetTypedObjectLiteral: false,
    },
    defineProperties: {
      descriptorTree: true,
      mutatorEvents: { 'defineProperties': true },
    },
    defineProperty: {
      descriptorTree: true,
      mutatorEvents: {
        'defineProperty': true,
        'defineProperty:$key': true,
      },
    },
    freeze: {
      recursive: true,
      mutatorEvents: {
        'freezeProperty': true,
        'freeze': true,
      },
    },
    seal: {
      recursive: true,
      mutatorEvents: {
        'sealProperty': true,
        'seal': true,
      },
    },
    toString: {
      space: 0,
      replacer: null,
    },
  },
};
const PropertyAssignments = {
  object: 'set', 
  array: 'set', 
  map: 'set', 
  set: 'add', 
};
const ValidationEvents = {
  'validProperty:$key': true,
  'validProperty': true,
  'nonvalidProperty:$key': true,
  'nonvalidProperty': true,
};
var Options$1 = ($options) => assign$3({
  autoload: false, 
  autosave: false, 
  enableEvents: false,
  enableValidation: true, 
  localStorage: false, 
  methods: Methods,
  nonenumerable: false, 
  parent: null, 
  path: null, 
  pathkey: true,
  pathMatch: false, 
  pathParseInteger: false,
  propertyAssignments: PropertyAssignments,
  subpathError: false,
  tensors,
  validationEvents: ValidationEvents,
}, $options);

class ModelEvent extends CustomEvent {
  constructor($type, $settings, $model) {
    super($type, $settings);
    Object.defineProperties(this, {
      'model': { get () { return $model } },
      'key': { configurable: true, get () {
        const key = (this.path) ? this.path.split('.').pop() : null;
        Object.defineProperty(this, 'key', { value: key });
        return key
      } },
      'change': { configurable: true, get () {
        const change = $settings.change;
        Object.defineProperty(this, 'change', { value: change });
        return change
      } },
      'value': { configurable: true, get () {
        const value = $settings.value;
        Object.defineProperty(this, 'value', { value: value });
        return value
      } },
      'path': { configurable: true, get () {
        const path = $settings.path;
        Object.defineProperty(this, 'path', { value: path });
        return path
      } },
      'detail': { configurable: true, get () {
        const detail = $settings.detail;
        Object.defineProperty(this, 'detail', { value: detail });
        return detail
      } },
    });
  }
}

let ValidatorEvent$1 = class ValidatorEvent extends CustomEvent {
  constructor($type, $settings, $model) {
    super($type);
    Object.defineProperties(this, {
      'key': { configurable: true, get () {
        const key = $settings.key;
        Object.defineProperty(this, 'key', { value: key });
        return key
      } },
      'path': { configurable: true, get () {
        const path = ($model.path)
          ? [$model.path, $settings.key].join('.')
          : $settings.key;
        Object.defineProperty(this, 'path', { value: path });
        return path
      } },
      'value': { configurable: true, get () {
        const value = $settings.value;
        Object.defineProperty(this, 'value', { value: value, });
        return value
      } },
      'valid': { configurable: true, get () {
        const valid = $settings.valid;
        Object.defineProperty(this, 'valid', { value: valid });
        return valid
      } },
    });
  }
};

const { ObjectKeys } = variables$1;
const { TypeValidators, Tensors, Getters, Setters } = tensors$1;

function assign$1($model, $options, ...$sources) {
  // if(!$model) { return $model}
  const { path, schema, source, receiver, target, type } = $model;
  const options = Options$1($options);
  const {
    enableValidation, mutatorEvents, nonenumerable, propertyAssignments, 
    required, sourceTree, targetTypedObjectLiteral, tensors, validationEvents, 
  } = options;
  // const propertyAssignmentType = propertyAssignments[type]
  propertyAssignments[type] = 'assign';
  propertyAssignments.array;
  propertyAssignments.map;
  propertyAssignments.object;
  const getters = new Tensors(tensors.getters, tensors.typeValidators);
  const setters = new Tensors(tensors.setters, tensors.typeValidators);
  let validObject;
  if(schema && enableValidation) {
    validObject = schema.validate($source, $model.valueOf());
    validObject.report();
  }
  if(targetTypedObjectLiteral) {
    $sources.unshift(typedObjectLiteral$2($model.type));
  }
  iterateSources: 
  for(const $source of $sources) {
    typedObjectLiteral$2($source);
    if(!variables$1.ObjectKeys.includes(typeOf$2($source))) continue iterateSources
    const sourceEntries = entities($source, 'entries', { recurse: false });
    // const sourceEntries = Object.entries($source)
    iterateSourceEntries: 
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of sourceEntries) {
      // Try Objects
      try {
        const targetPropertyValue = getters.cess($model.target, $sourcePropertyKey);
        const typeOfModelPropertyValue = typeOf$2(targetPropertyValue);
        const typeOfSourcePropertyValue = typeOf$2($sourcePropertyValue);
        if(ObjectKeys.includes(typeOfSourcePropertyValue)) {
          const subschema = (schema) ? schema.target[$sourcePropertyKey] : null;
          // let subtarget = (targetTypedObjectLiteral)
          //   ? typedObjectLiteral(targetPropertyValue)
          //   : targetPropertyValue
          const subtarget = new $model.constructor(targetPropertyValue, subschema, options);
          if(sourceTree) {
            subtarget[propertyAssignments[subtarget.type]]($sourcePropertyValue);
            continue iterateSourceEntries
          }
        }
        throw new Error(null)
      }
      // Catch Primitives
      catch($err) {
        setters.cess($model.target, $sourcePropertyKey, $sourcePropertyValue);
      }
    }
  }
  return $model
}

class Change {
  #_keyter = false 
  #_preter = false 
  #_anter = false 
  #_conter = false
  #keyter
  #preter
  #anter
  #conter
  constructor($settings = {}) {
    for(const [$key, $value] of Object.entries($settings)) { this[$key] = $value; }
  }
  get preter() { return this.#preter }
  set preter($preter) {
    if(this.#_preter === true) { return this.#preter }
    this.#preter = $preter?.valueOf();
    this.#_preter = true;
  }
  get anter() { return this.#anter }
  set anter($anter) {
    if(this.#_anter === true) { return this.#anter }
    this.#anter = $anter?.valueOf();
    this.#_anter = true;
  }
  get conter() {
    if(
      this.#_conter === true ||
      [this.#_preter, this.#_anter].includes(false)
    ) { return this.#conter }
    const preter = JSON.stringify(this.preter);
    const anter = JSON.stringify(this.anter);
    let conter;
    if(anter !== preter) { conter = true; }
    else { conter = false; }
    this.#conter = conter;
    this.#_conter = true;
    return this.#conter
  }
}

function defineProperties($model, $options, $propertyDescriptors) {
  const { path, schema } = $model;
  let {
    enableValidation, mutatorEvents, required, 
    validation, validationEvents, validationReport
  } = $options;
  const propertyDescriptorEntries = Object.entries($propertyDescriptors);
  const definePropertiesChange = new Change({ preter: $model });
  for(const [
    $propertyKey, $propertyDescriptor
  ] of propertyDescriptorEntries) {
    $model.defineProperty($propertyKey, $propertyDescriptor, Object.assign({}, $options, {
      validation, validationReport
    }));
  }
  if(mutatorEvents && mutatorEvents['defineProperties']) {
    definePropertiesChange.anter = $model;
    $model.dispatchEvent(
      new ModelEvent(
        'defineProperties',
        {
          path,
          value: $model.valueOf(),
          detail: {
            descriptors: $propertyDescriptors,
          },
        },
        $model
      )
    );
  }
  return $model
}

function defineProperty($model, $options, $propertyKey, $propertyDescriptor) {
  const options = Object.assign({}, $options);
  const assignObject = 'defineProperties';
  const assignArray = options.assignArray || 'defineProperties';
  const {
    descriptorTree, enableValidation, mutatorEvents, 
    validation, validationEvents, validationReport
  } = options;
  const { receiver, path, schema } = $model;
  const propertyValue = $propertyDescriptor.value;
  const receiverPropertyDescriptor = Object.getOwnPropertyDescriptor(receiver, $propertyKey) || {};
  const receiverPropertyValue = receiverPropertyDescriptor.value;
  const definePropertyChange = new Change({ preter: receiverPropertyValue });
  const definePropertyKeyChange = new Change({ preter: receiverPropertyValue });
  const receiverPropertyValueIsModelInstance = receiverPropertyValue instanceof $model.constructor;
  if(schema && enableValidation) {
    const validProperty = schema.validateProperty(
      $propertyKey, 
      impand(propertyValue, 'value') || propertyValue,
      {},
      $model.valueOf()
    );
    if(validationEvents) {
      let type, propertyType;
      if(validProperty.valid) {
        type = 'validProperty';
        propertyType = ['validProperty', $propertyKey].join(':');
      }
      else {
        type = 'nonvalidProperty';
        propertyType = ['nonvalidProperty', $propertyKey].join(':');
      }
      for(const $eventType of [type, propertyType]) {
        $model.dispatchEvent(new ValidatorEvent$1($eventType, validProperty, $model));
      }
    }
    if(!validProperty.valid) { return $model }
  }
  if(propertyValue && typeof propertyValue === 'object') {
    const modelPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey);
    if(receiverPropertyValueIsModelInstance) {
      if(descriptorTree === true) {
        receiverPropertyValue.defineProperties($propertyDescriptor);
      }
      else {
        Object.defineProperty(receiver, $propertyKey, $propertyDescriptor);
      }
    }
    else {
      let subschema;
      if(schema) {
        if(schema.type === 'array') { subschema = schema.receiver[0].type.value; }
        else if(schema.type === 'object') { subschema = schema.receiver[$propertyKey].type.value; }
        else { subschema = undefined; }
      }
      let subreceiver = typedObjectLiteral$2(propertyValue);
      const suboptions = assign$3({}, options, {
        path: modelPath,
        parent: $model,
      });
      const submodel = new $model.constructor(
        subreceiver, subschema, suboptions
      );
      if(descriptorTree === true) {
        receiver[$propertyKey] = submodel;
        $model.retroReenableEvents();
        if(submodel.type === 'array') {
          if(['push', 'unshift'].includes(assignArray)) { submodel[assignArray](...propertyValue); }
          else { submodel[assignArray](propertyValue); }
        }
        else if(submodel.type === 'object') { submodel[assignObject](propertyValue); }
      }
      else if(descriptorTree === false) {
        Object.defineProperty(receiver, $propertyKey, $propertyDescriptor);
      }
    }
  }
  else {
    Object.defineProperty(receiver, $propertyKey, $propertyDescriptor);
  }
  if(mutatorEvents) {
    const modelEventPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey);
    if(mutatorEvents['defineProperty:$key']) {
      definePropertyKeyChange.anter = receiver[$propertyKey];
      const type = ['defineProperty', $propertyKey].join(':');
      $model.dispatchEvent(
        new ModelEvent(type, {
          path: modelEventPath,
          value: propertyValue,
          change: definePropertyKeyChange,
          detail: {
            prop: $propertyKey,
            descriptor: $propertyDescriptor,
          },
        }, $model
      ));
    }
    if(mutatorEvents['defineProperty']) {
      definePropertyChange.anter = receiver[$propertyKey];
      $model.dispatchEvent(
        new ModelEvent('defineProperty', {
          path: modelEventPath,
          value: propertyValue,
          change: definePropertyChange,
          detail: {
            prop: $propertyKey,
            descriptor: $propertyDescriptor,
          },
        }, $model
      ));
    }
  }
  return $model
}

function freeze($model, $options) {
  const { recursive, mutatorEvents } = $options;
  const { receiver } = $model;
  if(recursive === true) {
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(receiver)) {
      if($propertyValue instanceof $model.constructor) {
        $propertyValue.freeze();
        if(mutatorEvents && mutatorEvents['freezeProperty']) {
          $model.dispatchEvent(
            new ModelEvent(
              'freezeProperty',
              { path: $propertyValue.path },
              $model
            )
          );
        }
      }
    }
  }
  Object.freeze(receiver);
  if(mutatorEvents && mutatorEvents['freeze']) {
    $model.dispatchEvent(
      new ModelEvent(
        'freeze',
        { path: $model.path },
        $model
      )
    );
  }
  return $model
}

function seal($model, $options) {
  const { recursive, mutatorEvents } = $options;
  const { receiver } = $model;
  if(recursive === true) {
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(receiver)) {
      if($propertyValue instanceof $model.constructor) {
        $propertyValue.seal();
        if(mutatorEvents && mutatorEvents['sealProperty']) {
          $model.dispatchEvent(
            new ModelEvent(
              'sealProperty',
              { path: $propertyValue.path },
              $model
            )
          );
        }
      }
    }
  }
  Object.seal(receiver);
  if(mutatorEvents && mutatorEvents['seal']) {
    $model.dispatchEvent(
      new ModelEvent(
        'seal',
        { path: $model.path },
        $model
      )
    );
  }
  return $model
}

const Options = { space: 0, replacer: null, returnValue: 'target', nonenumerable: true };
function toString($model, $options) {
  const options = Object.assign({}, Options, $options);
  return JSON.stringify(
    $model.valueOf($model, options), options.replacer, options.space
  )
}

function valueOf($model) { return $model.target }

var ObjectMethods = {
  assign: assign$1,
  defineProperties,
  defineProperty,
  freeze,
  seal,
  toString,
  valueOf,
};

function concat($model, $options) {
  const { receiver, path, schema } = $model;
  const { enableValidation, mutatorEvents, source, validationEvents } = $options;
  const $arguments = [].concat(...arguments);
  let valueIndex = receiver.length;
  const values = [];
  let receiverConcat = [...Array.from(receiver)];
  let model;
  iterateValues: 
  for(let $value of $arguments) {
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf();
      const validatorSource = source || typedObjectLiteral$2(validatorTarget);
      const validValue = schema.validateProperty(valueIndex, $subvalue, validatorSource, validatorTarget);
      if(schema &&validationEvents) {
        let type, propertyType;
        if(validValue.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', valueIndex].join(':');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', valueIndex].join(':');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent$1($eventType, validValue, $model));
        }
      }
      if(!validValue.valid) { valueIndex++; continue iterateValues }
    }
    const modelPath = (path)
      ? [path, valueIndex].join('.')
      : String(valueIndex);
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf(); }
      let subschema = schema?.receiver[0].type.value || null;
      const submodel = typedObjectLiteral$2($value);
      let value = new $model.constructor(submodel, subschema, {
        path: modelPath,
        parent: $model,
      });
      value.concat($value);
      values[valueIndex] = value;
    }
    else {
      values[valueIndex] = $value;
    }
    receiverConcat = Array.prototype.concat.call(receiverConcat, values[valueIndex]);
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, valueIndex].join('.')
        : String(valueIndex);
      if(mutatorEvents['concatElement']) {
        $model.dispatchEvent(
          new ModelEvent('concatElement', {
            path: modelEventPath,
            value: values[valueIndex],
            detail: {
              valueIndex,
              value: values[valueIndex],
            },
          }, $model)
        );
      }
      if(mutatorEvents['concatElement:$index']) {
        $model.dispatchEvent(
          new ModelEvent('concatElement', {
            path: modelEventPath,
            value: values[valueIndex],
            detail: {
              valueIndex,
              value: values[valueIndex],
            },
          }, $model)
        );
      }
    }
    valueIndex++;
  }
  model = new $model.constructor(receiverConcat, schema, $model.options);
  if(mutatorEvents && mutatorEvents['concat']) {
    $model.dispatchEvent(
      new ModelEvent('concat', {
        path,
        detail: {
          values: model,
        },
      }, $model)
    );
  }
  return model
}

function copyWithin($model, $options) {
  const { receiver, path } = $model;
  const { enableValidation, validationEvents, mutatorEvents } = $options;
  const copyTarget = (
    arguments[0] >= 0
  ) ? arguments[0]
    : receiver.length = arguments[0];
  const start = (
    arguments[1] >= 0
  ) ? arguments[1]
    : receiver.length + arguments[1];
  const end = (
    arguments[2] === undefined
  ) ? receiver.length
    : (
    arguments[2] >= 0
  ) ? arguments[2]
    : receiver.length + arguments[2];
  const copiedItems = [];
  let copyIndex = start;
  let receiverIndex = copyTarget;
  while(copyIndex < end) {
    const copyItem = receiver[copyIndex];
    copiedItems.push(copyItem);
    Array.prototype.copyWithin.call(
      receiver,
      receiverIndex,
      copyIndex,
      copyIndex + 1
    );
    $model.retroReenableEvents();
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, copyIndex].join('.')
        : String(copyIndex);
      if(mutatorEvents['copyWithinElement']) {
        $model.dispatchEvent(
          new ModelEvent(
            'copyWithinElement',
            {
              path: modelEventPath,
              value: copyItem,
              detail: {
                receiver: receiverIndex,
                start: copyIndex,
                end: copyIndex + 1,
                item: copyItem,
              },
            },
            $model
          )
        );
      }
      if(mutatorEvents['copyWithinElement:$index']) {
        const type  = ['copyWithinElement', copyIndex].join(':');
        $model.dispatchEvent(
          new ModelEvent(
            type,
            {
              path: modelEventPath,
              value: copyItem,
              detail: {
                receiver: receiverIndex,
                start: copyIndex,
                end: copyIndex + 1,
                item: copyItem,
              },
            },
            $model
          )
        );
      }
    }
    copyIndex++;
    receiverIndex++;
  }
  // Array Copy Within Event
  if(mutatorEvents && mutatorEvents['copyWithin']) {
    $model.dispatchEvent(
      new ModelEvent(
        'copyWithin',
        {
          path,
          detail: {
            receiver: copyTarget,
            start: start,
            end: end,
            items: copiedItems,
          },
        },
        $model
      )
    );
  }
  return $model
}

function fill($model, $options, ...$arguments) {
  const options = Object.assign({}, $options);
  const { receiver, path, schema } = $model;
  const assignObject = options.assignObject;
  const assignArray = options.assignArray || assignObject;
  const { enableValidation, lengthen, mutatorEvents, validationEvents } = options;
  const filled = [];
  let $start;
  if(typeof $arguments[1] === 'number') {
    $start = ($arguments[1] >= 0)
      ? $arguments[1]
      : receiver.length + $arguments[1];
  }
  else { $start = 0; }
  let $end;
  if(typeof $arguments[2] === 'number') {
    $end = ($arguments[2] >= 0)
      ? $arguments[2]
      : receiver.length + $arguments[2];
  } else { $end = receiver.length; }
  if(lengthen && receiver.length < $end) { receiver.length = $end; }
  let fillIndex = $start;
  iterateFillIndexes: 
  while(
    fillIndex < receiver.length &&
    fillIndex < $end
  ) {
    if(schema && enableValidation) {
      let validValue = schema.validate(validValue, $model.valueOf());
      if(validationEvents) {
        let type, propertyType;
        if(validValue.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', fillIndex].join(':');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', fillIndex].join(':');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent$1($eventType, validValue, $model));
        }
      }
      if(!validValue.valid) { continue iterateFillIndexes }
    }
    const modelPath = (path)
      ? [path, fillIndex].join('.')
      : String(fillIndex);
    let $value = $arguments[0];
    let value;
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf(); }
      const subschema = schema?.receiver[0].type.value || null;
      const subproperties = typedObjectLiteral$2($value);
      const suboptions = Object.assign({}, options, {
        path: modelPath,
        parent: $model,
      });
      value = new $model.constructor(subproperties, subschema, suboptions);
    }
    Array.prototype.fill.call(receiver, value, fillIndex, fillIndex + 1);
    $model.retroReenableEvents();
    if(value.type === 'array') {
      if(['push', 'unshift'].includes(assignArray)) { value[assignArray](...$value); }
      else { value[assignArray]($value); }
    }
    else if(value.type === 'object') { value[assignObject]($value); }
    filled.push(value);
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, fillIndex].join('.')
        : String(fillIndex);
      if(mutatorEvents['fillElement']) {
        $model.dispatchEvent(
          new ModelEvent('fillElement', {
            path: modelEventPath, 
            value: value,
            detail: {
              start: fillIndex,
              end: fillIndex + 1,
              value,
            },
          }, $model)
        );
      }
      if(mutatorEvents['fillElement:$index']) {
        const type = ['fillElement', fillIndex].join(':');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            detail: {
              start: fillIndex,
              end: fillIndex + 1,
              value,
            },
          }, $model)
        );
      }
    }
    fillIndex++;
  }
  if(mutatorEvents && mutatorEvents['fill']) {
    $model.dispatchEvent(
      new ModelEvent('fill', {
        path,
        detail: {
          start: $start,
          end: $end,
          filled,
        },
      },
      $model)
    );
  }
  return $model
}

function pop($model, $options) {
  const { mutatorEvents } = $options;
  const { receiver, path } = $model;
  const popElement = Array.prototype.pop.call(receiver);
  const popElementIndex = receiver.length - 1;
  $model.retroReenableEvents();
  if(mutatorEvents && mutatorEvents['pop']) {
    const modelEventPath = (path)
      ? [path, popElementIndex].join('.')
      : String(popElementIndex);
      $model.dispatchEvent(
      new ModelEvent(
        'pop',
        {
          path: modelEventPath,
          value: popElement,
          detail: {
            elementIndex: popElementIndex,
            element: popElement,
          },
        },
        $model
      )
    );
  }
  return popElement
}

function push($model, $options, ...$elements) {
  const options = Object.assign({}, $options);
  const assignArray = 'push';
  const assignObject = options.assignObject;
  const { enableValidation, mutatorEvents, source, validationEvents } = options;
  const { receiver, path, schema } = $model;
  const elements = [];
  let elementsIndex = 0;
  for(let $element of $elements) {
    let element;
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf();
      const validatorSource = source || typedObjectLiteral$2(validatorTarget);
      const validElement = schema.validateProperty(elementsIndex, $element, validatorSource, validatorTarget);
      if(validationEvents) {
        let type, propertyType;
        if(validElement.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', elementsIndex].join(':');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', elementsIndex].join(':');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent$1($eventType, validElement, $model));
        }
      }
      if(!validElement.valid) { return receiver.length }
    }
    const modelPath = (path)
      ? [path, elementsIndex].join('.')
      : String(elementsIndex);
    if($element && typeof $element === 'object') {
      $element = ($element instanceof $model.constructor) ? $element.valueOf() : $element;
      const subschema = schema?.receiver[0].type.value || null;
      const subproperties = typedObjectLiteral$2(typeOf$2($element));
      const submodelOptions = Object.assign({}, options, {
        path: modelPath,
        parent: $model,
      });
      element = new $model.constructor(subproperties, subschema, submodelOptions);
      Array.prototype.push.call(receiver, element);
      $model.retroReenableEvents();
      if(element.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { element[assignArray](...$element); }
        else { element[assignArray]($element); }
      }
      else if(element.type === 'object') { element[assignObject]($element); }
    }
    else {
      element = $element;
      Array.prototype.push.call(receiver, element);
    }
    elements.push(element);
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, elementsIndex].join('.')
        : String(elementsIndex);
      if(mutatorEvents['pushElement']) {
        $model.dispatchEvent(
          new ModelEvent('pushElement', {
            path: modelEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $model)
        );
      }
      if(mutatorEvents['pushElement:$index']) {
        const type = ['pushElement', elementsIndex].join(':');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $model)
        );
      }
    }
    elementsIndex++;
  }
  if(mutatorEvents && mutatorEvents['push']) {
    $model.dispatchEvent(
      new ModelEvent('push', {
        path,
        detail: {
          elements,
        },
      }, $model)
    );
  }
  return receiver.length
}

function reverse($model, $options) {
  const { mutatorEvents } = $options;
  const { receiver, path } = $model;
  Array.prototype.reverse.call(receiver, ...arguments);
  $model.retroReenableEvents();
  if(mutatorEvents && mutatorEvents['reverse']) {
    $model.dispatchEvent(
      new ModelEvent(
        'reverse',
        {
          path,
          detail: {
            reference: receiver
          },
        },
        $model
      )
    );
  }
  return $model
}

function shift($model, $options) {
  const { mutatorEvents } = $options;
  const { receiver, path } = $model;
  const shiftElement = Array.prototype.shift.call(receiver);
  const shiftElementIndex = 0;
  $model.retroReenableEvents();
  if(mutatorEvents && mutatorEvents['shift']) {
    const modelEventPath = (path)
      ? [path, shiftElementIndex].join('.')
      : String(shiftElementIndex);
    $model.dispatchEvent(
      new ModelEvent(
        'shift',
        {
          path: modelEventPath,
          value: shiftElement,
          detail: {
            elementIndex: shiftElementIndex,
            element: shiftElement,
          },
        },
        $model
      )
    );
  }
  return shiftElement
}

function splice($model, $options) {
  const options = Object.assign({}, $options);
  const assignObject = options.assignObject;
  const assignArray = options.assignArray || assignObject;
  const { mutatorEvents, source } = options;
  const { receiver, path, schema } = $model;
  const { enableValidation, validationEvents } = options;
  const $arguments = [...arguments];
  const $start = ($arguments[0] >= 0)
    ? $arguments[0]
    : receiver.length + $arguments[0];
  const $deleteCount = ($arguments[1] <= 0)
    ? 0
    : (
      $arguments[1] === undefined ||
      $start + $arguments[1] >= receiver.length
    ) ? receiver.length - $start
      : $arguments[1];
  const $addItems = $arguments.slice(2);
  const addCount = $addItems.length;
  const deleteItems = [];
  let deleteItemsIndex = 0;
  while(deleteItemsIndex < $deleteCount) {
    const deleteItem = Array.prototype.splice.call(receiver, $start, 1)[0];
    deleteItems.push(deleteItem);
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, deleteItemsIndex].join('.')
        : String(deleteItemsIndex);
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
        );
      }
      if(mutatorEvents['spliceDeleteElement:$index']) {
        const type = ['spliceDeleteElement', deleteItemsIndex].join(':');
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
        );
      }
    }
    deleteItemsIndex++;
  }
  let addItemsIndex = 0;
  spliceAdd: 
  while(addItemsIndex < addCount) {
    let addItem = $addItems[addItemsIndex];
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf();
      const validatorSource = source || typedObjectLiteral$2(validatorTarget);
      const validAddItem = schema.validateProperty(elementIndex, element, validatorSource, validatorTarget);
      if(validationEvents) {
        let type, propertyType;
        if(validAddItem.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', addItemsIndex].join(':');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', addItemsIndex].join(':');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validAddItem, $model));
        }
      }
      if(!validAddItem.valid) { addItemsIndex++; continue spliceAdd }
    }
    const modelPath = (path)
      ? [path, addItemsIndex].join('.')
      : String(addItemsIndex);
    let startIndex = $start + addItemsIndex;
    if(addItem && typeof addItem === 'object') {
      if(addItem instanceof $model.constructor) { addItem = addItem.valueOf(); }
      const subschema = schema?.receiver[0].type.value || null;
      const subproperties = typedObjectLiteral$2(addItem);
      const suboptions = assign({}, options, {
        path: modelPath,
        parent: $model,
      });
      addItem = new $model.constructor(subproperties, subschema, suboptions);
      Array.prototype.splice.call(receiver, startIndex, 0, addItem);
      $model.retroReenableEvents();
      if(addItem.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { addItem[assignArray](...$value); }
        else { addItem[assignArray]($value); }
      }
      else if(addItem.type === 'object') { addItem[assignObject]($value); }
    }
    else {
      Array.prototype.splice.call(receiver, startIndex, 0, addItem);
    }
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, addItemsIndex].join('.')
        : String(addItemsIndex);
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
        );
      }
      if(mutatorEvents['spliceAddElement:$index']) {
        const type = ['spliceAddElement', addItemsIndex].join(':');
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
        );
      }
    }
    addItemsIndex++;
  }
  if(mutatorEvents && mutatorEvents['splice']) {
    $model.dispatchEvent(
      new ModelEvent('splice', {
        path,
        detail: {
          $start,
          deleted: deleteItems,
          added: $addItems,
          length: receiver.length,
        },
      },
      $model)
    );
  }
  return deleteItems
}

function unshift($model, $options, ...$elements) {
  const options = Object.assign({}, $options);
  const assignArray = 'unshift';
  const assignObject = options.assignObject;
  const { enableValidation, mutatorEvents, source, validationEvents } = options;
  const { receiver, path, schema } = $model;
  const elements = [];
  let elementsIndex = 0;
  for(let $element of $elements) {
    let element;
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf();
      const validatorSource = source || typedObjectLiteral$2(validatorTarget);
      const validElement = schema.validateProperty(elementsIndex, $element, validatorSource, validatorTarget);
      if(validationEvents) {
        let type, propertyType;
        if(validElement.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', elementsIndex].join(':');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', elementsIndex].join(':');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validElement, $model));
        }
      }
      if(!validElement.valid) { return receiver.length }
    }
    const modelPath = (path)
      ? [path, elementsIndex].join('.')
      : String(elementsIndex);
    if($element && typeof $element === 'object') {
      $element = ($element instanceof $model.constructor) ? $element.valueOf() : $element;
      const subschema = schema?.receiver[0].type.value || null;
      const subproperties = typedObjectLiteral$2(typeOf$2($element));
      const submodelOptions = Object.assign({}, options, {
        path: modelPath,
        parent: $model,
      });
      element = new $model.constructor(subproperties, subschema, submodelOptions);
      Array.prototype.unshift.call(receiver, element);
      $model.retroReenableEvents();
      if(element.type === 'array') { element[assignArray](...$element); }
      else if(element.type === 'object') { element[assignObject]($element); }
    }
    else {
      element = $element;
      Array.prototype.unshift.call(receiver, element);
    }
    elements.unshift(element);
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, elementsIndex].join('.')
        : String(elementsIndex);
      if(mutatorEvents['unshiftElement']) {
        $model.dispatchEvent(
          new ModelEvent('unshiftElement', {
            path: modelEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $model)
        );
      }
      if(mutatorEvents['unshiftElement:$index']) {
        const type = ['unshiftElement', elementsIndex].join(':');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $model)
        );
      }
    }
    elementsIndex++;
  }
  if(mutatorEvents && mutatorEvents['unshift']) {
    $model.dispatchEvent(
      new ModelEvent('unshift', {
        path,
        detail: {
          elements,
        },
      }, $model)
    );
  }
  return receiver.length
}

var ArrayMethods = {
  concat: concat,
  copyWithin: copyWithin,
  fill: fill,
  pop: pop,
  push: push,
  reverse: reverse,
  shift: shift,
  splice: splice,
  unshift: unshift,
};

function getContent($model, $options) {
  const { path } = $model;
  const { mutatorEvents } = $options;
  if(mutatorEvents && mutatorEvents['get']) {
    $model.dispatchEvent(
      new ModelEvent('get', {
        path,
        value: $model.valueOf(),
        detail: {
          value: $model.valueOf()
        }
      }, $model)
    );
  }
  return $model
}

function getContentProperty($model, $options, $path) {
  const { receiver, path } = $model;
  const { mutatorEvents, pathkey, subpathError, pathParseInteger } = $options;
  if(pathkey === true) {
    const subpaths = splitPath($path, pathParseInteger);
    const propertyKey = subpaths.shift();
    let propertyValue = receiver[propertyKey];
    if(subpaths.length) {
      if(subpathError === false && propertyValue === undefined) { return undefined }
      return propertyValue.get(subpaths.join('.'), $options)
    }
    if(mutatorEvents) {
      if(mutatorEvents['getProperty']) {
        $model.dispatchEvent(
          new ModelEvent('getProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        );
      }
      if(mutatorEvents['getProperty:$key']) {
        const type = ['getProperty', propertyKey].join(':');
        const _path = [path, propertyKey].join('.');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: _path,
            detail: {
              value: propertyValue,
            }
          }, $model)
        );
      }
    }
    return propertyValue
  }
  else if(pathkey === false) {
    const propertyValue = receiver[propertyKey];
    return propertyValue
  }
}

function getProperty($model, $options, ...$arguments) {
  let getProperty;
  const options = $options;
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { assign$3(options, $arguments[1]); }
    getProperty = getContentProperty($model, options, ...$arguments);
  }
  else {
    if($arguments.length === 1) { assign$3(options, $arguments[0]); }
    getProperty = getContent($model, options, ...$arguments);
  }
  return getProperty
}

function setContent($model, $options, $properties) {
  const { path, schema } = $model;
  let { enableValidation, mutatorEvents, required, validationEvents  } = $options;
  for(const [$propertyKey, $propertyValue] of Object.entries($properties)) {
    $model.set($propertyKey, $propertyValue, Object.assign($options, {
      source: $properties,
    }));
  }
  if(mutatorEvents && mutatorEvents['set']) {
    $model.dispatchEvent(
      new ModelEvent('set', {
        path,
        value: $model.valueOf(),
        detail: {
          value: $model.valueOf()
        }
      }, $model)
    );
  }
  return $model
}

function setContentProperty($model, $options, $path, $value) {
  const options = Object.assign({}, $options);
  const assignObject = 'set';
  const assignArray = options.assignArray || 'set';
  const { receiver, path, schema } = $model;
  const {
    enableValidation, mutatorEvents, pathkey, 
    pathParseInteger, recursive, subpathError, 
    validationEvents, source, 
  } = options;
  if(pathkey === true) {
    const subpaths = splitPath($path, pathParseInteger);
    const propertyKey = subpaths.shift();
    let propertyValue;
    const typeOfPropertyValue = typeOf$2($value);
    const modelPath = (path)
      ? [path, propertyKey].join('.')
      : String(propertyKey);
    if(subpaths.length) {
      if(recursive && receiver[propertyKey] === undefined) {
        let subschema;
        if(schema?.type === 'array') { subschema = schema.receiver[0].type.value; }
        else if(schema?.type === 'object') { subschema = schema.receiver[propertyKey].type.value; }
        else { subschema = undefined; }
        let submodel;
        if(typeOfPropertyValue === 'array') { submodel = []; }
        else if(typeOfPropertyValue === 'object') { submodel = {}; }
        else {
          if(isNaN(Number(propertyKey))) { submodel = {}; }
          else { submodel = []; }
        }
        const submodelOptions = assign$3({}, options, {
          path: modelPath,
          parent: $model,
        });
        propertyValue = new $model.constructor(submodel, subschema, submodelOptions);
      }
      else {
        propertyValue = receiver[propertyKey];
      }
      if(subpathError === false && propertyValue === undefined) { return undefined }
      if(propertyValue.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { propertyValue[assignArray](...$value); }
        else { propertyValue[assignArray]($value); }
      }
      else if(propertyValue.type === 'object') { propertyValue[assignObject](subpaths.join('.'), $value, options); }
      return propertyValue
    }
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf();
      const validatorSource = source || typedObjectLiteral$2(validatorTarget);
      const validTargetProp = schema.validateProperty(propertyKey, $value, validatorSource, validatorTarget);
      if(validationEvents) {
        let type, propertyType;
        if(validTargetProp.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', propertyKey].join(':');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', propertyKey].join(':');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent$1($eventType, validTargetProp, $model));
        }
      }
      if(!validTargetProp.valid) { return }
    }
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf(); }
      const typeOfPropertyValue= typeOf$2($value);
      let subschema;
      let submodel;
      if(schema?.type === 'array') { subschema = schema.receiver[0].type.value; }
      else if(schema?.type === 'object') { subschema = schema.receiver[propertyKey].type.value; }
      else { subschema = undefined; }
      if(typeOfPropertyValue === 'array') { submodel = []; }
      else if(typeOfPropertyValue === 'object') { submodel = {}; }
      else {
        if(isNaN(Number(propertyKey))) { submodel = {}; }
        else { submodel = []; }
      }
      const submodelOptions = assign$3({}, options, {
        path: modelPath,
        parent: $model,
      });
      propertyValue = new $model.constructor(submodel, subschema, submodelOptions);
      receiver[propertyKey] = propertyValue;
      $model.retroReenableEvents();
      if(propertyValue.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { propertyValue[assignArray](...$value); }
        else { propertyValue[assignArray]($value); }
      }
      else if(propertyValue.type === 'object') { propertyValue[assignObject]($value); }
    }
    else {
      propertyValue = $value;
      receiver[propertyKey] = propertyValue;
    }
    // const _propertyValue = (propertyValue === null) ? null : propertyValue.valueOf()
    const _propertyValue = propertyValue.valueOf();
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey);
      if(mutatorEvents['setProperty']) {
        $model.dispatchEvent(
          new ModelEvent('setProperty', {
            path: modelEventPath, 
            value: _propertyValue,
            detail: {
              key: propertyKey,
              value: _propertyValue,
            }
          }, $model)
        );
      }
      if(mutatorEvents['setProperty:$key']) {
        const type = ['setProperty', propertyKey].join(':');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            value: _propertyValue,
            detail: {
              value: _propertyValue,
            }
          }, $model)
        );
      }
    }
    return propertyValue
  }
  else if(pathkey === false) {
    let propertyKey = $path;
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf(); }
      const typeOfPropertyValue = typeOf$2($value);
      let subschema;
      let submodel;
      if(schema?.type === 'array') {
        subschema = schema.receiver[0].type.value;
      }
      if(schema?.type === 'object') {
        subschema = schema.receiver[propertyKey].type.value;
      }
      else { subschema = undefined; }
      if(typeOfPropertyValue === 'array') { submodel = []; }
      else if(typeOfPropertyValue === 'object') { submodel = {}; }
      else {
        if(isNaN(Number(propertyKey))) { submodel = {}; }
        else { submodel = []; }
      }
      const modelPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey);
      const submodelOptions = assign$3({}, options, {
        path: modelPath,
        parent: $model,
      });
      propertyValue = new $model.constructor(submodel, subschema, submodelOptions);
      receiver[propertyKey] = propertyValue;
      $model.retroReenableEvents();
      if(propertyValue.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { propertyValue[assignArray](...$value); }
        else { propertyValue[assignArray]($value); }
      }
      else if(propertyValue.type === 'object') { propertyValue[assignObject]($value); }
    }
    else {
      propertyValue = $value;
      receiver[propertyKey] = propertyValue;
    }
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey);
      if(mutatorEvents['setProperty']) {
        $model.dispatchEvent(
          new ModelEvent('setProperty', {
            path: modelEventPath, 
            value: _propertyValue,
            detail: {
              key: propertyKey,
              value: _propertyValue,
            },
          }, $model)
        );
      }
      if(mutatorEvents['setProperty:$key']) {
        const type = ['setProperty', propertyKey].join(':');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            value: _propertyValue,
            detail: {
              value: _propertyValue,
            }
          }, $model)
        );
      }
    }
    return propertyValue
  }
}

function setProperty($model, $options, ...$arguments) {
  let setProperty;
  const options = $options;
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 3) { assign$3(options, $arguments[2]); }
    setProperty = setContentProperty($model, options, ...$arguments);
  }
  else {
    if($arguments.length === 2) { assign$3(options, $arguments[1]); }
    setProperty = setContent($model, options, ...$arguments);
  }
  return setProperty
}

function deleteContent($model, $options) {
  const { receiver } = $model;
  for(const [$receiverPropertyKey, $receiverPropertyValue] of Object.entries(receiver)) {
    $model.delete($receiverPropertyKey, $options);
  }
  const { path } = $model;
  const { mutatorEvents } = $options;
  if(mutatorEvents && mutatorEvents['delete']) {
    $model.dispatchEvent(
      new ModelEvent('delete', {
        path,
        detail: {
          value: $model.valueOf()
        }
      }, $model)
    );
  }
  return $model
}

function deleteContentProperty($model, $options, $path) {
  const { receiver, path, schema } = $model;
  const { mutatorEvents, pathkey, subpathError, enableValidation, validationEvents } = $options;
  if(pathkey === true) {
    const subpaths = splitPath($path, pathParseInteger);
    const propertyKey = subpaths.shift();
    let propertyValue = receiver[propertyKey];
    if(subpaths.length) {
      if(subpathError === false && propertyValue === undefined) { return undefined }
      return propertyValue.delete(subpaths.join('.'), $options)
    }
    if(schema && enableValidation) {
      const differedPropertyProxy = $model.valueOf();
      delete differedPropertyProxy[propertyKey];
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, {}, $model.valueOf());
      if(validationEvents) {
        let type, propertyType;
        const validatorEventPath = (path)
          ? [path, propertyKey].join('.')
          : String(propertyKey);
        if(validTargetProp.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', propertyKey].join(':');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', propertyKey].join(':');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(
            new ValidatorEvent$1($eventType, Object.assign(validTargetProp, {
              path: validatorEventPath
            }), $model)
          );
        }
      }
      if(!validTargetProp.valid) { return }
    }
    if(propertyValue && typeof propertyValue === 'object') {
      propertyValue.delete($options);
    }
    delete receiver[propertyKey];
    if(mutatorEvents) {
      if(mutatorEvents['deleteProperty']) {
        $model.dispatchEvent(
          new ModelEvent('deleteProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        );
      }
      if(mutatorEvents['deleteProperty:$key']) {
        const type = ['deleteProperty', propertyKey].join(':');
        const _path = [path, propertyKey].join('.');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: _path,
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $model)
        );
      }
    }
    return undefined
  }
  else if(pathkey === false) {
    const propertyKey = $path;
    const propertyValue = receiver[propertyKey];

    if(schema && enableValidation) {
      const differedPropertyProxy = $model.valueOf();
      delete differedPropertyProxy[propertyKey];
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, $model.valueOf());
      if(validationEvents) {
        let type, propertyType;
        if(validTargetProp.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', propertyKey].join(':');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', propertyKey].join(':');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(
            new ValidatorEvent$1($eventType, validTargetProp, $model)
          );
        }
      }
      if(!validTargetProp.valid) { return }
    }
  
    if(propertyValue instanceof $model.constructor) {
      propertyValue.delete($options);
    }
    delete receiver[propertyKey];
    if(mutatorEvents) {
      if(mutatorEvents['deleteProperty']) {
        $model.dispatchEvent(
          new ModelEvent('deleteProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        );
      }
      if(mutatorEvents['deleteProperty:$key']) {
        const type = ['deleteProperty', propertyKey].join(':');
        const _path = [path, propertyKey].join('.');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: _path,
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $model)
        );
      }
    }
    return undefined
  }
}

function deleteProperty($model, $options, ...$arguments) {
  let deleteProperty;
  const options = $options;
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { assign$3(options, $arguments[1]); }
    deleteProperty = deleteContentProperty($model, options, ...$arguments);
  }
  else {
    if($arguments.length === 1) { assign$3(options, $arguments[0]); }
    deleteProperty = deleteContent($model, options, ...$arguments);
  }
  return deleteProperty
}

// import clearProperties from './clear-properties/index.js'
var MapMethods = {
  // clear: clearProperties,
  get: getProperty,
  set: setProperty,
  delete: deleteProperty,
};

freeze$1({
  // -----
  // Array
  // -----
  array: [
    // {
    //   type: 'mutators', 
    //   methodNames: Object.keys(ArrayMethods), 
    //   /* methodNames: ['concat', 'copyWithin', 'fill', 'pop', 'push',
    //   'reverse', 'shift', 'sort', 'splice', 'unshift',] */
    //   methodDescriptor: function($methodName, $model, $options) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty(
    //         $model, $methodName, ArrayMethods[$methodName].bind(null, $model, $options)
    //       )[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'accessors', 
    //   methodNames: [
    //     'at', 'includes', 'indexOf', 'join', 'lastIndexOf', 
    //     'slice', 'toReversed', 'toSorted', 'toSpliced', 'with', 
    //   ],
    //   methodDescriptor: function($methodName, $model) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty(
    //         $model, $methodName, Array.prototype[$methodName].bind(null, $model)
    //       )[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'iterators', 
    //   methodNames: [
    //     'every', 'filter', 'find', 'findIndex', 'findLast',
    //     'findLastIndex', 'flat', 'flatMap', 'forEach', 'map', 
    //     'reduce', 'reduceRight', 'some', 'sort',   
    //   ], 
    //   methodDescriptor: function($methodName, $model) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty(
    //         $model, $methodName, Array.prototype[$methodName].bind(null, $model)
    //       )[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'static', 
    //   methodNames: ['from', 'fromAsync', 'isArray', 'of'], 
    //   methodDescriptor: function($methodName, $model) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty(
    //         $model, $methodName, Array[$methodName]
    //       )[$methodName]
    //     } }
    //   }, 
    // },
    // {
    //   type: 'properties', 
    //   methodNames: ['length'], 
    //   methodDescriptor: function($propertyName, $model, $options) {
    //     return {
    //       get() { return $model.receiver.length },
    //       set($propertyValue) { $model.receiver.length = $propertyValue },
    //     }
    //   },
    // },
  ],
  // ------
  // Object
  // ------
  object: [
    // {
    //   type: 'mutators',
    //   /* methodNames: [
    //     'assign', 'defineProperties', 'defineProperty', 'freeze', 'seal',
    //     'toString', 'valueOf',
    //   ], */
    //   methodNames: Object.keys(ObjectMethods), 
    //   methodDescriptor: function($methodName, $model, $options) {
    //     return { configurable: true, get() {
          
    //       return Object.defineProperty($model, $methodName, {
    //         value: ObjectMethods[$methodName].bind(null, $model, $options)
    //       })[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'mutators',
    //   methodNames: ['preventExtensions', 'setPrototypeOf'],
    //   methodDescriptor: function($methodName, $model) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty($model, $methodName, {
    //         value: Object[$methodName].bind(null, $model.valueOf())
    //       })[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'creators',
    //   methodNames: ['create', 'fromEntries', 'groupBy'],
    //   methodDescriptor: function($methodName, $model, $options) {
    //     return { configurable: true, get() {
    //       return Object.defineProperty($model, $methodName, {
    //         value: Object[$methodName].bind(null, $model, $options)
    //       })[$methodName]
    //     } }
    //   },
    // },
    // {
    //   type: 'accessors', 
    //   methodNames: ['toString', 'valueOf'],
    //   methodDescriptor: function($methodName, $model, $options) {
    //     return { value: ObjectMethods[$methodName].bind(null, $model, $options) }
    //   },
    // },
    // {
    //   type: 'accessors',
    //   methodNames: [
    //     'entries', 'getOwnPropertyDescriptors', 'getOwnPropertyDescriptor', 
    //     'getOwnPropertyNames', 'getPrototypeOf', 
    //     'hasOwn', 'is', 'isExtensible', 'isFrozen', 'isSealed', 
    //     'keys', 'toLocaleString', 'values',
    //   ],
    //   methodDescriptor: function($methodName, $model) {
    //     return 
    //   },
    // },
  ],
  // ---
  // Map
  // ---
  // map: [
  //   {
  //     type: 'mutators',
  //     /* methodNames: ['delete', 'get', 'set', 'clear'], */
  //     methodNames: Object.keys(MapMethods),
  //     methodDescriptor: function($methodName, $model, $options) {
  //       return { value: MapMethods[$methodName].bind(null, $model, $options) }
  //     },
  //   }, 
  // ]
});

function modelOptions($model, $methodDefinitionGroup, $methodName) {
  const methodOptions = Object.assign({}, $model.options, $model.options.methods[$methodDefinitionGroup][$methodName]);
  delete methodOptions.methods;
  return methodOptions
}
class Model extends Core {
  constructor($properties = {}, $schema = null, $options = {}) {
    super();
    if($properties instanceof Model) { $properties = $properties.valueOf(); }
    let parent = null;
    let path = null;
    try {
      Object.defineProperty(this, 'mount', { value: function($mount) {
        const mountParent = $mount.parent;
        const mountPath = $mount.path;
        const property = (mountPath) ? mountPath.split('.').pop() : mountPath;
        if(parent) { parent.unmount(property); }
        parent = mountParent;
        path = mountPath;
      } });
    }
    catch($err) { console.error($err); }
    try {
      Object.defineProperty(this, 'unmount', { value: function($unmount) {
        const unmountPath = $unmount.path;
        delete this[$property];
      } });
    }
    catch($err) { console.error($err); }
    Object.defineProperties(this, {
      'key': { get() { return (path) ? path.pop() : path } },
      'options': { configurable: true, get() {
        const options = Options$1($options);
        if(options.events) {
          this.addEvents(options.events);
          delete options.events;
        }
        if(options.enableEvents) {
          const typeofEnableEvents = typeof options.enableEvents;
          if(typeofEnableEvents === 'boolean') { this.enableEvents(); }
          else if(typeofEnableEvents === 'object') { this.enableEvents(options.enableEvents); }
        }
        Object.defineProperty(this, 'options', { value: options });
        return options
      } },
      'parent': { get() { return parent } },
      'path': { get() { return path } },
      'receiver': { value: typedObjectLiteral$2($properties) },
      'schema': { configurable: true, get() {
        const typeOfSchema = typeOf$2($schema);
        let schema;
        if(['undefined', 'null'].includes(typeOfSchema)) { schema = null; }
        else if($schema instanceof Schema$1) { schema = $schema; }
        else if(['array', 'object'].includes(typeOfSchema)) { schema = new Schema$1($schema); }
        Object.defineProperty(this, 'schema', { value: schema });
        return schema
      } },
      'target': { value: $properties },
      'type': { configurable: true, get() {
        const type = typeOf$2(this.receiver);
        Object.defineProperty(this, 'type', { value: type });
        return type
      } },
    });
    this.mount({
      parent: this.options.parent,
      path: this.options.path
    });
    if(localStorage && this.options.localStorage) {
      Object.defineProperties(this,  {
        'localStorage': { configurable: true, get() {
          let _localStorage;
          let path = [window.location.pathname];
          if(this.path) { path.push(this.path); }
          path = path.join('');
          _localStorage = new LocalStorageRoute(path, this.options.localStorage);
          Object.defineProperty(this, 'localStorage', { value: _localStorage });
          return _localStorage
        } },
        'save': { value: function save() {
          return this.localStorage.set(this.valueOf())
        } },
        'load': { value: function load() {
          return this.localStorage.get()
        } },
        'unload': { value: function unload() {
          return this.localStorage.remove()
        } },
      });
    }
    // DefineMethods(this)
    // if(this.options.autoload) {
    //   Assign(this, this.load() || $properties, this.options)
    // }
    // else {
    //   Assign(this, $properties, this.options)
    // }
  }
  retroReenableEvents() {
    let model = this;
    while(model) {
      model.reenableEvents({ enable: true });
      model = model.parent;
    }
    return this
  }
  // ARRAY | mUTATORS
  get concat() { return Object.defineProperty(
    this, 'concat', ArrayMethods['concat'].bind(null, this, modelOptions(this, 'array', 'concat'))
  )['concat'] }
  get copyWithin() { return Object.defineProperty(
    this, 'copyWithin', ArrayMethods['copyWithin'].bind(null, this, modelOptions(this, 'array', 'copyWithin'))
  )['copyWithin'] }
  get fill() { return Object.defineProperty(
    this, 'fill', ArrayMethods['fill'].bind(null, this, modelOptions(this, 'array', 'fill'))
  )['fill'] }
  get pop() { return Object.defineProperty(
    this, 'pop', ArrayMethods['pop'].bind(null, this, modelOptions(this, 'array', 'pop'))
  )['pop'] }
  get push() { return Object.defineProperty(
    this, 'push', ArrayMethods['push'].bind(null, this, modelOptions(this, 'array', 'push'))
  )['push'] }
  get reverse() { return Object.defineProperty(
    this, 'reverse', ArrayMethods['reverse'].bind(null, this, modelOptions(this, 'array', 'reverse'))
  )['reverse'] }
  get shift() { return Object.defineProperty(
    this, 'shift', ArrayMethods['shift'].bind(null, this, modelOptions(this, 'array', 'shift'))
  )['shift'] }
  get sort() { return Object.defineProperty(
    this, 'sort', ArrayMethods['sort'].bind(null, this, modelOptions(this, 'array', 'sort'))
  )['sort'] }
  get splice() { return Object.defineProperty(
    this, 'splice', ArrayMethods['splice'].bind(null, this, modelOptions(this, 'array', 'splice'))
  )['splice'] }
  get unshift() { return Object.defineProperty(
    this, 'unshift', ArrayMethods['unshift'].bind(null, this, modelOptions(this, 'array', 'unshift'))
  )['unshift'] }
    // ARRAY | ACCESSORS
  get at() { return Object.defineProperty(
    this, 'at', Array.prototype['at'].bind(null, this)
  )['at'] }
  get includes() { return Object.defineProperty(
    this, 'includes', Array.prototype['includes'].bind(null, this)
  )['includes'] }
  get indexOf() { return Object.defineProperty(
    this, 'indexOf', Array.prototype['indexOf'].bind(null, this)
  )['indexOf'] }
  get join() { return Object.defineProperty(
    this, 'join', Array.prototype['join'].bind(null, this)
  )['join'] }
  get lastIndexOf() { return Object.defineProperty(
    this, 'lastIndexOf', Array.prototype['lastIndexOf'].bind(null, this)
  )['lastIndexOf'] }
  get slice() { return Object.defineProperty(
    this, 'slice', Array.prototype['slice'].bind(null, this)
  )['slice'] }
  get toReversed() { return Object.defineProperty(
    this, 'toReversed', Array.prototype['toReversed'].bind(null, this)
  )['toReversed'] }
  get toSorted() { return Object.defineProperty(
    this, 'toSorted', Array.prototype['toSorted'].bind(null, this)
  )['toSorted'] }
  get toSpliced() { return Object.defineProperty(
    this, 'toSpliced', Array.prototype['toSpliced'].bind(null, this)
  )['toSpliced'] }
  get with() { return Object.defineProperty(
    this, 'with', Array.prototype['with'].bind(null, this)
  )['with'] }
  //   ARRAY | ITERATORS
  get every() { return Object.defineProperty(
    this, 'every', Array.prototype['every'].bind(null, this)
  )['every'] }
  get filter() { return Object.defineProperty(
    this, 'filter', Array.prototype['filter'].bind(null, this)
  )['filter'] }
  get find() { return Object.defineProperty(
    this, 'find', Array.prototype['find'].bind(null, this)
  )['find'] }
  get findIndex() { return Object.defineProperty(
    this, 'findIndex'.prototype[$methodName].bind('findIndex', this)
  )['findIndex'] }
  get findLast() { return Object.defineProperty(
    this, 'findLast'.prototype[$methodName].bind('findLast', this)
  )['findLast'] }
  get findLastIndex() { return Object.defineProperty(
    this, 'findLastIndex'.prototype[$methodName].bind('findLastIndex', this)
  )['findLastIndex'] }
  get flat() { return Object.defineProperty(
    this, 'flat', Array.prototype['flat'].bind(null, this)
  )['flat'] }
  get flatMap() { return Object.defineProperty(
    this, 'flatMap'.prototype[$methodName].bind('flatMap', this)
  )['flatMap'] }
  get forEach() { return Object.defineProperty(
    this, 'forEach'.prototype[$methodName].bind('forEach', this)
  )['forEach'] }
  get map() { return Object.defineProperty(
    this, 'map', Array.prototype['map'].bind(null, this)
  )['map'] }
  get reduce() { return Object.defineProperty(
    this, 'reduce', Array.prototype['reduce'].bind(null, this)
  )['reduce'] }
  get reduceRight() { return Object.defineProperty(
    $model, this, 'reduceRight'.prototype[$methodName].bind('reduceRight', this)
  )['reduceRight'] }
  get some() { return Object.defineProperty(
    this, 'some', Array.prototype['some'].bind(null, this)
  )['some'] }
  get sort() { return Object.defineProperty(
    this, 'sort', Array.prototype['sort'].bind(null, this)
  )['sort'] }
  // ARRAY | STATIC
  get from() { return Object.defineProperty(
    this, 'from', Array['from']
  )['from'] }
  get fromAsync() { return Object.defineProperty(
    this, 'fromAsync', Array['fromAsync']
  )['fromAsync'] }
  get isArray() { return Object.defineProperty(
    this, 'isArray', Array['isArray']
  )['isArray'] }
  get of() { return Object.defineProperty(
    this, 'of', Array['of']
  )['of'] }
  get length() { return this.receiver.length }
  set length($length) { this.receiver.length = $length; }
  // OBJECT | mUTATORS
  get assign() { return Object.defineProperty(this, 'assign', {
    value: ObjectMethods['assign'].bind(null, this, modelOptions(this, 'object', 'assign'))
  })['assign'] }
  get defineProperties() { return Object.defineProperty(this, 'defineProperties', {
    value: ObjectMethods['defineProperties'].bind(null, this, modelOptions(this, 'object', 'defineProperties'))
  })['defineProperties'] }
  get defineProperty() { return Object.defineProperty(this, 'defineProperty', {
    value: ObjectMethods['defineProperty'].bind(null, this, modelOptions(this, 'object', 'defineProperty'))
  })['defineProperty'] }
  get freeze() { return Object.defineProperty(this, 'freeze', {
    value: ObjectMethods['freeze'].bind(null, this, modelOptions(this, 'object', 'freeze'))
  })['freeze'] }
  get seal() { return Object.defineProperty(this, 'seal', {
    value: ObjectMethods['seal'].bind(null, this, modelOptions(this, 'object', 'seal'))
  })['seal'] }
  get toString() { return Object.defineProperty(this, 'toString', {
    value: ObjectMethods['toString'].bind(null, this, modelOptions(this, 'object', 'toString'))
  })['toString'] }
  get valueOf() { return Object.defineProperty(this, 'valueOf', {
    value: ObjectMethods['valueOf'].bind(null, this, modelOptions(this, 'object', 'valueOf'))
  })['valueOf'] }
  // OBJECT | MUTATORS
  get preventExtensions() { return Object.defineProperty(this, 'preventExtensions', {
    value: Object['preventExtensions'].bind(null, this.valueOf())
  })['preventExtensions'] }
  get setPrototypeOf() { return Object.defineProperty(this, 'setPrototypeOf', {
    value: Object['setPrototypeOf'].bind(null, this.valueOf())
  })['setPrototypeOf'] }
  // OBJECT | CREATORS
  get create() { return Object.defineProperty(this, 'create', {
    value: Object['create'].bind(null, this, modelOptions(this, 'object', 'create'))
  })['create'] }
  get fromEntries() { return Object.defineProperty(this, 'fromEntries', {
    value: Object['fromEntries'].bind(null, this, modelOptions(this, 'object', 'fromEntries'))
  })['fromEntries'] }
  get groupBy() { return Object.defineProperty(this, 'groupBy', {
    value: Object['groupBy'].bind(null, this, modelOptions(this, 'object', 'groupBy'))
  })['groupBy'] }
  // OBJECT | ACCESSORS
  get entries() { return Object.defineProperty(this, 'entries', {
    value: Object['entries'].bind(null, this.valueOf()) } 
  )['entries'] }
  get getOwnPropertyDescriptors() { return Object.defineProperty(this, 'getOwnPropertyDescriptors', {
    value: Object['getOwnPropertyDescriptors'].bind(null, this.valueOf()) } 
  )['getOwnPropertyDescriptors'] }
  get getOwnPropertyDescriptor() { return Object.defineProperty(this, 'getOwnPropertyDescriptor', {
    value: Object['getOwnPropertyDescriptor'].bind(null, this.valueOf()) } 
  )['getOwnPropertyDescriptor'] }
  get getOwnPropertyNames() { return Object.defineProperty(this, 'getOwnPropertyNames', {
    value: Object['getOwnPropertyNames'].bind(null, this.valueOf()) } 
  )['getOwnPropertyNames'] }
  get getPrototypeOf() { return Object.defineProperty(this, 'getPrototypeOf', {
    value: Object['getPrototypeOf'].bind(null, this.valueOf()) } 
  )['getPrototypeOf'] }
  get hasOwn() { return Object.defineProperty(this, 'hasOwn', {
    value: Object['hasOwn'].bind(null, this.valueOf()) } 
  )['hasOwn'] }
  get is() { return Object.defineProperty(this, 'is', {
    value: Object['is'].bind(null, this.valueOf()) } 
  )['is'] }
  get isExtensible() { return Object.defineProperty(this, 'isExtensible', {
    value: Object['isExtensible'].bind(null, this.valueOf()) } 
  )['isExtensible'] }
  get isFrozen() { return Object.defineProperty(this, 'isFrozen', {
    value: Object['isFrozen'].bind(null, this.valueOf()) } 
  )['isFrozen'] }
  get isSealed() { return Object.defineProperty(this, 'isSealed', {
    value: Object['isSealed'].bind(null, this.valueOf()) } 
  )['isSealed'] }
  get keys() { return Object.defineProperty(this, 'keys', {
    value: Object['keys'].bind(null, this.valueOf()) } 
  )['keys'] }
  get toLocaleString() { return Object.defineProperty(this, 'toLocaleString', {
    value: Object['toLocaleString'].bind(null, this.valueOf()) } 
  )['toLocaleString'] }
  get values() { return Object.defineProperty(this, 'values', {
    value: Object['values'].bind(null, this.valueOf()) } 
  )['values'] }
  // MAP
  get delete() { return Object.defineProperty(this, 'delete', {
    value: MapMethods['delete'].bind(null, this, modelOptions(this, 'map', 'delete'))
  })['delete'] }
  get get() { return Object.defineProperty(this, 'get', {
    value: MapMethods['get'].bind(null, this, modelOptions(this, 'map', 'get'))
  })['get'] }
  get set() { return Object.defineProperty(this, 'set', {
    value: MapMethods['set'].bind(null, this, modelOptions(this, 'map', 'set'))
  })['set'] }
  get clear() { return Object.defineProperty(this, 'clear', {
    value: MapMethods['clear'].bind(null, this, modelOptions(this, 'map', 'clear'))
  })['clear'] }
}

export { Model, Schema$1 as Schema, Validation, Validator, Verification };
//# sourceMappingURL=objecture.sans.interdependencies.js.map
