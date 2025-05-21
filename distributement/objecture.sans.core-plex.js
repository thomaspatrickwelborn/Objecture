import { Coutil, Core } from 'core-plex';

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

const { typedObjectLiteral: typedObjectLiteral$d } = Coutil;
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
    const _report = typedObjectLiteral$d(schema.type);
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
    const _report = typedObjectLiteral$d(schema.type);
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

const { recursiveAssign: recursiveAssign$e } = Coutil;
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
            messages: recursiveAssign$e({}, messages, definition.messages),
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

const { recursiveAssign: recursiveAssign$d, typedObjectLiteral: typedObjectLiteral$c } = Coutil;
class RequiredValidator extends Validator {
  constructor($definition, $schema) {
    super(Object.assign({}, $definition, {
      type: 'required',
      validate: ($key, $value, $source, $target) => {
        const { requiredProperties, requiredPropertiesSize, type } = $schema;
        const corequiredProperties = Object.assign({}, requiredProperties);
        let corequiredPropertiesSize = requiredPropertiesSize;
        Object.assign(typedObjectLiteral$c(type), $source, $target);
        this.definition;
        let pass;
        if(!requiredPropertiesSize) { pass = true; }
        else {
          if(Object.hasOwn(corequiredProperties, $key)) {
            delete corequiredProperties[$key];
            corequiredPropertiesSize--;
          }
          if(corequiredPropertiesSize) {
            const coschema = new Schema(corequiredProperties, {
              path: $schema.path,
              parent: $schema.parent,
            });
            const comodel = Object.assign({}, $target, $source);
            const covalidation = coschema.validate(comodel);
            pass = covalidation.valid;
          }
        }
        return pass
      }
    }), $schema);
  }
}

const { typeOf: typeOf$5, variables: variables$1 } = Coutil;
const { ObjectKeys, TypeKeys } = variables$1;
class TypeValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign({}, $definition, {
      type: 'type',
      validate: ($key, $value, $source, $target) => {
        let pass;
        const definition = this.definition;
        let typeOfDefinitionValue = typeOf$5(definition.value);
        if(typeOfDefinitionValue === 'function') {
          typeOfDefinitionValue = typeOf$5(definition.value());
        }
        else if(definition.value instanceof Schema) {
          typeOfDefinitionValue = definition.value.type;
        }
        else {
          typeOfDefinitionValue = typeOf$5(definition.value);
        }
        if(TypeKeys.includes(typeOfDefinitionValue)) {
          const typeOfValue = typeOf$5($value);
          if(typeOfValue === 'undefined') { pass = false; }
          else if(typeOfDefinitionValue === 'undefined') { pass = true; }
          else if(definition.value instanceof Schema) {
            const validation = definition.value.validate($value, $source);
            pass = validation;
          }
          else { pass = (typeOfDefinitionValue === typeOfValue); }
        }
        else { pass = false; }
        return pass
      },
    }), $schema);
  }
}

class RangeValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign($definition, {
      type: 'range',
      validate: ($key, $value) => {
        const definition = this.definition;
        let pass;
        if(typeof $value !== 'number') { pass = false; }
        else {
          const { min, max } = definition;
          let validMin, validMax;
          if(min !== undefined) { validMin = ($value >= min.value); }
          else { validMin = true; }
          if(max !== undefined) { validMax = ($value <= max.value); }
          else { validMax = true; }
          if(validMin && validMax) { pass = true; }
          else { pass = false;}
        }
        return pass
      }
    }), $schema);
  }
}

class LengthValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign($definition, {
      type: 'length',
      validate: ($key, $value) => {
        const definition = this.definition;
        let pass;
        if(typeof $value !== 'string') { pass = false; }
        else {
          const { min, max } = definition;
          let validMin, validMax;
          if(min !== undefined) {
            validMin = ($value.length >= min.value);
          }
          else { validMin = true; }
          if(max !== undefined) {
            validMax = ($value.length <= max.value);
          }
          else { validMax = true; }
          if(validMin && validMax) { pass = true; }          
          else { pass = false;}
        }
        return pass
      },
    }), $schema);
  }
}

class EnumValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign($definition, {
      type: 'enum',
      validate: ($key, $value) => {
        const definition = this.definition;
        let pass;
        if(![
          'string', 'number', 'boolean'
        ].includes(typeof $value)) { pass = false;}
        else {
          const enumeration = definition.value;
          pass = enumeration.includes($value);
        }
        return pass
      },
    }), $schema);
  }
}

class MatchValidator extends Validator {
  constructor($settings = {}, $schema) {
    super(Object.assign($settings, {
      type: 'match',
      validate: ($key, $value) => {
        const definition = this.settings;
        let pass;
        if(![
          'string', 'number', 'boolean'
        ].includes(typeof $value)) { pass = false;}
        else {
          const match = definition;
          (match.value.exec($value) !== null);
        }
        return pass ? true : false
      },
    }), $schema);
  }
}

const { recursiveAssign: recursiveAssign$c } = Coutil;
var Options$1 = (...$options) => Object.assign({
  required: false,
  verificationType: 'all', 
  // verificationType: 'one',
  strict: false,
  properties: {
    type: 'type',
    value: 'value',
  },
}, ...$options);

const { typedObjectLiteral: typedObjectLiteral$b, typeOf: typeOf$4, variables } = Coutil;

class Schema extends EventTarget {
  constructor($properties = {}, $options = {}) {
    super();
    Object.defineProperties(this, {
      'options': { value: Options$1($options) },
      'type': { value: typeOf$4($properties) },
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
        const requiredProperties = typedObjectLiteral$b(this.type);
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
        $target = $target || typedObjectLiteral$b($source);
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
}
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
  const properties = typedObjectLiteral$b($properties);
  if(_isPropertyDefinition($properties, $schema)) { return $properties }
  for(const [
    $propertyKey, $propertyValue
  ] of Object.entries($properties)) {
    let propertyDefinition = {};
    typeOf$4($propertyValue);
    const isPropertyDefinition = _isPropertyDefinition($propertyValue, $schema);
    if(variables.TypeValues.includes($propertyValue)) {
      Object.assign(propertyDefinition, { type: { value: $propertyValue } });
    }
    else if(variables.TypeKeys.includes($propertyValue)) {
      Object.assign(propertyDefinition, { type: { value: variables.Types[$propertyValue] } });
    }
    else if(!isPropertyDefinition) {
      const subpropertyPath = ($schema.path) ? [$schema.path, $propertyKey].join('.') : $propertyKey;
      Object.assign(propertyDefinition, {
        type: { type: 'type', value: new Schema($propertyValue, Object.assign({}, $schema.options, {
          parent: $schema,
          path: subpropertyPath
        })) }
      });
    }
    else if(isPropertyDefinition) {
      for(const [$propertyValidatorName, $propertyValidator] of Object.entries($propertyValue)) {
        const isValidatorDefinition = _isValidatorDefinition($propertyValidator, $schema);
        if(!isValidatorDefinition) {
          let propertyValidator;
          if($propertyValidatorName === 'type') {
            if($propertyValidator && typeof $propertyValidator === 'object') {
              const subpropertyPath = ($schema.path) ? [$schema.path, $propertyKey].join('.') : $propertyKey;
              propertyValidator = new Schema($propertyValidator, Object.assign({}, $schema.options, {
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
        else if(isValidatorDefinition) {
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
function _isPropertyDefinition($object, $schema) {
  if(!$object || $object instanceof Schema) { return false }
  const typeKey = $schema.options.properties.type;
  return Object.hasOwn($object, typeKey)
}
function _isValidatorDefinition($object, $schema) {
  if(!$object) { return false }
  const valueKey = $schema.options.properties.value;
  return Object.hasOwn($object, valueKey)
}

const { recursiveAssign: recursiveAssign$b } = Coutil;
var Options = ($options) => {
  const Options = recursiveAssign$b({
    path: null, 
    parent: null, 
    enableEvents: false,
    enableValidation: true, 
    validationEvents: {
      'validProperty:$key': true,
      'validProperty': true,
      'nonvalidProperty:$key': true,
      'nonvalidProperty': true,
    },
    pathkey: true,
    subpathError: false,
    assignObject: 'set', 
    assignArray: 'set', 
    methods: {
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
          sourceTree: true,
          mutatorEvents: {
            'assignSourceProperty:$key': true,
            'assignSourceProperty': true,
            'assignSource': true,
            'assign': true,
          },
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
      },
    },
  }, $options);
  return Options
};

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

const { recursiveAssign: recursiveAssign$a, typedObjectLiteral: typedObjectLiteral$a } = Coutil;
function assign($model, $options, ...$sources) {
  const options = Object.assign({}, $options);
  const assignObject = 'assign';
  const assignArray = options.assignArray || 'assign';
  const { path, schema, source, target } = $model;
  const { enableValidation, mutatorEvents, required, sourceTree, validationEvents } = options;
  const assignedSources = [];
  const assignChange = new Change({ preter: $model });
  for(let $source of $sources) {
    let assignedSource;
    const assignSourceChange = new Change({ preter: $model });
    if(Array.isArray($source)) { assignedSource = []; }
    else if($source && typeof $source === 'object') { assignedSource = {}; }
    let validObject;
    if(enableValidation && schema) {
      validObject = schema.validate($source, $model.valueOf());
      validObject.report();
    }
    iterateSourceProperties:
    for(let [$sourceKey, $sourceValue] of Object.entries($source)) {
      const assignSourcePropertyChange = new Change({ preter: target[$sourceKey] });
      const assignSourcePropertyKeyChange = new Change({ preter: target[$sourceKey] });
      if(schema && enableValidation) {
        const validatorTarget = $model.valueOf();
        const validatorSource = $source;
        const validSourceProperty = schema.validateProperty($sourceKey, $sourceValue, validatorSource, validatorTarget);
        if(validationEvents) {
          let type, propertyType;
          if(validSourceProperty.valid) {
            type = 'validProperty';
            propertyType = ['validProperty', $sourceKey].join(':');
          }
          else {
            type = 'nonvalidProperty';
            propertyType = ['nonvalidProperty', $sourceKey].join(':');
          }
          for(const $eventType of [type, propertyType]) {
            $model.dispatchEvent(new ValidatorEvent$1($eventType, validSourceProperty, $model));
          }
        }
        if(!validSourceProperty.valid) { continue iterateSourceProperties }
      }
      let sourceValue;
      if($sourceValue && typeof $sourceValue === 'object') {
        if($sourceValue instanceof $model.constructor) {
          sourceValue = $sourceValue.valueOf();
        }
        let subschema;
        if(schema?.type === 'array') { subschema = schema.target[0].type.value; }
        else if(schema?.type === 'object') { subschema = schema.target[$sourceKey].type.value; }
        else { subschema = null; }
        const modelPath = (path)
          ? [path, $sourceKey].join('.')
          : String($sourceKey);
        if(sourceTree === false) {
          const suboptions = recursiveAssign$a({}, options, {
            path: modelPath,
            parent: $model,
          });
          sourceValue = new $model.constructor($sourceValue, subschema, suboptions);
          const assignment = { [$sourceKey]: sourceValue };
          Object.assign(target, assignment);
          Object.assign(assignedSource, assignment);
        }
        else {
          if(target[$sourceKey] instanceof $model.constructor) {
            sourceValue = target[$sourceKey];
          }
          else {
            const subproperties = typedObjectLiteral$a($sourceValue);
            const suboptions = recursiveAssign$a({}, options, {
              path: modelPath,
              parent: $model,
            });
            sourceValue = new $model.constructor(subproperties, subschema, suboptions);
          }
          const assignment = { [$sourceKey]: sourceValue };
          Object.assign(target, assignment);
          Object.assign(assignedSource, assignment);
          $model.retroReenableEvents();
          if(sourceValue.type === 'array') {
            if(['push', 'unshift'].includes(assignArray)) { sourceValue[assignArray](...$sourceValue); }
            else { sourceValue[assignArray]($sourceValue); }
          }
          else if(sourceValue.type === 'object') { sourceValue[assignObject]($sourceValue); }
        }
      }
      else {
        sourceValue = $sourceValue;
        const assignment = { [$sourceKey]: sourceValue };
        Object.assign(target, assignment);
        Object.assign(assignedSource, assignment);
      }
      if(mutatorEvents) {
        const modelEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey);
        if(mutatorEvents['assignSourceProperty:$key']) {
          const type = ['assignSourceProperty', $sourceKey].join(':');
          assignSourcePropertyKeyChange.anter = target[$sourceKey];
          $model.dispatchEvent(
            new ModelEvent(type, {
              path: modelEventPath,
              value: sourceValue,
              change: assignSourcePropertyKeyChange,
              detail: {
                source: assignedSource,
              }
            }, $model)
          );
        }
        if(mutatorEvents['assignSourceProperty']) {
          assignSourcePropertyChange.anter = target[$sourceKey];
          $model.dispatchEvent(
            new ModelEvent('assignSourceProperty', {
              path: modelEventPath,
              value: sourceValue,
              change: assignSourcePropertyChange,
              detail: {
                source: assignedSource,
              }
            }, $model)
          );
        }
      }
    }
    assignedSources.push(assignedSource);
    if(mutatorEvents && mutatorEvents['assignSource']) {
      assignSourceChange.anter = $model;
      $model.dispatchEvent(
        new ModelEvent('assignSource', {
          path,
          change: assignSourceChange,
          detail: {
            source: assignedSource,
          },
        }, $model)
      );
    }
  }
  if(mutatorEvents && mutatorEvents['assign']) {
    assignChange.anter = $model;
    $model.dispatchEvent(
      new ModelEvent('assign', { 
        path,
        change: assignChange,
        detail: {
          sources: assignedSources,
        },
      }, $model)
    );
  }
  return $model
}

const { typedObjectLiteral: typedObjectLiteral$9 } = Coutil;
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

const { impandTree, recursiveAssign: recursiveAssign$9, typedObjectLiteral: typedObjectLiteral$8 } = Coutil;
function defineProperty($model, $options, $propertyKey, $propertyDescriptor) {
  const options = Object.assign({}, $options);
  const assignObject = 'defineProperties';
  const assignArray = options.assignArray || 'defineProperties';
  const {
    descriptorTree, enableValidation, mutatorEvents, 
    validation, validationEvents, validationReport
  } = options;
  const { target, path, schema } = $model;
  const propertyValue = $propertyDescriptor.value;
  const targetPropertyDescriptor = Object.getOwnPropertyDescriptor(target, $propertyKey) || {};
  const targetPropertyValue = targetPropertyDescriptor.value;
  const definePropertyChange = new Change({ preter: targetPropertyValue });
  const definePropertyKeyChange = new Change({ preter: targetPropertyValue });
  const targetPropertyValueIsModelInstance = targetPropertyValue instanceof $model.constructor;
  if(schema && enableValidation) {
    const validProperty = schema.validateProperty(
      $propertyKey, 
      impandTree(propertyValue, 'value') || propertyValue,
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
    if(targetPropertyValueIsModelInstance) {
      if(descriptorTree === true) {
        targetPropertyValue.defineProperties($propertyDescriptor);
      }
      else {
        Object.defineProperty(target, $propertyKey, $propertyDescriptor);
      }
    }
    else {
      let subschema;
      if(schema) {
        if(schema.type === 'array') { subschema = schema.target[0].type.value; }
        else if(schema.type === 'object') { subschema = schema.target[$propertyKey].type.value; }
        else { subschema = undefined; }
      }
      let subtarget = typedObjectLiteral$8(propertyValue);
      const suboptions = recursiveAssign$9({}, options, {
        path: modelPath,
        parent: $model,
      });
      const submodel = new $model.constructor(
        subtarget, subschema, suboptions
      );
      if(descriptorTree === true) {
        target[$propertyKey] = submodel;
        $model.retroReenableEvents();
        if(submodel.type === 'array') {
          if(['push', 'unshift'].includes(assignArray)) { submodel[assignArray](...propertyValue); }
          else { submodel[assignArray](propertyValue); }
        }
        else if(submodel.type === 'object') { submodel[assignObject](propertyValue); }
      }
      else if(descriptorTree === false) {
        Object.defineProperty(target, $propertyKey, $propertyDescriptor);
      }
    }
  }
  else {
    Object.defineProperty(target, $propertyKey, $propertyDescriptor);
  }
  if(mutatorEvents) {
    const modelEventPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey);
    if(mutatorEvents['defineProperty:$key']) {
      definePropertyKeyChange.anter = target[$propertyKey];
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
      definePropertyChange.anter = target[$propertyKey];
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
  const { target } = $model;
  if(recursive === true) {
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
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
  Object.freeze(target);
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
  const { target } = $model;
  if(recursive === true) {
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
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
  Object.seal(target);
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

var ObjectProperty = {
  assign,
  defineProperties,
  defineProperty,
  freeze,
  seal,
};

const { typedObjectLiteral: typedObjectLiteral$7 } = Coutil;
function concat($model, $options) {
  const { target, path, schema } = $model;
  const { enableValidation, mutatorEvents, source, validationEvents } = $options;
  const $arguments = [].concat(...arguments);
  let valueIndex = target.length;
  const values = [];
  let targetConcat = [...Array.from(target)];
  let model;
  iterateValues: 
  for(let $value of $arguments) {
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf();
      const validatorSource = source || typedObjectLiteral$7(validatorTarget);
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
      let subschema = schema?.target[0].type.value || null;
      const submodel = typedObjectLiteral$7($value);
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
    targetConcat = Array.prototype.concat.call(targetConcat, values[valueIndex]);
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
  model = new $model.constructor(targetConcat, schema, $model.options);
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
  const { target, path } = $model;
  const { enableValidation, validationEvents, mutatorEvents } = $options;
  const copyTarget = (
    arguments[0] >= 0
  ) ? arguments[0]
    : target.length = arguments[0];
  const start = (
    arguments[1] >= 0
  ) ? arguments[1]
    : target.length + arguments[1];
  const end = (
    arguments[2] === undefined
  ) ? target.length
    : (
    arguments[2] >= 0
  ) ? arguments[2]
    : target.length + arguments[2];
  const copiedItems = [];
  let copyIndex = start;
  let targetIndex = copyTarget;
  while(copyIndex < end) {
    const copyItem = target[copyIndex];
    copiedItems.push(copyItem);
    Array.prototype.copyWithin.call(
      target,
      targetIndex,
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
                target: targetIndex,
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
        const type  = ['copyWithinElement', ':', copyIndex].join('');
        $model.dispatchEvent(
          new ModelEvent(
            type,
            {
              path: modelEventPath,
              value: copyItem,
              detail: {
                target: targetIndex,
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
    targetIndex++;
  }
  // Array Copy Within Event
  if(mutatorEvents && mutatorEvents['copyWithin']) {
    $model.dispatchEvent(
      new ModelEvent(
        'copyWithin',
        {
          path,
          detail: {
            target: copyTarget,
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

const { typedObjectLiteral: typedObjectLiteral$6 } = Coutil;
function fill($model, $options, ...$arguments) {
  const options = Object.assign({}, $options);
  const { target, path, schema } = $model;
  const assignObject = options.assignObject;
  const assignArray = options.assignArray || assignObject;
  const { enableValidation, lengthen, mutatorEvents, validationEvents } = options;
  const filled = [];
  let $start;
  if(typeof $arguments[1] === 'number') {
    $start = ($arguments[1] >= 0)
      ? $arguments[1]
      : target.length + $arguments[1];
  }
  else { $start = 0; }
  let $end;
  if(typeof $arguments[2] === 'number') {
    $end = ($arguments[2] >= 0)
      ? $arguments[2]
      : target.length + $arguments[2];
  } else { $end = target.length; }
  if(lengthen && target.length < $end) { target.length = $end; }
  let fillIndex = $start;
  iterateFillIndexes: 
  while(
    fillIndex < target.length &&
    fillIndex < $end
  ) {
    if(schema && enableValidation) {
      let validValue = schema.validate(validValue, $model.valueOf());
      if(validationEvents) {
        let type, propertyType;
        if(validValue.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', ':', fillIndex].join('');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', ':', fillIndex].join('');
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
      const subschema = schema?.target[0].type.value || null;
      const subproperties = typedObjectLiteral$6($value);
      const suboptions = Object.assign({}, options, {
        path: modelPath,
        parent: $model,
      });
      value = new $model.constructor(subproperties, subschema, suboptions);
    }
    Array.prototype.fill.call(target, value, fillIndex, fillIndex + 1);
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
        const type = ['fillElement', ':', fillIndex].join('');
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
  const { target, path } = $model;
  const popElement = Array.prototype.pop.call(target);
  const popElementIndex = target.length - 1;
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

const { recursiveAssign: recursiveAssign$8, typedObjectLiteral: typedObjectLiteral$5, typeOf: typeOf$3 } = Coutil;
function push($model, $options, ...$elements) {
  const options = Object.assign({}, $options);
  const assignArray = 'push';
  const assignObject = options.assignObject;
  const { enableValidation, mutatorEvents, source, validationEvents } = options;
  const { target, path, schema } = $model;
  const elements = [];
  let elementsIndex = 0;
  for(let $element of $elements) {
    let element;
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf();
      const validatorSource = source || typedObjectLiteral$5(validatorTarget);
      const validElement = schema.validateProperty(elementsIndex, $element, validatorSource, validatorTarget);
      if(validationEvents) {
        let type, propertyType;
        if(validElement.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', ':', elementsIndex].join('');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', ':', elementsIndex].join('');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent$1($eventType, validElement, $model));
        }
      }
      if(!validElement.valid) { return target.length }
    }
    const modelPath = (path)
      ? [path, elementsIndex].join('.')
      : String(elementsIndex);
    if($element && typeof $element === 'object') {
      $element = ($element instanceof $model.constructor) ? $element.valueOf() : $element;
      const subschema = schema?.target[0].type.value || null;
      const subproperties = typedObjectLiteral$5(typeOf$3($element));
      const submodelOptions = Object.assign({}, options, {
        path: modelPath,
        parent: $model,
      });
      element = new $model.constructor(subproperties, subschema, submodelOptions);
      Array.prototype.push.call(target, element);
      $model.retroReenableEvents();
      if(element.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { element[assignArray](...$element); }
        else { element[assignArray]($element); }
      }
      else if(element.type === 'object') { element[assignObject]($element); }
    }
    else {
      element = $element;
      Array.prototype.push.call(target, element);
    }
    elements.push(element);
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, '.', elementsIndex].join('')
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
        const type = ['pushElement', ':', elementsIndex].join('');
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
  return target.length
}

function reverse($model, $options) {
  const { mutatorEvents } = $options;
  const { target, path } = $model;
  Array.prototype.reverse.call(target, ...arguments);
  $model.retroReenableEvents();
  if(mutatorEvents && mutatorEvents['reverse']) {
    $model.dispatchEvent(
      new ModelEvent(
        'reverse',
        {
          path,
          detail: {
            reference: target
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
  const { target, path } = $model;
  const shiftElement = Array.prototype.shift.call(target);
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

const { typedObjectLiteral: typedObjectLiteral$4 } = Coutil;
function splice($model, $options) {
  const options = Object.assign({}, $options);
  const assignObject = options.assignObject;
  const assignArray = options.assignArray || assignObject;
  const { mutatorEvents, source } = options;
  const { target, path, schema } = $model;
  const { enableValidation, validationEvents } = options;
  const $arguments = [...arguments];
  const $start = ($arguments[0] >= 0)
    ? $arguments[0]
    : target.length + $arguments[0];
  const $deleteCount = ($arguments[1] <= 0)
    ? 0
    : (
      $arguments[1] === undefined ||
      $start + $arguments[1] >= target.length
    ) ? target.length - $start
      : $arguments[1];
  const $addItems = $arguments.slice(2);
  const addCount = $addItems.length;
  const deleteItems = [];
  let deleteItemsIndex = 0;
  while(deleteItemsIndex < $deleteCount) {
    const deleteItem = Array.prototype.splice.call(target, $start, 1)[0];
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
        const type = ['spliceDeleteElement', ':', deleteItemsIndex].join('');
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
      const validatorSource = source || typedObjectLiteral$4(validatorTarget);
      const validAddItem = schema.validateProperty(elementIndex, element, validatorSource, validatorTarget);
      if(validationEvents) {
        let type, propertyType;
        if(validAddItem.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', ':', addItemsIndex].join('');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', ':', addItemsIndex].join('');
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
      const subschema = schema?.target[0].type.value || null;
      const subproperties = typedObjectLiteral$4(addItem);
      const suboptions = recursiveAssign({}, options, {
        path: modelPath,
        parent: $model,
      });
      addItem = new $model.constructor(subproperties, subschema, suboptions);
      Array.prototype.splice.call(target, startIndex, 0, addItem);
      $model.retroReenableEvents();
      if(addItem.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { addItem[assignArray](...$value); }
        else { addItem[assignArray]($value); }
      }
      else if(addItem.type === 'object') { addItem[assignObject]($value); }
    }
    else {
      Array.prototype.splice.call(target, startIndex, 0, addItem);
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
        const type = ['spliceAddElement', ':', addItemsIndex].join('');
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
          length: target.length,
        },
      },
      $model)
    );
  }
  return deleteItems
}

const { recursiveAssign: recursiveAssign$7, typedObjectLiteral: typedObjectLiteral$3, typeOf: typeOf$2 } = Coutil;
function unshift($model, $options, ...$elements) {
  const options = Object.assign({}, $options);
  const assignArray = 'unshift';
  const assignObject = options.assignObject;
  const { enableValidation, mutatorEvents, source, validationEvents } = options;
  const { target, path, schema } = $model;
  const elements = [];
  let elementsIndex = 0;
  for(let $element of $elements) {
    let element;
    if(schema && enableValidation) {
      const validatorTarget = $model.valueOf();
      const validatorSource = source || typedObjectLiteral$3(validatorTarget);
      const validElement = schema.validateProperty(elementsIndex, $element, validatorSource, validatorTarget);
      if(validationEvents) {
        let type, propertyType;
        if(validElement.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', ':', elementsIndex].join('');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', ':', elementsIndex].join('');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent($eventType, validElement, $model));
        }
      }
      if(!validElement.valid) { return target.length }
    }
    const modelPath = (path)
      ? [path, elementsIndex].join('.')
      : String(elementsIndex);
    if($element && typeof $element === 'object') {
      $element = ($element instanceof $model.constructor) ? $element.valueOf() : $element;
      const subschema = schema?.target[0].type.value || null;
      const subproperties = typedObjectLiteral$3(typeOf$2($element));
      const submodelOptions = Object.assign({}, options, {
        path: modelPath,
        parent: $model,
      });
      element = new $model.constructor(subproperties, subschema, submodelOptions);
      Array.prototype.unshift.call(target, element);
      $model.retroReenableEvents();
      if(element.type === 'array') { element[assignArray](...$element); }
      else if(element.type === 'object') { element[assignObject]($element); }
    }
    else {
      element = $element;
      Array.prototype.unshift.call(target, element);
    }
    elements.unshift(element);
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, '.', elementsIndex].join('')
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
        const type = ['unshiftElement', ':', elementsIndex].join('');
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
  return target.length
}

var ArrayProperty = {
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

const { regularExpressions: regularExpressions$2} = Coutil;
function getContentProperty($model, $options, $path) {
  const { target, path } = $model;
  const { mutatorEvents, pathkey, subpathError } = $options;
  if(pathkey === true) {
    const subpaths = $path.split(new RegExp(regularExpressions$2.quotationEscape));
    const propertyKey = subpaths.shift();
    let propertyValue = target[propertyKey];
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
    const propertyValue = target[propertyKey];
    return propertyValue
  }
}

const { recursiveAssign: recursiveAssign$6 } = Coutil;
function getProperty($model, $options, ...$arguments) {
  let getProperty;
  const options = $options;
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { recursiveAssign$6(options, $arguments[1]); }
    getProperty = getContentProperty($model, options, ...$arguments);
  }
  else {
    if($arguments.length === 1) { recursiveAssign$6(options, $arguments[0]); }
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

const { recursiveAssign: recursiveAssign$5, regularExpressions: regularExpressions$1, typedObjectLiteral: typedObjectLiteral$2, typeOf: typeOf$1 } = Coutil;
function setContentProperty($model, $options, $path, $value) {
  const options = Object.assign({}, $options);
  const assignObject = 'set';
  const assignArray = options.assignArray || 'set';
  const { target, path, schema } = $model;
  const {
    enableValidation, mutatorEvents, pathkey, 
    recursive, subpathError, 
    validationEvents, source, 
  } = options;
  if(pathkey === true) {
    const subpaths = $path.split(new RegExp(regularExpressions$1.quotationEscape));
    const propertyKey = subpaths.shift();
    let propertyValue;
    const typeOfPropertyValue = typeOf$1($value);
    const modelPath = (path)
      ? [path, propertyKey].join('.')
      : String(propertyKey);
    if(subpaths.length) {
      if(recursive && target[propertyKey] === undefined) {
        let subschema;
        if(schema?.type === 'array') { subschema = schema.target[0].type.value; }
        else if(schema?.type === 'object') { subschema = schema.target[propertyKey].type.value; }
        else { subschema = undefined; }
        let submodel;
        if(typeOfPropertyValue === 'array') { submodel = []; }
        else if(typeOfPropertyValue === 'object') { submodel = {}; }
        else {
          if(isNaN(Number(propertyKey))) { submodel = {}; }
          else { submodel = []; }
        }
        const submodelOptions = recursiveAssign$5({}, options, {
          path: modelPath,
          parent: $model,
        });
        propertyValue = new $model.constructor(submodel, subschema, submodelOptions);
      }
      else {
        propertyValue = target[propertyKey];
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
          propertyType = ['validProperty', ':', propertyKey].join('');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', ':', propertyKey].join('');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent$1($eventType, validTargetProp, $model));
        }
      }
      if(!validTargetProp.valid) { return }
    }
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf(); }
      const typeOfPropertyValue= typeOf$1($value);
      let subschema;
      let submodel;
      if(schema?.type === 'array') { subschema = schema.target[0].type.value; }
      else if(schema?.type === 'object') { subschema = schema.target[propertyKey].type.value; }
      else { subschema = undefined; }
      if(typeOfPropertyValue === 'array') { submodel = []; }
      else if(typeOfPropertyValue === 'object') { submodel = {}; }
      else {
        if(isNaN(Number(propertyKey))) { submodel = {}; }
        else { submodel = []; }
      }
      const submodelOptions = recursiveAssign$5({}, options, {
        path: modelPath,
        parent: $model,
      });
      propertyValue = new $model.constructor(submodel, subschema, submodelOptions);
      target[propertyKey] = propertyValue;
      $model.retroReenableEvents();
      if(propertyValue.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { propertyValue[assignArray](...$value); }
        else { propertyValue[assignArray]($value); }
      }
      else if(propertyValue.type === 'object') { propertyValue[assignObject]($value); }
    }
    else {
      propertyValue = $value;
      target[propertyKey] = propertyValue;
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
        const type = ['setProperty', ':', propertyKey].join('');
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
      const typeOfPropertyValue = typeOf$1($value);
      let subschema;
      let submodel;
      if(schema?.type === 'array') {
        subschema = schema.target[0].type.value;
      }
      if(schema?.type === 'object') {
        subschema = schema.target[propertyKey].type.value;
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
      const submodelOptions = recursiveAssign$5({}, options, {
        path: modelPath,
        parent: $model,
      });
      propertyValue = new $model.constructor(submodel, subschema, submodelOptions);
      target[propertyKey] = propertyValue;
      $model.retroReenableEvents();
      if(propertyValue.type === 'array') {
        if(['push', 'unshift'].includes(assignArray)) { propertyValue[assignArray](...$value); }
        else { propertyValue[assignArray]($value); }
      }
      else if(propertyValue.type === 'object') { propertyValue[assignObject]($value); }
    }
    else {
      propertyValue = $value;
      target[propertyKey] = propertyValue;
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
        const type = ['setProperty', ':', propertyKey].join('');
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

const { recursiveAssign: recursiveAssign$4 } = Coutil;
function setProperty($model, $options, ...$arguments) {
  let setProperty;
  const options = $options;
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 3) { recursiveAssign$4(options, $arguments[2]); }
    setProperty = setContentProperty($model, options, ...$arguments);
  }
  else {
    if($arguments.length === 2) { recursiveAssign$4(options, $arguments[1]); }
    setProperty = setContent($model, options, ...$arguments);
  }
  return setProperty
}

function deleteContent($model, $options) {
  const { target } = $model;
  for(const [$targetPropertyKey, $targetPropertyValue] of Object.entries(target)) {
    $model.delete($targetPropertyKey, $options);
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

const { regularExpressions} = Coutil;
function deleteContentProperty($model, $options, $path) {
  const { target, path, schema } = $model;
  const { mutatorEvents, pathkey, subpathError, enableValidation, validationEvents } = $options;
  if(pathkey === true) {
    const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape));
    const propertyKey = subpaths.shift();
    let propertyValue = target[propertyKey];
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
    delete target[propertyKey];
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
    const propertyValue = target[propertyKey];

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
    delete target[propertyKey];
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

const { recursiveAssign: recursiveAssign$3 } = Coutil;
function deleteProperty($model, $options, ...$arguments) {
  let deleteProperty;
  const options = $options;
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { recursiveAssign$3(options, $arguments[1]); }
    deleteProperty = deleteContentProperty($model, options, ...$arguments);
  }
  else {
    if($arguments.length === 1) { recursiveAssign$3(options, $arguments[0]); }
    deleteProperty = deleteContent($model, options, ...$arguments);
  }
  return deleteProperty
}

var MapProperty = {
  get: getProperty,
  set: setProperty,
  delete: deleteProperty,
};

const { recursiveAssign: recursiveAssign$2, recursiveFreeze } = Coutil;
const Defaults = Object.freeze({
  object: [{
    keys: ['valueOf'],
    methodDescriptor: function($methodName, $model) {
      return { value: function valueOf() { return $model.parse({ type: 'object' }) } }
    },
  }, {
    keys: ['toString'],
    methodDescriptor: function($methodName, $model) {
      return { value: function toString($parseSettings = {}) {
        const replacer = ($parseSettings.replacer !== undefined)
          ? $parseSettings.replacer : null;
        const space = ($parseSettings.space !== undefined)
          ? $parseSettings.space : 0;
        return $model.parse({ type: 'string', replacer, space })
      } }
    }, 
  }, {
    keys: [
      'entries', 'fromEntries', 'getOwnPropertyDescriptors', 
      'getOwnPropertyDescriptor', 'getOwnPropertyNames', 
      /* 'getOwnPropertySymbols', */ 'groupBy', 'hasOwn', 'is', 
      'getPrototypeOf', 'isExtensible', 'isFrozen', 'isSealed', 
      'keys', 'preventExtensions', 'values',
    ],
    methodDescriptor: function($methodName, $model) {
      return { value: Object[$methodName].bind(null, $model.valueOf()) }
    },
  }, {
    keys: ['propertyIsEnumerable', 'hasOwnProperty'], 
    methodDescriptor: function($methodName, $model) {
      return { value: () => $model.parse({ type: 'object' })[$methodName] }
    },
  }, {
    type: 'mutators',
    keys: Object.keys(ObjectProperty), 
    methodDescriptor: function($methodName, $model, $options) {
      return { value: ObjectProperty[$methodName].bind(null, $model, $options) }
    }
  }],
  array: [{
    keys: ['length'], 
    methodDescriptor: function($propertyName, $model, $options) {
      return {
        get() { return $model.target.length },
        set($propertyValue) { $model.target.length = $propertyValue; },
      }
    }
  }, {
    keys: [
      'from', 'fromAsync', 'isArray', 'of', 
    ], 
    methodDescriptor: function($methodName, $model) {
      return { value: Array[$methodName] }
    }, 
  }, {
    keys: [
      'at', 'every', 'filter', 'find', 'findIndex', 'findLast',
      'findLastIndex', 'flat', 'flatMap', 'forEach', 'includes', 
      'indexOf', 'join', 'lastIndexOf', 'map', 'reduce', 'reduceRight', 
      'slice', 'some', 'sort', 'toReversed',  'toSorted', 'toSpliced', 
      'with', 
    ], 
    methodDescriptor: function($methodName, $model) {
      return { value: Array.prototype[$methodName].bind(null, $model) }
    }
  }, {
    type: 'mutators',
    keys: Object.keys(ArrayProperty), 
    methodDescriptor: function($methodName, $model, $options) {
      return { value: ArrayProperty[$methodName].bind(null, $model, $options) }
    }
  }],
  map: [{
    type: 'mutators',
    keys: Object.keys(MapProperty),
    methodDescriptor: function($methodName, $model, $options) {
      return { value: MapProperty[$methodName].bind(null, $model, $options) }
    }
  }]
});
function Methods($model) {
  // Object, Array, Map
  for(const [$propertyClassName, $propertyClasses] of Object.entries(Defaults)) {
    for(const $propertyClass of $propertyClasses) {
      const { keys, methodDescriptor, type } = $propertyClass;
      for(const $methodName of keys) {
        if($propertyClassName === 'map' || type === 'mutators') {
          const modelMethodOptions = structuredClone(
            $model.options.methods[$propertyClassName][$methodName]
          );
          const methodOptions = Object.assign({}, $model.options, modelMethodOptions);
          delete methodOptions.mutatorEvents;
          methodOptions.mutatorEvents = modelMethodOptions.mutatorEvents;
          Object.defineProperty(
            $model, $methodName, methodDescriptor($methodName, $model, methodOptions)
          );
        }
        else {
          Object.defineProperty(
            $model, $methodName, methodDescriptor($methodName,  $model)
          );
        }
      }
    }
  }
  return $model
}

const { recursiveAssign: recursiveAssign$1, typedObjectLiteral: typedObjectLiteral$1 } = Coutil;
const ValidArrayAssigmentMethods = Object.freeze(
  ['push', 'unshift']
);
const ValidObjectAssigmentMethods = Object.freeze(
  ['assign', 'defineProperties', 'set']
);

function Assign($model, $properties, $options) {
  const { type } = $model;
  const { assignObject, assignArray } = $options;
  if(type === 'array' && ValidArrayAssigmentMethods.includes(assignArray)) {
    $model[assignArray](...$properties);
  }
  else if(['array', 'object'].includes(type) && ValidObjectAssigmentMethods.includes(assignObject)) {
    $model[assignObject]($properties);
  }
  return $model
}

const { typedObjectLiteral, typeOf } = Coutil;

class Model extends Core {
  constructor($properties = {}, $schema = null, $options = {}) {
    super({ propertyDirectory: { accessors: [($target, $property) => {
      if($property === undefined) { return $target.target }
      else { return $target.get($property) }
    }] } });
    const properties = ($properties instanceof Model) ? $properties.valueOf() : $properties;
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
      'options': { configurable: true, get() {
        const options = Options($options);
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
      'key': { get() { return (path) ? path.pop() : path } },
      'target': { configurable: true, get() {
        const target = typedObjectLiteral(properties);
        Object.defineProperty(this, 'target', { value: target });
        return target
      } },
      'type': { configurable: true, get() {
        const type = typeOf(this.target);
        Object.defineProperty(this, 'type', { value: type });
        return type
      } },
      'schema': { configurable: true, get() {
        const typeOfSchema = typeOf($schema);
        let schema;
        if(['undefined', 'null'].includes(typeOfSchema)) { schema = null; }
        else if($schema instanceof Schema) { schema = $schema; }
        else if(['array', 'object'].includes(typeOfSchema)) { schema = new Schema($schema); }
        Object.defineProperty(this, 'schema', { value: schema });
        return schema
      } },
    });
    this.mount({
      parent: this.options.parent,
      path: this.options.path
    });
    Methods(this);
    Assign(this, properties, this.options);
  }
  retroReenableEvents() {
    let model = this;
    while(model) {
      model.reenableEvents({ enable: true });
      model = model.parent;
    }
    return this
  }
  parse($settings = { type: 'object', replacer: null, space: 0 }) {
    let parsement = typedObjectLiteral(this.type);
    for(const [
      $propertyDescriptorName, $propertyDescriptor
    ] of Object.entries(
      Object.getOwnPropertyDescriptors(this.target))
    ) {
      let { enumerable, value, writable, configurable } = $propertyDescriptor;
      if(value instanceof Model) {
        Object.defineProperty(parsement, $propertyDescriptorName, {
          enumerable, value: value.valueOf(), writable, configurable
        });
      }
      else {
        Object.defineProperty(parsement, $propertyDescriptorName, {
          enumerable, value, writable, configurable
        });
      }
    }
    let { type, replacer, space } = $settings;
    if(type === 'object') { return parsement }
    else if(type === 'string') { return JSON.stringify(parsement, replacer, space) }
    else { return undefined }
  }
}

export { Model, Schema, Validation, Validator, Verification };
//# sourceMappingURL=objecture.sans.core-plex.js.map
