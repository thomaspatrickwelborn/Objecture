const defaultAccessor = ($target, $property) => {
  if($property === undefined) { return $target }
  else { return $target[$property] }
};
const getAccessor = ($target, $property) => {
  if($property === undefined) { return $target }
  else { return $target.get($property) }
};
var accessors = {
  default: defaultAccessor,
  get: getAccessor,
};

function expandEvents($propEvents, $scopeKey = ':scope') {
  if(
    Array.isArray($propEvents) ||
    $propEvents === undefined
  ) { return $propEvents }
  const propEvents = [];
  for(const [
    $propEventSettings, $propEventListener
  ] of Object.entries($propEvents)) {
    const propEventSettings = $propEventSettings.trim().split(' ');
    let path, type, listener;
    if(propEventSettings.length === 1) {
      path = $scopeKey;
      type = propEventSettings[0];
    }
    else if(propEventSettings.length > 1) {
      path = propEventSettings[0];
      type = propEventSettings[1];
    }
    if(Array.isArray($propEventListener)) {
      listener = $propEventListener[0];
      $propEventListener[1];
    }
    else {
      listener = $propEventListener;
    }
    const propEvent = {
      type,
      path,
      listener,
      enable: false,
    };
    propEvents.push(propEvent);
  }
  return propEvents
}

const Primitives = {
  'string': String, 
  'number': Number, 
  'boolean': Boolean, 
  'undefined': undefined,
  'null': null,
};
const PrimitiveKeys = Object.keys(Primitives);
const PrimitiveValues = Object.values(Primitives);
const Objects = {
  'object': Object,
  'array': Array,
};
const ObjectKeys$1 = Object.keys(Objects);
const ObjectValues = Object.values(Objects);
const Types = Object.assign({}, Primitives, Objects);
const TypeKeys$1 = Object.keys(Types);
const TypeValues = Object.values(Types);
const TypeMethods = [
 Primitives.String, Primitives.Number, Primitives.Boolean, 
 Objects.Object, Objects.Array
];

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ObjectKeys: ObjectKeys$1,
  ObjectValues: ObjectValues,
  Objects: Objects,
  PrimitiveKeys: PrimitiveKeys,
  PrimitiveValues: PrimitiveValues,
  Primitives: Primitives,
  TypeKeys: TypeKeys$1,
  TypeMethods: TypeMethods,
  TypeValues: TypeValues,
  Types: Types
});

var regularExpressions$3 = {
  quotationEscape: /\.(?=(?:[^"]*"[^"]*")*[^"]*$)/,
};

const typeOf$6 = ($data) => Object
  .prototype
  .toString
  .call($data).slice(8, -1).toLowerCase();

function subpaths($path) {
  return $path.split(
    new RegExp(regularExpressions$3.quotationEscape)
  )
}
function keypaths($path) {
  const _subpaths = subpaths($path);
  _subpaths.pop();
  return _subpaths
}
function key($path) { return subpaths($path).pop() }
function root($path) { return subpaths($path).shift() }
function typeofRoot($path) { return (
  Number(root($path))
) ? 'array' : 'object' }
function parse($path) {
  return {
    subpaths: subpaths($path),
    keypaths: keypaths($path),
    key: key($path),
    root: root($path),
    typeofRoot: typeofRoot($path),
  }
}

function typedObjectLiteral$e($value) {
  let _typedObjectLiteral;
  const typeOfValue = typeOf$6($value);
  if(typeOfValue === 'object') { _typedObjectLiteral = {}; }
  else if(typeOfValue === 'array') { _typedObjectLiteral = []; }
  else if(typeOfValue === 'string') {
    if($value === 'object') { _typedObjectLiteral = {}; }
    else if($value === 'array') { _typedObjectLiteral = []; }
  }
  else { _typedObjectLiteral = undefined; }
  return _typedObjectLiteral
}

function get($path, $source) {
  const subpaths = $path.split(new RegExp(regularExpressions$3.quotationEscape));
  const key = subpaths.pop();
  let subtarget = $source;
  for(const $subpath of subpaths) { subtarget = subtarget[$subpath]; }
  return subtarget[key]
}
function set($path, $source) {
  const {
    keypaths, key, typeofRoot
  } = parse($path);
  const target = typedObjectLiteral$e(typeofRoot);
  let subtarget = target;
  for(const $subpath of keypaths) {
    if(Number($subpath)) { subtarget[$subpath] = []; }
    else { subtarget[$subpath] = {}; }
    subtarget = subtarget[$subpath];
  }
  subtarget[key] = $source;
  return target
}

function expandTree($source, $property) {
  const typeOfProperty = typeOf$6($property);
  const typeOfSource = typeOf$6($source);
  if(
    !['string', 'function'].includes(typeOfProperty) ||
    !['array', 'object'].includes(typeOfSource)
  ) { return $source }
  let target = typedObjectLiteral$e($source);
  for(const [$sourceKey, $sourceValue] of Object.entries($source)) {
    if(typeOfProperty === 'string') { target[$sourceKey] = set($property, $sourceValue); }
    else if(typeOfProperty === 'function') { target[$sourceKey] = $property($sourceValue); }
    if(target[$sourceKey][$property] && typeof target[$sourceKey][$property] === 'object') {
      target[$sourceKey][$property] = expandTree(target[$sourceKey][$property], $property);
    }
  }
  return target
}

function impandTree$1($source, $property) {
  const typeOfProperty = typeOf$6($property);
  const typeOfSource = typeOf$6($source);
  if(
    !['string', 'function'].includes(typeOfProperty) ||
    !['array', 'object'].includes(typeOfSource)
  ) { return $source }
  let target = typedObjectLiteral$e($source);
  for(const [$sourceKey, $sourceValue] of Object.entries($source)) {
    if(typeOfProperty === 'string') { target[$sourceKey] = get($property, $sourceValue); }
    else if(typeOfProperty === 'function') { target[$sourceKey] = $property($sourceValue); }
    if(target[$sourceKey] && typeof target[$sourceKey] === 'object') {
      target[$sourceKey] = impandTree$1(target[$sourceKey], $property);
    }
  }
  return target
}

const Options$2 = {
  depth: 0,
  maxDepth: 10,
  accessors: [accessors.default],
};
function propertyDirectory($object, $options) {
  const _propertyDirectory = [];
  const options = Object.assign({}, Options$2, $options);
  options.depth++;
  if(options.depth > options.maxDepth) { return _propertyDirectory }
  iterateAccessors: 
  for(const $accessor of options.accessors) {
    const object = $accessor($object);
    if(!object) continue iterateAccessors
    for(const [$key, $value] of Object.entries(object)) {
      _propertyDirectory.push($key);
      if(
        typeof $value === 'object' &&
        $value !== null &&
        $value !== object
      ) {
        const subtarget = propertyDirectory($value, options);
        for(const $subtarget of subtarget) {
          let path;
          if(typeof $subtarget === 'object') {
            path = [$key, ...$subtarget].join('.');
          }
          else {
            path = [$key, $subtarget].join('.');
          }
          _propertyDirectory.push(path);
        }
      }
    }
  }
  return _propertyDirectory
}

function recursiveAssign$f($target, ...$sources) {
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    if(!$source) continue iterateSources
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfTargetPropertyValue = typeOf$6($target[$sourcePropertyKey]);
      const typeOfSourcePropertyValue = typeOf$6($sourcePropertyValue);
      if(
        typeOfTargetPropertyValue === 'object' &&
        typeOfSourcePropertyValue === 'object'
      ) {
        $target[$sourcePropertyKey] = recursiveAssign$f($target[$sourcePropertyKey], $sourcePropertyValue);
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
      const typeOfTargetPropertyValue = typeOf$6($target[$sourcePropertyKey]);
      const typeOfSourcePropertyValue = typeOf$6($sourcePropertyValue);
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

function recursiveFreeze$1($target) {
  for(const [$propertyKey, $propertyValue] of Object.entries($target)) {
    if($propertyValue && typeof $propertyValue === 'object') {
      recursiveFreeze$1($propertyValue);
    }
  }
  return Object.freeze($target)
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  accessors: accessors,
  expandEvents: expandEvents,
  expandTree: expandTree,
  impandTree: impandTree$1,
  propertyDirectory: propertyDirectory,
  recursiveAssign: recursiveAssign$f,
  recursiveAssignConcat: recursiveAssignConcat,
  recursiveFreeze: recursiveFreeze$1,
  regularExpressions: regularExpressions$3,
  typeOf: typeOf$6,
  typedObjectLiteral: typedObjectLiteral$e,
  variables: index$1
});

var Settings$1 = ($settings = {}) => {
  const Settings = {
    events: {},
    enableEvents: false,
    propertyDefinitions: {
      getEvents: 'getEvents',
      addEvents: 'addEvents',
      removeEvents: 'removeEvents',
      enableEvents: 'enableEvents',
      disableEvents: 'disableEvents',
      reenableEvents: 'reenableEvents',
      emitEvents: 'emitEvents',
    },
  };
  for(const [$settingKey, $settingValue] of Object.entries($settings)) {
    switch($settingKey) {
      case 'propertyDefinitions':
        Settings[$settingKey] = Object.assign(Settings[$settingKey], $settingValue);
        break
      default: 
        Settings[$settingKey] = $settingValue;
        break
    }
  }
  return Settings
};

function handleNoCommaBraces(span) {
    if (span.length < 3) {
        return "{" + span + "}";
    }
    var separatorI = -1;
    for (var i = 2; i < span.length; i++) {
        if (span[i] === '.' && span[i - 1] === '.' && (i < 2 || span[i - 2] !== '\\')) {
            if (separatorI > -1) {
                return "{" + span + "}";
            }
            separatorI = i - 1;
        }
    }
    if (separatorI > -1) {
        var rangeStart = span.substr(0, separatorI);
        var rangeEnd = span.substr(separatorI + 2);
        if (rangeStart.length > 0 && rangeEnd.length > 0) {
            return "[" + span.substr(0, separatorI) + "-" + span.substr(separatorI + 2) + "]";
        }
    }
    return "{" + span + "}";
}
function expand(pattern) {
    if (typeof pattern !== 'string') {
        throw new TypeError("A pattern must be a string, but " + typeof pattern + " given");
    }
    var scanning = false;
    var openingBraces = 0;
    var closingBraces = 0;
    var handledUntil = -1;
    var results = [''];
    var alternatives = [];
    var span;
    for (var i = 0; i < pattern.length; i++) {
        var char = pattern[i];
        if (char === '\\') {
            i++;
            continue;
        }
        if (char === '{') {
            if (scanning) {
                openingBraces++;
            }
            else if (i > handledUntil && !openingBraces) {
                span = pattern.substring(handledUntil + 1, i);
                for (var j = 0; j < results.length; j++) {
                    results[j] += span;
                }
                alternatives = [];
                handledUntil = i;
                scanning = true;
                openingBraces++;
            }
            else {
                openingBraces--;
            }
        }
        else if (char === '}') {
            if (scanning) {
                closingBraces++;
            }
            else if (closingBraces === 1) {
                span = pattern.substring(handledUntil + 1, i);
                if (alternatives.length > 0) {
                    var newResults = [];
                    alternatives.push(expand(span));
                    for (var j = 0; j < results.length; j++) {
                        for (var k = 0; k < alternatives.length; k++) {
                            for (var l = 0; l < alternatives[k].length; l++) {
                                newResults.push(results[j] + alternatives[k][l]);
                            }
                        }
                    }
                    results = newResults;
                }
                else {
                    span = handleNoCommaBraces(span);
                    for (var j = 0; j < results.length; j++) {
                        results[j] += span;
                    }
                }
                handledUntil = i;
                closingBraces--;
            }
            else {
                closingBraces--;
            }
        }
        else if (!scanning && char === ',' && closingBraces - openingBraces === 1) {
            span = pattern.substring(handledUntil + 1, i);
            alternatives.push(expand(span));
            handledUntil = i;
        }
        if (scanning && (closingBraces === openingBraces || i === pattern.length - 1)) {
            scanning = false;
            i = handledUntil - 1;
        }
    }
    if (handledUntil === -1) {
        return [pattern];
    }
    var unhandledFrom = pattern[handledUntil] === '{' ? handledUntil : handledUntil + 1;
    if (unhandledFrom < pattern.length) {
        span = pattern.substr(unhandledFrom);
        for (var j = 0; j < results.length; j++) {
            results[j] += span;
        }
    }
    return results;
}

function negate(pattern, options) {
    var supportNegation = options['!'] !== false;
    var supportParens = options['()'] !== false;
    var isNegated = false;
    var i;
    if (supportNegation) {
        for (i = 0; i < pattern.length && pattern[i] === '!'; i++) {
            if (supportParens && pattern[i + 1] === '(') {
                i--;
                break;
            }
            isNegated = !isNegated;
        }
        if (i > 0) {
            pattern = pattern.substr(i);
        }
    }
    return { pattern: pattern, isNegated: isNegated };
}

function escapeRegExpChar(char) { if (char === '-' ||
    char === '^' ||
    char === '$' ||
    char === '+' ||
    char === '.' ||
    char === '(' ||
    char === ')' ||
    char === '|' ||
    char === '[' ||
    char === ']' ||
    char === '{' ||
    char === '}' ||
    char === '*' ||
    char === '?' ||
    char === '\\') {
    return "\\" + char;
}
else {
    return char;
} }
function escapeRegExpString(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        result += escapeRegExpChar(str[i]);
    }
    return result;
}

function Pattern(source, options, excludeDot) {
    var separator = typeof options.separator === 'undefined' ? true : options.separator;
    var separatorSplitter = '';
    var separatorMatcher = '';
    var wildcard = '.';
    if (separator === true) {
        separatorSplitter = '/';
        separatorMatcher = '[/\\\\]';
        wildcard = '[^/\\\\]';
    }
    else if (separator) {
        separatorSplitter = separator;
        separatorMatcher = escapeRegExpString(separatorSplitter);
        if (separatorMatcher.length > 1) {
            separatorMatcher = "(?:" + separatorMatcher + ")";
            wildcard = "((?!" + separatorMatcher + ").)";
        }
        else {
            wildcard = "[^" + separatorMatcher + "]";
        }
    }
    else {
        wildcard = '.';
    }
    var requiredSeparator = separator ? separatorMatcher + "+?" : '';
    var optionalSeparator = separator ? separatorMatcher + "*?" : '';
    var segments = separator ? source.split(separatorSplitter) : [source];
    var support = {
        qMark: options['?'] !== false,
        star: options['*'] !== false,
        globstar: separator && options['**'] !== false,
        brackets: options['[]'] !== false,
        extglobs: options['()'] !== false,
        excludeDot: excludeDot && options.excludeDot !== false,
    };
    return {
        source: source,
        segments: segments,
        options: options,
        separator: separator,
        separatorSplitter: separatorSplitter,
        separatorMatcher: separatorMatcher,
        optionalSeparator: optionalSeparator,
        requiredSeparator: requiredSeparator,
        wildcard: wildcard,
        support: support,
    };
}
function Segment(source, pattern, isFirst, isLast) { return {
    source: source,
    isFirst: isFirst,
    isLast: isLast,
    end: source.length - 1,
}; }
function Result() {
return {
    match: '',
    unmatch: '',
    useUnmatch: false,
}; }
function State(pattern, segment, result) { return {
    pattern: pattern,
    segment: segment,
    result: result,
    openingBracket: segment.end + 1,
    closingBracket: -1,
    openingParens: 0,
    closingParens: 0,
    parensHandledUntil: -1,
    extglobModifiers: [],
    scanningForParens: false,
    escapeChar: false,
    addToMatch: true,
    addToUnmatch: pattern.support.extglobs,
    dotHandled: false,
    i: -1,
    char: '',
    nextChar: '',
}; }

var EXCLUDE_DOT_PATTERN = '(?!\\.)';
function add(state, addition, excludeDot) {
    if (state.addToUnmatch) {
        state.result.unmatch += addition;
    }
    if (state.addToMatch) {
        if (excludeDot && !state.dotHandled) {
            addition = EXCLUDE_DOT_PATTERN + addition;
        }
        state.dotHandled = true;
        state.result.match += addition;
    }
    return state.result;
}
function convertSegment(pattern, segment, result) {
    var support = pattern.support;
    var state = State(pattern, segment, result);
    var separatorMatcher = segment.isLast
        ? pattern.optionalSeparator
        : pattern.requiredSeparator;
    if (!support.excludeDot) {
        state.dotHandled = true;
    }
    if (segment.end === -1) {
        return segment.isLast && !segment.isFirst ? result : add(state, separatorMatcher);
    }
    if (support.globstar && segment.source === '**') {
        var prefix = !state.dotHandled ? EXCLUDE_DOT_PATTERN : '';
        var globstarSegment = prefix + pattern.wildcard + "*?" + separatorMatcher;
        return add(state, "(?:" + globstarSegment + ")*?");
    }
    while (++state.i <= segment.end) {
        state.char = state.segment.source[state.i];
        state.nextChar = state.i < segment.end ? segment.source[state.i + 1] : '';
        if (state.char === '\\') {
            if (state.i < state.segment.end) {
                state.escapeChar = true;
                continue;
            }
            else {
                state.char = '';
            }
        }
        var pattern = state.pattern, segment = state.segment, char = state.char, i = state.i;
        if (pattern.support.brackets && !state.scanningForParens) {
            if (i > state.openingBracket && i <= state.closingBracket) {
                if (state.escapeChar) {
                    add(state, escapeRegExpChar(char));
                }
                else if (i === state.closingBracket) {
                    add(state, ']');
                    state.openingBracket = segment.source.length;
                }
                else if (char === '-' && i === state.closingBracket - 1) {
                    add(state, '\\-');
                }
                else if (char === '!' && i === state.openingBracket + 1) {
                    add(state, '^');
                }
                else if (char === ']') {
                    add(state, '\\]');
                }
                else {
                    add(state, char);
                }
                state.escapeChar = false;
                continue;
            }
            if (i > state.openingBracket) {
                if (char === ']' &&
                    !state.escapeChar &&
                    i > state.openingBracket + 1 &&
                    i > state.closingBracket) {
                    state.closingBracket = i;
                    state.i = state.openingBracket;
                    if (pattern.separator) {
                        add(state, "(?!" + pattern.separatorMatcher + ")[", true);
                    }
                    else {
                        add(state, '[', true);
                    }
                }
                else if (i === segment.end) {
                    add(state, '\\[');
                    state.i = state.openingBracket;
                    state.openingBracket = segment.source.length;
                    state.closingBracket = segment.source.length;
                }
                state.escapeChar = false;
                continue;
            }
            if (char === '[' &&
                !state.escapeChar &&
                i > state.closingBracket &&
                i < segment.end) {
                state.openingBracket = i;
                state.escapeChar = false;
                continue;
            }
        }
        if (state.pattern.support.extglobs) {
            var extglobModifiers = state.extglobModifiers, char = state.char, nextChar = state.nextChar, i = state.i;
            if (nextChar === '(' &&
                !state.escapeChar &&
                (char === '@' || char === '?' || char === '*' || char === '+' || char === '!')) {
                if (state.scanningForParens) {
                    state.openingParens++;
                }
                else if (i > state.parensHandledUntil && !state.closingParens) {
                    state.parensHandledUntil = i;
                    state.scanningForParens = true;
                    state.openingParens++;
                }
                else if (state.closingParens >= state.openingParens) {
                    if (char === '!') {
                        state.addToMatch = true;
                        state.addToUnmatch = false;
                        add(state, state.pattern.wildcard + "*?", true);
                        state.addToMatch = false;
                        state.addToUnmatch = true;
                        state.result.useUnmatch = true;
                    }
                    extglobModifiers.push(char);
                    add(state, '(?:', true);
                    state.openingParens--;
                    state.i++;
                    continue;
                }
                else {
                    state.openingParens--;
                }
            }
            else if (char === ')' && !state.escapeChar) {
                if (state.scanningForParens) {
                    state.closingParens++;
                }
                else if (extglobModifiers.length) {
                    var modifier_1 = extglobModifiers.pop();
                    if (modifier_1 === '!' && extglobModifiers.indexOf('!') !== -1) {
                        throw new Error("Nested negated extglobs aren't supported");
                    }
                    modifier_1 = modifier_1 === '!' || modifier_1 === '@' ? '' : modifier_1;
                    add(state, ")" + modifier_1);
                    state.addToMatch = true;
                    state.addToUnmatch = true;
                    state.closingParens--;
                    continue;
                }
            }
            else if (char === '|' && state.closingParens &&
                !state.scanningForParens &&
                !state.escapeChar) {
                add(state, '|');
                continue;
            }
            if (state.scanningForParens) {
                if (state.closingParens === state.openingParens || i === state.segment.end) {
                    state.scanningForParens = false;
                    state.i = state.parensHandledUntil - 1;
                }
                state.escapeChar = false;
                continue;
            }
        }
        var pattern = state.pattern;
        var support = pattern.support;
        if (!state.escapeChar && support.star && state.char === '*') {
            if (state.i === state.segment.end || state.nextChar !== '*') {
                add(state, pattern.wildcard + "*?", true);
            }
        }
        else if (!state.escapeChar && support.qMark && state.char === '?') {
            add(state, pattern.wildcard, true);
        }
        else {
            add(state, escapeRegExpChar(state.char));
        }
        state.escapeChar = false;
    }
    return add(state, separatorMatcher);
}
function convert(source, options, excludeDot) {
    var pattern = Pattern(source, options, excludeDot);
    var result = Result();
    var segments = pattern.segments;
    for (var i = 0; i < segments.length; i++) {
        var segment = Segment(segments[i], pattern, i === 0, i === segments.length - 1);
        convertSegment(pattern, segment, result);
    }
    if (result.useUnmatch) {
        return "(?!^" + result.unmatch + "$)" + result.match;
    }
    else {
        return result.match;
    }
}

function flatMap(array, predicate) {
    var results = [];
    for (var i = 0; i < array.length; i++) {
        var mappedValue = predicate(array[i]);
        for (var j = 0; j < mappedValue.length; j++) {
            results.push(mappedValue[j]);
        }
    }
    return results;
}
function compile(patterns, options) {
    patterns = Array.isArray(patterns) ? patterns : [patterns];
    if (options['{}'] !== false) {
        patterns = flatMap(patterns, expand);
    }
    var positiveResults = [];
    var negativeResults = [];
    var result = '';
    for (var i = 0; i < patterns.length; i++) {
        var negatedPattern = negate(patterns[i], options);
        var convertedPattern = convert(negatedPattern.pattern, options, !negatedPattern.isNegated);
        if (negatedPattern.isNegated) {
            negativeResults.push(convertedPattern);
        }
        else {
            positiveResults.push(convertedPattern);
        }
    }
    if (negativeResults.length) {
        result = "(?!(?:" + negativeResults.join('|') + ")$)";
    }
    if (positiveResults.length > 1) {
        result += "(?:" + positiveResults.join('|') + ")";
    }
    else if (positiveResults.length === 1) {
        result += positiveResults[0];
    }
    else if (result.length) {
        result += convert('**', options, true);
    }
    return "^" + result + "$";
}
function isMatch(regexp, sample) { if (typeof sample !== 'string') {
    throw new TypeError("Sample must be a string, but " + typeof sample + " given");
} return regexp.test(sample); }
/**
 * Compiles one or more glob patterns into a RegExp and returns an isMatch function.
 * The isMatch function takes a sample string as its only argument and returns true
 * if the string matches the pattern(s).
 *
 * ```js
 * outmatch('src/*.js')('src/index.js') //=> true
 * ```
 *
 * ```js
 * const isMatch = outmatch('*.example.com', '.')
 * isMatch('foo.example.com') //=> true
 * isMatch('foo.bar.com') //=> false
 * ```
 */
function outmatch(pattern, options) {
    if (typeof pattern !== 'string' && !Array.isArray(pattern)) {
        throw new TypeError("The first argument must be a single pattern string or an array of patterns, but " + typeof pattern + " given");
    }
    if (typeof options === 'string' || typeof options === 'boolean') {
        options = { separator: options };
    }
    if (arguments.length === 2 &&
        !(typeof options === 'undefined' ||
            (typeof options === 'object' && options !== null && !Array.isArray(options)))) {
        throw new TypeError("The second argument must be an options object or a string/boolean separator, but " + typeof options + " given");
    }
    options = options || {};
    if (options.separator === '\\') {
        throw new Error('\\ is not a valid separator');
    }
    var regexpPattern = compile(pattern, options);
    var regexp = new RegExp(regexpPattern, options.flags);
    var fn = isMatch.bind(null, regexp);
    fn.options = options;
    fn.pattern = pattern;
    fn.regexp = regexp;
    return fn;
}

var Settings = ($settings = {}) => {
  const Settings = {
    enable: false,
    accessors: [accessors.default],
    propertyDirectory: { scopeKey: $settings.scopeKey, maxDepth: 10 },
    assign: 'addEventListener', deassign: 'removeEventListener', transsign: 'dispatchEvent',
    bindListener: true,
    scopeKey: ':scope',
    errorLog: false,
    methods: {
      assign: {
        addEventListener: function addEventListener($eventDefinition, $target) {
          const { type, listener, settings } = $eventDefinition;
          const { options, useCapture } = settings;
          return $target['addEventListener'](type, listener, options || useCapture)
        },
        on: function on($eventDefinition, $target) {
          const { type, listener } = $eventDefinition;
          return $target['on'](type, listener)
        },
        once: function once($eventDefinition, $target) {
          const { type, listener } = $eventDefinition;
          return $target['once'](type, listener)
        },
      }, 
      deassign: {
        removeEventListener: function removeEventListener($eventDefinition, $target) {
          const { type, listener, settings } = $eventDefinition;
          const { options, useCapture } = settings;
          return $target['removeEventListener'](type, listener, options || useCapture)
        },
        off: function off($eventDefinition, $target) {
          const { type, listener } = $eventDefinition;
          return $target['off'](type, listener)
        },
      },
      transsign: {
        dispatchEvent: function dispatchEvent($eventDefinition, $target, $event) {
          return $target['dispatchEvent']($event)
        },
        emit: function emit($eventDefinition, $target, $type, ...$arguments) {
          return $target['emit']($type, ...$arguments)
        },
      },
    },
  };
  for(const [$settingKey, $settingValue] of Object.entries($settings)) {
    switch($settingKey) {
      case 'propertyDirectory':
        Settings[$settingKey] = Object.assign(Settings[$settingKey], $settingValue);
        break
      case 'accessors':
        Settings[$settingKey] = $settingValue;
        Settings.propertyDirectory[$settingKey] = $settingValue;
        break
      case 'methods': 
        Settings[$settingKey] = recursiveAssign$f(Settings[$settingKey], $settingValue);
        break
      case 'enableEvents': break
      default: 
        Settings[$settingKey] = $settingValue;
        break
    }
  }
  return Settings
};

class EventDefinition {
  #settings
  #context
  #listener
  #enable = false
  #path
  #assigned = []
  #deassigned = []
  #transsigned = []
  #nontranssigned = []
  #_targets = []
  #_assign
  #_deassign
  #_transsign
  constructor($settings, $context) { 
    if(!$settings || !$context) { return this }
    this.#settings = Settings($settings);
    this.#context = $context;
    this.enable = this.settings.enable;
  }
  get settings() { return this.#settings }
  get path() { return this.settings.path }
  get type() { return this.settings.type }
  get listener() {
    if(this.#listener !== undefined) { return this.#listener }
    const listener = this.settings.listener;
    if(this.settings.bindListener === true) {
      this.#listener = listener.bind(this.#context);
    }
    else { this.#listener = listener; }
    return this.#listener
  }
  get enable() { return this.#enable }
  set enable($enable) {
    const targets = this.#targets;
    const assigned = this.#assigned;
    const deassigned = this.#deassigned;
    assigned.length = 0;
    deassigned.length = 0;
    iterateTargetElements: 
    for(const $targetElement of targets) {
      const { path, target, enable } = $targetElement;
      this.settings;
      if(enable === $enable) { continue iterateTargetElements }
      if($enable === true) {
        try {
          this.#assign(target);
          $targetElement.enable = $enable;
          assigned.push($targetElement);
          
        }
        catch($err) { if(this.settings.errorLog) { console.error($err); } }
      }
      else if($enable === false) {
        try {
          this.#deassign(target);
          $targetElement.enable = $enable;
          deassigned.push($targetElement);
        }
        catch($err) { if(this.settings.errorLog) { console.error($err); } }
      }
    }
    this.#enable = $enable;
  }
  get assigned() { return this.#assigned }
  get deassigned() { return this.#deassigned }
  get #target() { return this.settings.target }
  get #targets() {
    const pretargets = this.#_targets;
    const targets = [];
    if(this.#target) {
      for(const $target of [].concat(this.#target)) {
        const pretargetElement = pretargets.find(
          ($pretarget) => $pretarget?.path === this.path
        );
        if(pretargetElement !== undefined) {
          targets.push(pretargetElement);
        }
        else if(pretargetElement === undefined) {
          targets.push({
            path: this.path,
            target: $target,
            enable: false,
          });
        }
      }
    }
    else if(typeOf$6(this.path) === 'string') {
      const targetPaths = [];
      if(this.path === this.#scopeKey) {
        const targetElement = {
          path: this.path,
          target: this.#context,
          enable: false,
        };
        targets.push(targetElement);
      }
      else {
        if(this.settings.propertyDirectory) {
          const propertyDirectory = this.#propertyDirectory;
          const propertyPathMatcher = outmatch(this.path, {
            separator: '.',
          });
          for(const $propertyPath of propertyDirectory) {
            const propertyPathMatch = propertyPathMatcher($propertyPath);
            if(propertyPathMatch === true) { targetPaths.push($propertyPath); }
          }
          if(this.path.charAt(0) === '*') {
            targetPaths.unshift(this.#scopeKey);
          }
        }
        else {
          targetPaths.push(this.path);
        }
        for(const $targetPath of targetPaths) {
          const pretargetElement = pretargets.find(
            ($pretarget) => $pretarget.path === $targetPath
          );
          let target = this.#context;
          let targetElement;
          const pathKeys = $targetPath.split('.');
          let pathKeysIndex = 0;
          iterateTargetPathKeys: 
          while(pathKeysIndex < pathKeys.length) {
            let pathKey = pathKeys[pathKeysIndex];
            if(pathKey === this.#scopeKey) { break iterateTargetPathKeys }
            iterateTargetAccessors: 
            for(const $targetAccessor of this.settings.accessors) {
              try { target = $targetAccessor(target, pathKey); }
              catch($err) { if(this.settings.errorLog) { console.error($err); } }
              if(target !== undefined) { break iterateTargetAccessors }
            }
            pathKeysIndex++;
          }
          if(target !== undefined) {
            if(target === pretargetElement?.target) {
              targetElement = pretargetElement;
            }
            else if(typeof target === 'object') {
              targetElement = {
                path: $targetPath,
                target: target,
                enable: false,
              };
            }
          }
          if(targetElement !== undefined) { targets.push(targetElement); }
        }
      }
    }
    this.#_targets = targets;
    return this.#_targets
  }
  get #scopeKey() { return this.settings.scopeKey }
  get #assign() {
    if(this.#_assign !== undefined) { return this.#_assign }
    this.#_assign = this.settings.methods.assign[this.settings.assign].bind(null, this);
    return this.#_assign
  }
  get #deassign() {
    if(this.#_deassign !== undefined) { return this.#_deassign }
    this.#_deassign = this.settings.methods.deassign[this.settings.deassign].bind(null, this);
    return this.#_deassign
  }
  get #transsign() {
    if(this.#_transsign !== undefined) { return this.#_transsign }
    this.#_transsign = this.settings.methods.transsign[this.settings.transsign].bind(null, this);
    return this.#_transsign
  }
  get #methods() { return this.settings.methods }
  get #propertyDirectory() {
    if(!this.settings.propertyDirectory) { return null }
    const propertyDirectorySettings = ({
      accessors: this.settings.accessors
    }, this.settings.propertyDirectory);
    return propertyDirectory(this.#context, propertyDirectorySettings)
  }
  emit() {
    const targets = this.#targets;
    const transsigned = this.#transsigned;
    const nontranssigned = this.#nontranssigned;
    transsigned.length = 0;
    nontranssigned.length = 0;
    for(const $targetElement of targets) {
      const { target } = $targetElement;
      try {
        this.#transsign(target, ...arguments);
        transsigned.push($targetElement);
      }
      catch($err) { nontranssigned.push($targetElement); }
    }
    return this
  }
}

class Core extends EventTarget {
  static implement = function ($target, $settings) {
    if(!$target || !$settings) { return undefined }
    const settings = Settings$1($settings);
    const events = [];
    Object.defineProperties($target, {
      [settings.propertyDefinitions.getEvents]: {
        enumerable: false, writable: false, 
        value: function getEvents() {
          if(!arguments[0]) { return events }
          const getEvents = [];
          const $filterEvents = [].concat(arguments[0]);
          for(const $filterEvent of $filterEvents) {
            for(const $event of events) {
              let match;
              iterateEventFilterProperties: 
              for(const [
                $filterEventPropertyKey, $filterEventPropertyValue
              ] of Object.entries($filterEvent)) {
                let eventFilterMatch;
                if($filterEventPropertyKey === 'listener') {
                  eventFilterMatch = (
                    $event.settings[$filterEventPropertyKey] === $filterEventPropertyValue
                  );
                }
                else {
                  eventFilterMatch = (
                    $event[$filterEventPropertyKey] === $filterEventPropertyValue
                  );
                }
                if(match !== false) { match = eventFilterMatch; }
                else { break iterateEventFilterProperties }
              }
              if(match === true) { getEvents.push($event); }
            }
          }
          return getEvents
        }
      },
      [settings.propertyDefinitions.addEvents]: {
        enumerable: false, writable: false, 
        value: function addEvents() {
          if(!arguments.length) { return $target }
          let $addEvents = expandEvents(arguments[0], settings.scopeKey);
          let $enableEvents = arguments[1] || false;
          for(let $addEvent of $addEvents) {
            const event = {};
            for(const $settingKey of [
              'accessors', 'assign', 'deassign', 'transsign', 'propertyDirectory'
            ]) {
              const settingValue = settings[$settingKey];
              if(settingValue !== undefined) { event[$settingKey] = settingValue; }
            }
            recursiveAssign$f(event, $addEvent);
            const eventDefinition = new EventDefinition(event, $target);
            if($enableEvents) { eventDefinition.enable = true; }
            events.push(eventDefinition);
          }
          return $target
        },
      },
      [settings.propertyDefinitions.removeEvents]: {
        enumerable: false, writable: false, 
        value: function removeEvents() {
          const $events = $target[settings.propertyDefinitions.getEvents](arguments[0]);
          if($events.length === 0) return $target
          let eventsIndex = events.length - 1;
          while(eventsIndex > -1) {
            const event = events[eventsIndex];
            if($events.includes(event)) {
              event.enable = false;
              events.splice(eventsIndex, 1);
            }
            eventsIndex--;
          }
          return $target
        }
      },
      [settings.propertyDefinitions.enableEvents]: {
        enumerable: false, writable: false, 
        value: function enableEvents() {
          const $events = $target[settings.propertyDefinitions.getEvents](arguments[0]);
          if($events.length === 0) return $target
          for(const $event of $events) { $event.enable = true; }
          return $target
        },
      },
      [settings.propertyDefinitions.disableEvents]: {
        enumerable: false, writable: false, 
        value: function disableEvents() {
          const $events = $target[settings.propertyDefinitions.getEvents](arguments[0]);
          if($events.length === 0) return $target
          for(const $event of $events) { $event.enable = false; }
          return $target
        },
      },
      [settings.propertyDefinitions.reenableEvents]: {
        enumerable: false, writable: false, 
        value: function reenableEvents() {
          const $events = $target[settings.propertyDefinitions.getEvents](arguments[0]);
          for(const $event of $events) {
            $event.enable = false;
            $event.enable = true;
          }
          return $target
        },
      },
      [settings.propertyDefinitions.emitEvents]: {
        enumerable: false, writable: false, 
        value: function emitEvents($filterEvents, ...$eventParameters) {
          const $events = $target[settings.propertyDefinitions.getEvents]($filterEvents);
          for(const $event of $events) {
            $event.emit(...$eventParameters);
          }
          return $target
        },
      },
    });
    if(settings.events) { $target[settings.propertyDefinitions.addEvents](settings.events); }
    if(settings.enableEvents === true) { $target[settings.propertyDefinitions.enableEvents](); }
    return $target
  }
  constructor($settings = {}) {
    super();
    return Core.implement(this, $settings)
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

const { typedObjectLiteral: typedObjectLiteral$d } = index;
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

const { recursiveAssign: recursiveAssign$e } = index;
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
            value: $value,
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

const { recursiveAssign: recursiveAssign$d, typedObjectLiteral: typedObjectLiteral$c } = index;
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

const { typeOf: typeOf$5, variables: variables$1 } = index;
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

const { recursiveAssign: recursiveAssign$c } = index;
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

const { typedObjectLiteral: typedObjectLiteral$b, typeOf: typeOf$4, variables } = index;

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

const { recursiveAssign: recursiveAssign$b } = index;
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
      // 'value': { configurable: true, get () {
      //   const value = $settings.value
      //   Object.defineProperty(this, 'value', { value: value, })
      //   return value
      // } },
      'valid': { configurable: true, get () {
        const valid = $settings.valid;
        Object.defineProperty(this, 'valid', { value: valid });
        return valid
      } },
    });
  }
};

const { recursiveAssign: recursiveAssign$a, typedObjectLiteral: typedObjectLiteral$a } = index;
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

const { typedObjectLiteral: typedObjectLiteral$9 } = index;
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

const { impandTree, recursiveAssign: recursiveAssign$9, typedObjectLiteral: typedObjectLiteral$8 } = index;
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

const { typedObjectLiteral: typedObjectLiteral$7 } = index;
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

const { typedObjectLiteral: typedObjectLiteral$6 } = index;
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

const { recursiveAssign: recursiveAssign$8, typedObjectLiteral: typedObjectLiteral$5, typeOf: typeOf$3 } = index;
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

const { typedObjectLiteral: typedObjectLiteral$4 } = index;
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

const { recursiveAssign: recursiveAssign$7, typedObjectLiteral: typedObjectLiteral$3, typeOf: typeOf$2 } = index;
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

const { regularExpressions: regularExpressions$2} = index;
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

const { recursiveAssign: recursiveAssign$6 } = index;
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

const { recursiveAssign: recursiveAssign$5, regularExpressions: regularExpressions$1, typedObjectLiteral: typedObjectLiteral$2, typeOf: typeOf$1 } = index;
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

const { recursiveAssign: recursiveAssign$4 } = index;
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

const { regularExpressions} = index;
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

const { recursiveAssign: recursiveAssign$3 } = index;
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

const { recursiveAssign: recursiveAssign$2, recursiveFreeze } = index;
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

const { recursiveAssign: recursiveAssign$1, typedObjectLiteral: typedObjectLiteral$1 } = index;
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

const { typedObjectLiteral, typeOf } = index;

class Model extends Core {
  static accessors = Object.freeze([($target, $property) => {
    if($property === undefined) { return $target.target }
    else { return $target.get($property) }
  }, ($target, $property) => {
    if($property === undefined) { return $target }
    else { return $target[$property] }
  }])
  constructor($properties = {}, $schema = null, $options = {}) {
    super({ accessors: Model.accessors });
    const properties = ($properties instanceof Model) ? $properties.valueOf() : $properties;
    Object.defineProperty(this, 'options', { configurable: true, get() {
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
    } });
    Object.defineProperty(this, 'target', { configurable: true, get() {
      const target = typedObjectLiteral(properties);
      Object.defineProperty(this, 'target', { value: target });
      return target
    } });
    Object.defineProperty(this, 'type', { configurable: true, get() {
      const type = typeOf(this.target);
      Object.defineProperty(this, 'type', { value: type });
      return type
    } });
    Object.defineProperty(this, 'schema', { configurable: true, get() {
      const typeOfSchema = typeOf($schema);
      let schema;
      if(['undefined', 'null'].includes(typeOfSchema)) { schema = null; }
      else if($schema instanceof Schema) { schema = $schema; }
      else if(['array', 'object'].includes(typeOfSchema)) { schema = new Schema($schema); }
      Object.defineProperty(this, 'schema', { value: schema });
      return schema
    } });
    Object.defineProperty(this, 'parent', { configurable: true, get() {
      const options = this.options;
      const parent = (options.parent) ? options.parent : null;
      Object.defineProperty(this, 'parent', { value: parent });
      return parent
    } });
    Object.defineProperty(this, 'path', { configurable: true, get() {
      const options = this.options;
      let path = (options.path) ? String(options.path) : null;
      Object.defineProperty(this, 'path', { value: path });
      return path
    } });
    Object.defineProperty(this, 'key', { configurable: true, get() {
      let key = (this.path) ? this.path.split('.').pop() : null;
      Object.defineProperty(this, 'key', {
         value: key
      });
      return key
    } });
    Object.defineProperty(this, 'root', { get() {
      let root = this;
      iterateParents: 
      while(root) {
        if([undefined, null].includes(root.parent)) { break iterateParents }
        root = root.parent;
      }
      return root
    } });
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
//# sourceMappingURL=objecture.js.map
