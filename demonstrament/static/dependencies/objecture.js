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

const typeOf$7 = ($data) => Object
  .prototype
  .toString
  .call($data).slice(8, -1).toLowerCase();

function typedObjectLiteral$d($value) {
  let _typedObjectLiteral;
  const typeOfValue = typeOf$7($value);
  if(typeOfValue === 'object') { _typedObjectLiteral = {}; }
  else if(typeOfValue === 'array') { _typedObjectLiteral = []; }
  else if(typeOfValue === 'string') {
    if($value === 'object') { _typedObjectLiteral = {}; }
    else if($value === 'array') { _typedObjectLiteral = []; }
  }
  else { _typedObjectLiteral = undefined; }
  return _typedObjectLiteral
}

function createSubtarget($sourceValue, $path) {
  const subpaths = $path.split('.');
  let subpathIndex = 0;
  const subtarget = {};
  let subtargetTerminal = subtarget;
  for(const $subpath of subpaths) {
    if(subpathIndex === subpaths.length - 1) {
      if($sourceValue && typeof $sourceValue === 'object') {
        subtargetTerminal[$subpath] = expandTree$1($sourceValue, $path);
      }
      else {
        subtargetTerminal[$subpath] = $sourceValue;
      }
    }
    else {
      subtargetTerminal[$subpath] = {};
      subtargetTerminal = subtargetTerminal[$subpath];
    }
    subpathIndex++;
  }
  return subtarget
}

function expandTree$1($source, $path) {
  const target = {};
  const typeofSource = typeof $source;
  const typeofPath = typeof $path;
  if($source && typeofSource === 'object') {
    for(const [$sourceKey, $sourceValue] of Object.entries($source)) {
      if(typeofPath === 'function') {
        $path(target, $sourceKey, $sourceValue);
      }
      else {
        const subtarget = createSubtarget($sourceValue, $path);
        target[$sourceKey] = subtarget;
      }
    }
  }
  else {
    Object.assign(target, createSubtarget($source, $path));
  }
  return target
}

function isPropertyDefinition$1($propertyDefinition) {
  if(
    Object.getOwnPropertyDescriptor($propertyDefinition, 'type') &&
    (
      TypeValues.includes($propertyDefinition.type) ||
      TypeKeys.includes($propertyDefinition.type)
    ) || (
      typeof $propertyDefinition.type === 'object' &&
      Object.getOwnPropertyDescriptor($propertyDefinition.type, 'value') &&
      (
        TypeValues.includes($propertyDefinition.type.value) ||
        TypeKeys.includes($propertyDefinition.type.value)
      )
    )
  ) { return true } 
  else { return false }
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

function recursiveAssign$e($target, ...$sources) {
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    if(!$source) continue iterateSources
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfTargetPropertyValue = typeOf$7($target[$sourcePropertyKey]);
      const typeOfSourcePropertyValue = typeOf$7($sourcePropertyValue);
      if(
        typeOfTargetPropertyValue === 'object' &&
        typeOfSourcePropertyValue === 'object'
      ) {
        $target[$sourcePropertyKey] = recursiveAssign$e($target[$sourcePropertyKey], $sourcePropertyValue);
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
      const typeOfTargetPropertyValue = typeOf$7($target[$sourcePropertyKey]);
      const typeOfSourcePropertyValue = typeOf$7($sourcePropertyValue);
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

var index$2 = {
  quotationEscape: /\.(?=(?:[^"]*"[^"]*")*[^"]*$)/,
};

function recursiveFreeze$1($target) {
  for(const [$propertyKey, $propertyValue] of Object.entries($target)) {
    if($propertyValue && typeof $propertyValue === 'object') {
      recursiveFreeze$1($propertyValue);
    }
  }
  return Object.freeze($target)
}

const Primitives = {
  'string': String, 
  'number': Number, 
  'boolean': Boolean, 
  'undefined': undefined,
  'null': null,
};
const PrimitiveKeys$1 = Object.keys(Primitives);
const PrimitiveValues = Object.values(Primitives);
const Objects = {
  'object': Object,
  'array': Array,
};
const ObjectKeys$1 = Object.keys(Objects);
const ObjectValues = Object.values(Objects);
const Types = Object.assign({}, Primitives, Objects);
const TypeKeys = Object.keys(Types);
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
  PrimitiveKeys: PrimitiveKeys$1,
  PrimitiveValues: PrimitiveValues,
  Primitives: Primitives,
  TypeKeys: TypeKeys,
  TypeMethods: TypeMethods,
  TypeValues: TypeValues,
  Types: Types
});

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  accessors: accessors,
  expandEvents: expandEvents,
  expandTree: expandTree$1,
  isPropertyDefinition: isPropertyDefinition$1,
  propertyDirectory: propertyDirectory,
  recursiveAssign: recursiveAssign$e,
  recursiveAssignConcat: recursiveAssignConcat,
  recursiveFreeze: recursiveFreeze$1,
  regularExpressions: index$2,
  typeOf: typeOf$7,
  typedObjectLiteral: typedObjectLiteral$d,
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
        Settings[$settingKey] = recursiveAssign$e(Settings[$settingKey], $settingValue);
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
    else if(typeOf$7(this.path) === 'string') {
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
          for(let $addEvent of $addEvents) {
            const event = {};
            for(const $settingKey of [
              'accessors', 'assign', 'deassign', 'transsign', 'propertyDirectory'
            ]) {
              const settingValue = settings[$settingKey];
              if(settingValue !== undefined) { event[$settingKey] = settingValue; }
            }
            recursiveAssign$e(event, $addEvent);
            const eventDefinition = new EventDefinition(event, $target);
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
  #settings
  #message
  #pass
  constructor($settings) {
    super();
    this.#settings = $settings;
  }
  get type() { return this.#settings.type }
  get definition() { return this.#settings.definition }
  get key() { return this.#settings.key }
  get value() { return this.#settings.value }
  get message() {
    if(this.#message !== undefined) return this.#message
    if(
      this.pass !== undefined &&
      this.#message === undefined
    ) {
      this.#message = this.#settings.messages[String(this.pass)](this);
    }
    return this.#message
  }
  get pass() { return this.#pass }
  set pass($pass) {
    if(this.#pass === undefined) {
      this.#pass = $pass;
    }
  }
}

const { recursiveAssign: recursiveAssign$d } = index;
const Messages$1 = {
  'true': ($verification) => `${$verification.pass}`,
  'false': ($verification) => `${$verification.pass}`,
};
class Validator extends EventTarget {
  #boundValidate
  #definition
  #schema
  constructor($definition = {}, $schema) {
    super();
    this.definition = Object.freeze(
      Object.assign({ messages: Messages$1 }, $definition)
    );
    this.schema = $schema;
  }
  get definition() { return this.#definition }
  set definition($definition) { this.#definition = $definition; }
  get schema() { return this.#schema }
  set schema($schema) {
    if(this.#schema !== undefined) { return this.#schema }
    this.#schema = $schema;
    return this.#schema
  }
  get type() { return this.definition.type }
  get messages() { return this.definition.messages }
  get validate() {
    function validate($key, $value, $source, $target) {
      const definition = this.definition;
      const verification = new Verification({
        type: this.type,
        definition: definition,
        key: $key,
        value: $value,
        messages: recursiveAssign$d({}, this.messages, definition.messages),
      });
      verification.pass = definition.validate(...arguments);
      return verification
    }
    this.#boundValidate = validate.bind(this);
    return this.#boundValidate
  }
}

const { recursiveAssign: recursiveAssign$c, typedObjectLiteral: typedObjectLiteral$c } = index;
class RequiredValidator extends Validator {
  constructor($definition, $schema) {
    super(Object.assign($definition, {
      type: 'required',
      validate: ($key, $value, $source, $target) => {
        this.definition;
        let pass;
        const { requiredProperties, requiredPropertiesSize, type } = this.schema;
        if(requiredPropertiesSize === 0/* || definition.value === false*/) { pass = true; }
        else if(type === 'object') {
          const corequiredContextProperties = typedObjectLiteral$c(type);
          const corequiredModelProperties = typedObjectLiteral$c(type);
          iterateRequiredProperties: 
          for(const [
            $requiredPropertyName, $requiredProperty
          ] of Object.entries(requiredProperties)) {
            const requiredProperty = recursiveAssign$c({}, $requiredProperty);
            // ?:START
            requiredProperty.required.value = false;
            // ?:STOP
            if($requiredPropertyName === $key) { continue iterateRequiredProperties }
            const sourcePropertyDescriptor = Object.getOwnPropertyDescriptor($source, $requiredPropertyName);
            if(sourcePropertyDescriptor !== undefined) {
              corequiredContextProperties[$requiredPropertyName] = requiredProperty;
              corequiredModelProperties[$requiredPropertyName] = sourcePropertyDescriptor.value;
            }
            else if($target) {
              const targetPropertyDescriptor = Object.getOwnPropertyDescriptor($target, $requiredPropertyName);
              if(targetPropertyDescriptor !== undefined) { continue iterateRequiredProperties }
              else { corequiredContextProperties[$requiredPropertyName] = requiredProperty; }
            }
            else {
              corequiredContextProperties[$requiredPropertyName] = requiredProperty;
            }
          }
          const corequiredContextPropertiesSize = Object.keys(corequiredContextProperties).length;
          const corequiredModelPropertiesSize = Object.keys(corequiredModelProperties).length;
          if(corequiredContextPropertiesSize === 0 && corequiredModelPropertiesSize === 0) { pass = true; }
          else if(corequiredContextPropertiesSize !== corequiredModelPropertiesSize) { pass = false; }
          else {
            const coschema = new Schema(corequiredContextProperties, Object.assign({}, this.schema.options, {
              required: false 
            }));
            const validations = [];
            for(const [
              $corequiredContextPropertyName, $corequiredContextProperty
            ] of Object.entries(corequiredModelProperties)) {
              const corequiredModelPropertyName = $corequiredContextPropertyName;
              const corequiredModelProperty = corequiredModelProperties[corequiredModelPropertyName];
              const coschemaPropertyValidation = coschema.validateProperty(
                $corequiredContextPropertyName, corequiredModelProperty,
                $source, $target
              );
              validations.push(coschemaPropertyValidation);
            }
            const nonvalidValidation = (validations.find(($validation) => $validation.valid === false));
            if(nonvalidValidation) { pass = false; }
            else { pass = true; }
          }
        }
        else if(type === 'array') {
          pass = true;
        }
        return pass
      }
    }), $schema);
  }
}

const { typeOf: typeOf$6, variables: variables$1 } = index;
const { PrimitiveKeys, ObjectKeys } = variables$1;
class TypeValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign($definition, {
      type: 'type',
      validate: ($key, $value) => {
        let pass;
        const definition = this.definition;
        const typeOfDefinitionValue = (typeOf$6(definition.value) === 'function')
          ? typeOf$6(definition.value())
          : typeOf$6(definition.value);
        if(PrimitiveKeys.concat(ObjectKeys).includes(typeOfDefinitionValue)) {
          const typeOfModelValue = typeOf$6($value);
          if(typeOfModelValue === 'undefined') { pass = false; }
          else if(typeOfDefinitionValue === 'undefined') { pass = true; }
          else { pass = (typeOfDefinitionValue === typeOfModelValue); }
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

class Handler {
  #context
  constructor($context) {
    this.#context = $context;
  }
}

const {
  expandTree, isPropertyDefinition, typedObjectLiteral: typedObjectLiteral$b, typeOf: typeOf$5, variables
} = index;
class Context extends EventTarget {
  #properties
  #schema
  #type
  #proxy
  #target
  #_handler
  constructor($properties, $schema) {
    super();
    this.#properties = $properties;
    this.schema = $schema;
    return this.proxy
  }
  get required() { return this.schema.options.required }
  get schema() { return this.#schema }
  set schema($schema) {
    if(this.#schema !== undefined) return
    this.#schema = $schema;
    return this.#schema
  }
  get type() {
    if(this.#type !== undefined) return this.#type
    this.#type = typeOf$5(this.#properties);
    return this.#type
  }
  get proxy() {
    if(this.#proxy !== undefined) return this.#proxy
    this.#proxy = new Proxy(this.target, this.#handler);
    return this.#proxy
  }
  get #handler() {
    if(this.#_handler !== undefined) return this.#_handler
    this.#_handler = new Handler(this);
    return this.#_handler
  }
  get target() {
    if(this.#target !== undefined) return this.#target
    let properties;
    const target = typedObjectLiteral$b(this.type);
    if(this.type === 'array') {
      properties = this.#properties.slice(0, 1);
    }
    else if(this.type === 'object') {
      properties = this.#properties;
    }
    for(const [
      $propertyKey, $propertyDefinition
    ] of Object.entries(properties)) {
      const typeOfPropertyDefinition = typeOf$5($propertyDefinition);
      let propertyDefinition;
      if($propertyDefinition instanceof Schema) {
        propertyDefinition = $propertyDefinition;
      }
      else if(variables.TypeValues.includes($propertyDefinition)) {
        propertyDefinition = expandTree($propertyDefinition, 'type.value');
      }
      else if(variables.TypeKeys.includes($propertyDefinition)) {
        propertyDefinition = expandTree(variables.TypeValues[
          variables.TypeKeys.indexOf($propertyDefinition)
        ], 'type.value');
      }
      else if(['array', 'object'].includes(typeOfPropertyDefinition)) {
        let propertyDefinitionIsPropertyDefinition = isPropertyDefinition($propertyDefinition);
        if(propertyDefinitionIsPropertyDefinition === false) {
          const { path } = this.schema;
          const schemaPath = (path)
            ? [path, $propertyKey].join('.')
            : String($propertyKey);
          const parent = this.schema;
          const schemaOptions = Object.assign({}, this.schema.options, {
            path: schemaPath,
            parent: parent,
          });
          propertyDefinition = new Schema($propertyDefinition, schemaOptions);
        }
        else if(propertyDefinitionIsPropertyDefinition === true) {
          propertyDefinition = { validators: [] };
          iteratePropertyValidators: 
          for(const [
            $propertyValidatorName, $propertyValidator
          ] of Object.entries($propertyDefinition)) {
            if($propertyValidatorName === 'validators') { continue iteratePropertyValidators }
            const typeOfPropertyValidator = typeOf$5($propertyValidator);
            let propertyValidator;
            if(typeOfPropertyValidator === 'object') {
              propertyValidator = $propertyValidator;
            }
            else {
              propertyValidator = {
                value: $propertyValidator
              };
            }
            propertyDefinition[$propertyValidatorName] = propertyValidator;
          }
          $propertyDefinition.validators = $propertyDefinition.validators || [];
          for(const $propertyDefinitionValidator of $propertyDefinition.validators) {
            for(const $Validator of [
              RequiredValidator, TypeValidator, RangeValidator, LengthValidator, EnumValidator, MatchValidator
            ]) {
              if($propertyDefinitionValidator instanceof $Validator === false) {
                propertyDefinition.validators.push($propertyDefinitionValidator);
              }
            }
          }
        }
      }
      // throw "Objecture"
      if(propertyDefinition instanceof Schema === false) {
        propertyDefinition = this.#parsePropertyDefinition(propertyDefinition);
      }
      target[$propertyKey] = propertyDefinition;
    }
    this.#target = target;
    return this.#target
  }
  #parsePropertyDefinition($propertyDefinition) {
    const propertyDefinition = $propertyDefinition;
    propertyDefinition.validators = [];
    const validators = new Map();
    const contextRequired = this.required;
    const {
      required,
      type,
      range, min, max, 
      length, minLength, maxLength, 
      match,
    } = propertyDefinition;
    if(contextRequired === true) { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: true, validator: RequiredValidator 
    })); }
    else if(required?.value === true) { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: true, validator: RequiredValidator  }));
    }
    else { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: false, validator: RequiredValidator 
    })); }
    if(type) { validators.set('type', Object.assign({}, type, {
      type: 'type', validator: TypeValidator
    })); }
    else { validators.set('type', Object.assign({}, type, {
      type: 'type', value: undefined, validator: TypeValidator
    })); }
    if(range) { validators.set('range', Object.assign({}, range, {
      type: 'range', validator: RangeValidator
    })); }
    else if(min || max) { validators.set('range', Object.assign({}, {
      type: 'range', min, max, validator: RangeValidator
    })); }
    if(length) { validators.set('length', Object.assign({}, length, {
      type: 'length', validator: LengthValidator
    })); }
    else if(minLength || maxLength) { validators.set('length', Object.assign({}, {
      type: 'length', min: minLength, max: maxLength, validator: LengthValidator
    })); }
    if(propertyDefinition.enum) { validators.set('enum', Object.assign({}, propertyDefinition.enum, {
      type: 'enum', validator: EnumValidator
    })); }
    if(match) { validators.set('match', Object.assign({}, match, {
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
      propertyDefinition.validators.push(new ValidatorClass($validatorSettings, this.schema));
    }
    return propertyDefinition
  }
}

const Messages = {
  'true': ($validation) => `${$validation.valid}`,
  'false': ($validation) => `${$validation.valid}`,
};
class Validation extends EventTarget {
  #settings
  #properties
  #valid
  #advance = []
  #deadvance = []
  #unadvance = []
  constructor($settings = {}) {
    super();
    this.#settings = Object.assign({ messages: Messages }, $settings);
  }
  // get type() { return this.#settings.type }
  get definition() { return this.#settings.definition }
  get path() { return this.#settings.path }
  get key() { return this.#settings.key }
  get value() { return this.#settings.value }
  get properties() {
    if(this.#properties !== undefined) return this.#properties
    this.#properties = this.#settings.properties;
    return this.#properties
  }
  get advance() { return this.#advance }
  get deadvance() { return this.#deadvance }
  get unadvance() { return this.#unadvance }
  get valid() { return this.#valid }
  set valid($valid) {
    if(this.#valid === undefined) {
      this.#valid = $valid;
    }
  }
}

var Options$1 = (...$options) => Object.assign({
  required: false,
  verificationType: 'all', // 'one'
}, ...$options);

const { typedObjectLiteral: typedObjectLiteral$a, typeOf: typeOf$4 } = index;

class Schema extends EventTarget {
  constructor($properties = {}, $options = {}) {
    super();
    Object.defineProperty(this, 'options', { configurable: true, get() {
      const options = Options$1($options);
      Object.defineProperty(this, 'options', { value: options });
      return options
    }});
    Object.defineProperty(this, 'type', { configurable: true, get() { 
      const type = typeOf$4($properties);
      Object.defineProperty(this, 'type', { value: type });
      return type
    }});
    Object.defineProperty(this, 'parent', { configurable: true, get() {
      const parent = (this.options.parent) ? this.options.parent : null;
      Object.defineProperty(this, 'parent', { value: parent });
      return parent
    } });
    Object.defineProperty(this, 'root', { configurable: true, get() {
      let root = this;
      iterateParents: 
      while(root) {
        if([undefined, null].includes(root.parent)) { break iterateParents }
        root = root.parent;
      }
      return root
    } });
    Object.defineProperty(this, 'key', { configurable: true, get() {
      const key = (this.path) ? this.path.split('.').pop() : null;
      Object.defineProperty(this, 'key', { value: key });
      return key
    } });
    Object.defineProperty(this, 'path', { configurable: true, get() {
      const path = (this.options.path)
        ? String(this.options.path)
        : null;
      Object.defineProperty(this, 'path', { value: path });
      return path
    } });
    Object.defineProperty(this, 'required', { configurable: true, get() {
      const required = this.options.required;
      Object.defineProperty(this, 'required', { value: required });
      return required
    } });
    Object.defineProperty(this, 'requiredProperties', { configurable: true, get() {
      const requiredProperties = typedObjectLiteral$a(this.type);
      for(const [$propertyKey, $propertyDefinition] of Object.entries(this.context)) {
        if($propertyDefinition.required?.value === true) { requiredProperties[$propertyKey] = $propertyDefinition; }
      }
      Object.defineProperty(this, 'requiredProperties', { value: requiredProperties });
      return requiredProperties
    } });

    Object.defineProperty(this, 'requiredPropertiesSize', { configurable: true, get() {
      const requiredPropertiesSize = Object.keys(this.requiredProperties).length;
      Object.defineProperty(this, 'requiredPropertiesSize', { value: requiredPropertiesSize });
      return requiredPropertiesSize
    } });

    Object.defineProperty(this, 'verificationType', { configurable: true, get() {
      const verificationType = this.options.verificationType;
      Object.defineProperty(this, 'verificationType', { value: verificationType });
      return verificationType
    } });

    Object.defineProperty(this, 'context', { configurable: true, get() {
      const context = new Context($properties, this);
      Object.defineProperty(this, 'context', { value: context });
      return context
    } });

    Object.defineProperty(this, 'validate', { value: function() {
      const { $sourceName, $source, $target } = this.#parseValidateArguments(...arguments);
      const validation = new Validation({
        definition: this.context,
        path: this.path,
        key: $sourceName, 
        value: $source,
        properties: typedObjectLiteral$a(this.type),
      });
      const sourceProperties = Object.entries($source);
      let sourcePropertyIndex = 0;
      let deadvancedRequiredProperties = [];
      while(sourcePropertyIndex < sourceProperties.length) {
        const [$sourceKey, $sourceValue] = sourceProperties[sourcePropertyIndex];
        const propertyValidation = this.validateProperty($sourceKey, $sourceValue, $source, $target);
        const deadvancedRequiredPropertyValidation = propertyValidation.deadvance.filter(
          ($verification) => $verification.type === 'required'
        );
        validation.properties[$sourceKey] = propertyValidation;
        if(propertyValidation.valid === true) { validation.advance.push(propertyValidation); } 
        else if(propertyValidation.valid === false) { validation.deadvance.push(propertyValidation); } 
        else if(propertyValidation.valid === undefined) { validation.unadvance.push(propertyValidation );}
        deadvancedRequiredProperties = deadvancedRequiredProperties.concat(deadvancedRequiredPropertyValidation);
        sourcePropertyIndex++;
      }
      if(this.required === true) {
        if(validation.deadvance.length) { validation.valid = false; }
        else if(validation.advance.length) { validation.valid = true; }
        else if(validation.unadvance.length) { validation.valid = undefined; }
        else { validation.valid = false; }
      }
      else if(this.required === false) {
        if(deadvancedRequiredProperties.length) { validation.valid = false; }
        else if(validation.advance.length) { validation.valid = true; }
        else if(validation.deadvance.length) { validation.valid = false; }
        else if(validation.unadvance.length) { validation.valid = undefined; }
        else { validation.valid = false; }
      }
      return validation
    } });
    Object.defineProperty(this, 'validateProperty', { value: function() {
      const { $key, $value, $source, $target } = this.#parseValidatePropertyArguments(...arguments);
      let propertyDefinition;
      if(this.type === 'array') { propertyDefinition = this.context[0]; }
      else if(this.type === 'object') { propertyDefinition = this.context[$key]; }
      const { path } = this;
      const propertyValidationPath = (path) ? [path, $key].join('.') : $key;
      const propertyValidation = new Validation({
        // type: this.required,
        definition: propertyDefinition,
        path: propertyValidationPath,
        key: $key,
        value: $value,
      });
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
      else if(propertyDefinition instanceof Schema) {
        let validation;
        if($target && $target[$key]) { validation = propertyDefinition.validate($key, $value, $target[$key]); }
        else { validation = propertyDefinition.validate($key, $value); }
        if(validation.valid === true) { propertyValidation.advance.push(validation); }
        else if(validation.valid === false) { propertyValidation.deadvance.push(validation); }
        else if(validation.valid === undefined) { propertyValidation.unadvance.push(validation); }
      }
      else {
        iterateContextValueValidators:
        for(const [$validatorIndex, $validator] of Object.entries(propertyDefinition.validators)) {
          const verification = $validator.validate($key, $value, $source, $target);
          if(verification.pass === true) { propertyValidation.advance.push(verification); }
          else if(verification.pass === false) { propertyValidation.deadvance.push(verification); }
          else if(verification.pass === undefined) { propertyValidation.unadvance.push(verification); }
          if(this.verificationType === 'one' && propertyValidation.deadvance.length) { break iterateContextValueValidators }
        }
      }
      if(propertyValidation.deadvance.length) { propertyValidation.valid = false; }
      else if(propertyValidation.advance.length) { propertyValidation.valid = true; }
      else if(propertyValidation.unadvance.length) { propertyValidation.valid = false; }
      return propertyValidation
    } });
  }
  #parseValidateArguments(...$arguments) {
    let $sourceName, $source, $target;
    if($arguments.length === 1) {
      $sourceName = null; $source = $arguments.shift(); $target = null;
    }
    else if($arguments.length === 2 && typeof $arguments[0] === 'string') {
      $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = null;
    }
    else if($arguments.length === 2 && $arguments[0] && typeof $arguments[0] === 'object') {
      $sourceName = null; $source = $arguments.shift(); $target = $arguments.shift();
    }
    else if($arguments.length === 3 && typeof $arguments[0] === 'string') {
      $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = $arguments.shift();
    }
    return { $sourceName, $source, $target }
  }
  #parseValidatePropertyArguments(...$arguments) {
    let [$key, $value, $source, $target] = $arguments;
    const sourceIsModelClassInstance = ($source instanceof Model);
    $source = (sourceIsModelClassInstance) ? $source.valueOf() : $source;
    const $targetIsModelClassInstance = ($target instanceof Model);
    $target = ($targetIsModelClassInstance) ? $target.valueOf() : $target;
    return { $key, $value, $source, $target }
  }
}

const { recursiveAssign: recursiveAssign$b } = index;
var Options = ($options) => {
  const Options = recursiveAssign$b({
    path: null, 
    parent: null, 
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
    assignArray: null,
    methods: {
      accessor: {
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
            'concatValue:$index': true,
            'concatValue': true,
            'concat': true,
          }
        },
        copyWithin: {
          mutatorEvents: {
            'copyWithinIndex:$index': true,
            'copyWithinIndex': true,
            'copyWithin': true,
          }
        },
        fill: {
          lengthen: true,
          mutatorEvents: {
            'fillIndex:$index': true,
            'fillIndex': true,
            'fill': true,
          }
        },
        pop: {
          mutatorEvents: { 'pop': true  },
        },
        push: {
          mutatorEvents: {
            'pushProp:$index': true,
            'pushProp': true,
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
            'spliceDelete:$index': true,
            'spliceDelete': true,
            'spliceAdd:$index': true,
            'spliceAdd': true,
            'splice': true,
          }
        },
        unshift: {
          mutatorEvents: {
            'unshiftProp:$index': true,
            'unshiftProp': true,
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
        const path = $settings.path;
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

const { recursiveAssign: recursiveAssign$a, typedObjectLiteral: typedObjectLiteral$9 } = index;
function assign($model, $options, ...$sources) {
  const options = Object.assign({}, $options);
  const assignObject = 'assign';
  const assignArray = options.assignArray || 'assign';
  const { path, target, schema } = $model;
  const { mutatorEvents, sourceTree, enableValidation, validationEvents } = options;
  const assignedSources = [];
  const assignChange = new Change({ preter: $model });
  for(let $source of $sources) {
    let assignedSource;
    const assignSourceChange = new Change({ preter: $model });
    if(Array.isArray($source)) { assignedSource = []; }
    else if($source && typeof $source === 'object') { assignedSource = {}; }
    iterateSourceProperties:
    for(let [$sourceKey, $sourceValue] of Object.entries($source)) {
      const assignSourcePropertyChange = new Change({ preter: target[$sourceKey] });
      const assignSourcePropertyKeyChange = new Change({ preter: target[$sourceKey] });
      if(schema && enableValidation) {
        const validSourceProperty = schema.validateProperty(
          $sourceKey, $sourceValue, $source, $model
        );
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
        if(schema?.type === 'array') { subschema = schema.context[0]; }
        else if(schema?.type === 'object') { subschema = schema.context[$sourceKey]; }
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
            const subproperties = typedObjectLiteral$9($sourceValue);
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

const { typedObjectLiteral: typedObjectLiteral$8 } = index;
function defineProperties($model, $options, $propertyDescriptors) {
  const { mutatorEvents } = $options;
  const { path } = $model;
  const propertyDescriptorEntries = Object.entries($propertyDescriptors);
  typedObjectLiteral$8($model.valueOf());
  const definePropertiesChange = new Change({ preter: $model });
  for(const [
    $propertyKey, $propertyDescriptor
  ] of propertyDescriptorEntries) {
    $model.defineProperty($propertyKey, $propertyDescriptor);
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

const { recursiveAssign: recursiveAssign$9, typedObjectLiteral: typedObjectLiteral$7 } = index;
function defineProperty($model, $options, $propertyKey, $propertyDescriptor) {
  const options = Object.assign({}, $options);
  const assignObject = 'defineProperties';
  const assignArray = options.assignArray || 'defineProperties';
  const {
    descriptorTree, enableValidation, mutatorEvents, validationEvents
  } = options;
  const { target, path, schema } = $model;
  const propertyValue = $propertyDescriptor.value;
  const targetPropertyDescriptor = Object.getOwnPropertyDescriptor(target, $propertyKey) || {};
  const targetPropertyValue = targetPropertyDescriptor.value;
  const definePropertyChange = new Change({ preter: targetPropertyValue });
  const definePropertyKeyChange = new Change({ preter: targetPropertyValue });
  const targetPropertyValueIsModelInstance = (targetPropertyValue instanceof $model.constructor) ? true : false;
  if(schema && enableValidation) {
    const validProperty = schema.validateProperty($propertyKey, propertyValue, $model);
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
        if(schema.type === 'array') { subschema = schema.context[0]; }
        else if(schema.type === 'object') { subschema = schema.context[$propertyKey]; }
        else { subschema = undefined; }
      }
      let subtarget = typedObjectLiteral$7(propertyValue);
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

const { typedObjectLiteral: typedObjectLiteral$6 } = index;
function concat($model, $options) {
  const { target, path, schema } = $model;
  const { enableValidation, validationEvents, mutatorEvents } = $options;
  const $arguments = [].concat(...arguments);
  let valueIndex = target.length;
  const values = [];
  let targetConcat = [...Array.from(target)];
  let model;
  iterateValues: 
  for(let $value of $arguments) {
    if(schema && enableValidation) {
      const validValue = schema.validateProperty(valueIndex, $subvalue, {}, $model);
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
          $model.dispatchEvent(new ValidatorEvent($eventType, validValue, $model));
        }
      }
      if(!validValue.valid) { valueIndex++; continue iterateValues }
    }
    const modelPath = (path)
      ? [path, valueIndex].join('.')
      : String(valueIndex);
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf(); }
      let subschema = schema?.context[0] || null;
      const submodel = typedObjectLiteral$6($value);
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
      if(mutatorEvents['concatValue']) {
        $model.dispatchEvent(
          new ModelEvent('concatValue', {
            path: modelEventPath,
            value: values[valueIndex],
            detail: {
              valueIndex,
              value: values[valueIndex],
            },
          }, $model)
        );
      }
      if(mutatorEvents['concatValue:$index']) {
        $model.dispatchEvent(
          new ModelEvent('concatValue', {
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
      if(mutatorEvents['copyWithinIndex']) {
        $model.dispatchEvent(
          new ModelEvent(
            'copyWithinIndex',
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
      if(mutatorEvents['copyWithinIndex:$index']) {
        const type  = ['copyWithinIndex', ':', copyIndex].join('');
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

const { typedObjectLiteral: typedObjectLiteral$5 } = index;
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
      let validValue = schema.validate(validValue);
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
          $model.dispatchEvent(new ValidatorEvent($eventType, validValue, $model));
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
      const subschema = schema?.context[0] || null;
      const subproperties = typedObjectLiteral$5($value);
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
      if(mutatorEvents['fillIndex']) {
        $model.dispatchEvent(
          new ModelEvent('fillIndex', {
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
      if(mutatorEvents['fillIndex:$index']) {
        const type = ['fillIndex', ':', fillIndex].join('');
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

const { recursiveAssign: recursiveAssign$8, typedObjectLiteral: typedObjectLiteral$4, typeOf: typeOf$3 } = index;
function push($model, $options, ...$elements) {
  const options = Object.assign({}, $options);
  const assignArray = 'push';
  const assignObject = options.assignObject;
  const { enableValidation, mutatorEvents, validationEvents } = options;
  const { target, path, schema } = $model;
  const elements = [];
  let elementsIndex = 0;
  for(let $element of $elements) {
    let element;
    if(schema && enableValidation) {
      const validElement = schema.validateProperty(elementsIndex, $element, {}, $model);
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
      const subschema = schema?.context[0] || null;
      const subproperties = typedObjectLiteral$4(typeOf$3($element));
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
      if(mutatorEvents['pushProp']) {
        $model.dispatchEvent(
          new ModelEvent('pushProp', {
            path: modelEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $model)
        );
      }
      if(mutatorEvents['pushProp:$index']) {
        const type = ['pushProp', ':', elementsIndex].join('');
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

const { typedObjectLiteral: typedObjectLiteral$3 } = index;
function splice($model, $options) {
  const options = Object.assign({}, $options);
  const assignObject = options.assignObject;
  const assignArray = options.assignArray || assignObject;
  const { mutatorEvents } = options;
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
      if(mutatorEvents['spliceDelete']) {
        $model.dispatchEvent(
          new ModelEvent('spliceDelete', {
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
      if(mutatorEvents['spliceDelete:$index']) {
        const type = ['spliceDelete', ':', deleteItemsIndex].join('');
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
      const validAddItem = schema.validateProperty(elementIndex, element, {}, $model);
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
      const subschema = schema?.context[0] || null;
      const subproperties = typedObjectLiteral$3(addItem);
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
      if(mutatorEvents['spliceAdd']) {
        $model.dispatchEvent(
          new ModelEvent('spliceAdd', {
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
      if(mutatorEvents['spliceAdd:$index']) {
        const type = ['spliceAdd', ':', addItemsIndex].join('');
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

const { recursiveAssign: recursiveAssign$7, typedObjectLiteral: typedObjectLiteral$2, typeOf: typeOf$2 } = index;
function unshift($model, $options, ...$elements) {
  const options = Object.assign({}, $options);
  const assignArray = 'unshift';
  const assignObject = options.assignObject;
  const { enableValidation, mutatorEvents, validationEvents } = options;
  const { target, path, schema } = $model;
  const elements = [];
  let elementsIndex = 0;
  for(let $element of $elements) {
    let element;
    if(schema && enableValidation) {
      const validElement = schema.validateProperty(elementsIndex, $element, {}, $model);
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
      const subschema = schema?.context[0] || null;
      const subproperties = typedObjectLiteral$2(typeOf$2($element));
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
      if(mutatorEvents['unshiftProp']) {
        $model.dispatchEvent(
          new ModelEvent('unshiftProp', {
            path: modelEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $model)
        );
      }
      if(mutatorEvents['unshiftProp:$index']) {
        const type = ['unshiftProp', ':', elementsIndex].join('');
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
  for(const [$propertyKey, $propertyValue] of Object.entries($properties)) {
    $model.set($propertyKey, $propertyValue, $options);
  }
  const { path } = $model;
  const { mutatorEvents  } = $options;
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

const { recursiveAssign: recursiveAssign$5, regularExpressions: regularExpressions$1, typeOf: typeOf$1 } = index;
function setContentProperty($model, $options, $path, $value) {
  const options = Object.assign({}, $options);
  const assignObject = 'set';
  const assignArray = options.assignArray || 'set';
  const { target, path, schema } = $model;
  const {
    enableValidation, mutatorEvents, pathkey, 
    recursive, source, subpathError, validationEvents,
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
        if(schema?.type === 'array') { subschema = schema.context[0]; }
        else if(schema?.type === 'object') { subschema = schema.context[propertyKey]; }
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
      const validTargetProp = schema.validateProperty(propertyKey, $value, source, $model);
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
      if(schema?.type === 'array') {
        subschema = schema.context[0];
      }
      else if(schema?.type === 'object') {
        subschema = schema.context[propertyKey];
      }
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
    if(mutatorEvents) {
      const modelEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey);
      if(mutatorEvents['setProperty']) {
        $model.dispatchEvent(
          new ModelEvent('setProperty', {
            path: modelEventPath, 
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        );
      }
      if(mutatorEvents['setProperty:$key']) {
        const type = ['setProperty', ':', propertyKey].join('');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            value: propertyValue,
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
    let propertyKey = $path;
    if($value && typeof $value === 'object') {
      if($value instanceof $model.constructor) { $value = $value.valueOf(); }
      const typeOfPropertyValue = typeOf$1($value);
      let subschema;
      let submodel;
      if(schema?.type === 'array') {
        subschema = schema.context[0];
      }
      if(schema?.type === 'object') {
        subschema = schema.context[propertyKey];
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
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        );
      }
      if(mutatorEvents['setProperty:$key']) {
        const type = ['setProperty', ':', propertyKey].join('');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            value: propertyValue,
            detail: {
              value: propertyValue,
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
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, {}, $model);
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
            new ValidatorEvent($eventType, Object.assign(validTargetProp, {
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
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, $model, $model);
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
            new ValidatorEvent($eventType, validTargetProp, $model)
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

var AccessorProperty = {
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
  accessor: [{
    type: 'mutators',
    keys: Object.keys(AccessorProperty),
    methodDescriptor: function($methodName, $model, $options) {
      return { value: AccessorProperty[$methodName].bind(null, $model, $options) }
    }
  }]
});
function Methods($model) {
  // Object, Array, Accessor
  for(const [$propertyClassName, $propertyClasses] of Object.entries(Defaults)) {
    for(const $propertyClass of $propertyClasses) {
      const { keys, methodDescriptor, type } = $propertyClass;
      for(const $methodName of keys) {
        if($propertyClassName === 'accessor' || type === 'mutators') {
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
      else if(typeOfSchema === 'array') { schema = new Schema(...arguments); }
      else if(typeOfSchema === 'object') { schema = new Schema($schema); }
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
