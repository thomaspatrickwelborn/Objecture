const Primitives = {
  'string': String, 
  'number': Number, 
  'boolean': Boolean, 
  'bigint': BigInt,
  'undefined': undefined,
  'null': null,
};
const PrimitiveKeys = Object.keys(Primitives);
const PrimitiveValues = Object.values(Primitives);
const Objects = {
  'object': Object,
  'array': Array,
};
const ObjectKeys = Object.keys(Objects);
const ObjectValues = Object.values(Objects);
const Types = Object.assign({}, Primitives, Objects);
const TypeKeys = Object.keys(Types);
const TypeValues = Object.values(Types);
const TypeMethods = [
 Primitives.String, Primitives.Number, Primitives.Boolean, 
 Objects.Object, Objects.Array
];

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ObjectKeys: ObjectKeys,
  ObjectValues: ObjectValues,
  Objects: Objects,
  PrimitiveKeys: PrimitiveKeys,
  PrimitiveValues: PrimitiveValues,
  Primitives: Primitives,
  TypeKeys: TypeKeys,
  TypeMethods: TypeMethods,
  TypeValues: TypeValues,
  Types: Types
});

var typeOf = ($data) => Object
  .prototype
  .toString
  .call($data).slice(8, -1).toLowerCase();

function typedObjectLiteral($value) {
  let _typedObjectLiteral;
  const typeOfValue = typeOf($value);
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

var regularExpressions = {
  quotationEscape: /\.(?=(?:[^"]*"[^"]*")*[^"]*$)/,
};

function get($path, $source) {
  const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape));
  const key = subpaths.pop();
  let subtarget = $source;
  for(const $subpath of subpaths) { subtarget = subtarget[$subpath]; }
  return subtarget[key]
}
function set($path, $source) {
  const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape));
  const key = subpaths.pop();
  const target = (key && !isNaN(key)) ? [] : {};
  let subtarget = target;
  let subpathIndex = 0;
  while(subpathIndex < subpaths.length - 2) {
    const $subpath = keypaths[subpathIndex];
    if(isNaN($subpath)) { subtarget[$subpath] = {}; }
    else { subtarget[$subpath] = {}; }
    subtarget = subtarget[$subpath];
    subpathIndex++;
  }
  subtarget[key] = $source;
  return target
}

const ValidPropertyTypes = ['string', 'function'];
function expandTree($source, $property) {
  const typeOfProperty = typeOf($property);
  const typeOfSource = typeOf($source);
  if(
    !ValidPropertyTypes.includes(typeOfProperty) ||
    !ObjectKeys.includes(typeOfSource)
  ) { return $source }
  let target = typedObjectLiteral($source);
  for(const [$sourceKey, $sourceValue] of Object.entries($source)) {
    const sourceValue = (
      ObjectKeys.includes(typeOf($sourceValue))
    ) ? expandTree($sourceValue, $property) : $sourceValue;
    if(typeOfProperty === ValidPropertyTypes[0]) {
      target[$sourceKey] = set($property, sourceValue);
    }
    else if(typeOfProperty === ValidPropertyTypes[1]) {
      target[$sourceKey] = $property(sourceValue);
    }
  }
  return target
}

function impandTree($source, $property) {
  const typeOfProperty = typeOf($property);
  const typeOfSource = typeOf($source);
  if(
    !['string', 'function'].includes(typeOfProperty) ||
    !['array', 'object'].includes(typeOfSource)
  ) { return $source }
  let target = typedObjectLiteral($source);
  for(const [$sourceKey, $sourceValue] of Object.entries($source)) {
    if(typeOfProperty === 'string') { target[$sourceKey] = get($property, $sourceValue); }
    else if(typeOfProperty === 'function') { target[$sourceKey] = $property($sourceValue); }
    if(target[$sourceKey] && typeof target[$sourceKey] === 'object') {
      target[$sourceKey] = impandTree(target[$sourceKey], $property);
    }
  }
  return target
}

var isArrayLike = ($source) => {
  let isArrayLike;
  const typeOfSource = typeOf($source);
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

const defaultAccessor = ($target, $property) => {
  if($property === undefined) { return $target }
  else { return $target[$property] }
};
var Accessors = {
  default: defaultAccessor};

const Options$2 = {
  depth: 0,
  maxDepth: 10,
  accessors: [Accessors.default],
};
function propertyDirectory($object, $options) {
  const _propertyDirectory = [];
  const options = Object.assign({}, Options$2, $options);
  options.depth++;
  if(options.depth > options.maxDepth) { return _propertyDirectory }
  iterateAccessors: 
  for(const $accessor of options.accessors) {
    const accessor = $accessor.bind($object);
    const object = accessor($object);
    if(!object) continue iterateAccessors
    for(const [$key, $value] of Object.entries(object)) {
      if(!options.values) { _propertyDirectory.push($key); }
      else if(options.values) { _propertyDirectory.push([$key, $value]); }
      if(
        typeof $value === 'object' &&
        $value !== null &&
        $value !== object
      ) {
        const subtargets = propertyDirectory($value, options);
        if(!options.values) {
          for(const $subtarget of subtargets) {
            const path = [$key, $subtarget].join('.');
            _propertyDirectory.push(path);
          }
        }
        else if(options.values) {
          for(const [$subtargetKey, $subtarget] of subtargets) {
            const path = [$key, $subtargetKey].join('.');
            _propertyDirectory.push([path, $subtarget]);
          }
        }
      }
    }
  }
  return _propertyDirectory
}

function recursiveAssign($target, ...$sources) {
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    if(!$source) continue iterateSources
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfTargetPropertyValue = typeOf($target[$sourcePropertyKey]);
      const typeOfSourcePropertyValue = typeOf($sourcePropertyValue);
      if(
        typeOfTargetPropertyValue === 'object' &&
        typeOfSourcePropertyValue === 'object'
      ) {
        $target[$sourcePropertyKey] = recursiveAssign($target[$sourcePropertyKey], $sourcePropertyValue);
      }
      else {
        $target[$sourcePropertyKey] = $sourcePropertyValue;
      }
    }
  }
  return $target
}

function recursiveAssignConcat($target, ...$sources) {
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    if(!$source) continue iterateSources
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfTargetPropertyValue = typeOf($target[$sourcePropertyKey]);
      const typeOfSourcePropertyValue = typeOf($sourcePropertyValue);
      if( 
        typeOfTargetPropertyValue === 'object' &&
        typeOfSourcePropertyValue === 'object'
      ) {
        $target[$sourcePropertyKey] = recursiveAssignConcat($target[$sourcePropertyKey], $sourcePropertyValue);
      }
      else if(
        typeOfTargetPropertyValue === 'array' &&
        typeOfSourcePropertyValue === 'array'
      ) {
        $target[$sourcePropertyKey] = $target[$sourcePropertyKey].concat($sourcePropertyValue);
      }
      else {
        $target[$sourcePropertyKey] = $sourcePropertyValue;
      }
    }
  }
  return $target
}

var Options$1 = {
  parent: false,
  path: false,
  type: false,
};

function recursiveGetOwnPropertyDescriptor($properties, $propertyKey, $options) {
  const options = Object.assign({}, Options$1, $options);
  const propertyDescriptor = Object.getOwnPropertyDescriptor($properties, $propertyKey);
  if(options.type) { propertyDescriptor.type = typeOf(propertyDescriptor.value); }
  if(['array', 'object'].includes(typeOf(propertyDescriptor.value))) {
    propertyDescriptor.value = recursiveGetOwnPropertyDescriptors(propertyDescriptor.value, options);
  }
  return propertyDescriptor
}

function recursiveGetOwnPropertyDescriptors($properties, $options) {
  const options = Object.assign({}, Options$1, $options);
  const propertyDescriptors = {};
  for(const $propertyKey of Object.keys(Object.getOwnPropertyDescriptors($properties))) {
    propertyDescriptors[$propertyKey] = recursiveGetOwnPropertyDescriptor($properties, $propertyKey, options);
  }
  return propertyDescriptors
}

var Options = { typeCoercion: false };

function recursiveDefineProperty($target, $propertyKey, $propertyDescriptor, $options) {
  const propertyDescriptor = Object.assign({}, $propertyDescriptor);
  const options = Object.assign({}, Options, $options);
  const typeOfPropertyValue = typeOf(propertyDescriptor.value);
  if(['array', 'object'].includes(typeOfPropertyValue)) {
    const propertyValue = isArrayLike(Object.defineProperties(
      typedObjectLiteral(typeOfPropertyValue), propertyDescriptor.value
    )) ? [] : {};
    propertyDescriptor.value = recursiveDefineProperties(propertyValue, propertyDescriptor.value, options);
  }
  else if(
    options.typeCoercion && 
    Object.getOwnPropertyDescriptor(propertyDescriptor, 'type') !== undefined &&
    !['undefined', 'null'].includes(typeOfPropertyValue)
  ) {
    propertyDescriptor.value = Primitives[propertyDescriptor.type](propertyDescriptor.value);
  }
  Object.defineProperty($target, $propertyKey, propertyDescriptor);
  return $target
}

function recursiveDefineProperties($target, $propertyDescriptors, $options) {
  const options = Object.assign({}, Options, $options);
  for(const [
    $propertyKey, $propertyDescriptor
  ] of Object.entries($propertyDescriptors)) {
    recursiveDefineProperty($target, $propertyKey, $propertyDescriptor, options);
  }
  return $target
}

function recursiveFreeze($target) {
  for(const [$propertyKey, $propertyValue] of Object.entries($target)) {
    if($propertyValue && typeof $propertyValue === 'object') {
      recursiveFreeze($propertyValue);
    }
  }
  return Object.freeze($target)
}

export { expandTree, impandTree, isArrayLike, propertyDirectory, recursiveAssign, recursiveAssignConcat, recursiveDefineProperties, recursiveDefineProperty, recursiveFreeze, recursiveGetOwnPropertyDescriptor, recursiveGetOwnPropertyDescriptors, regularExpressions, typeOf, typedObjectLiteral, index as variables };
//# sourceMappingURL=recourse.js.map
