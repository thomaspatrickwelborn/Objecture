const defaultAccessor = ($target, $property) => {
  if($property === undefined) { return $target }
  else { return $target[$property] }
};
var accessors = {
  default: defaultAccessor,
};

function impandEvents($propEvents) {
  if(!Array.isArray($propEvents)) { return $propEvents }
  const propEvents = {};
  iteratePropEvents: 
  for(const $propEvent of $propEvents) {
    const { path, type, listener, options } = $propEvent;
    const propEventSettings = `${$path} ${$type}`;
    if(options !== undefined) {
      propEvents[propEventSettings] = [listener, options];
    }
    else {
      propEvents[propEventSettings] = listener;
    }
  }
  return propEvents
}

function expandEvents($propEvents) {
  if(
    Array.isArray($propEvents) ||
    $propEvents === undefined
  ) { return $propEvents }
  const propEvents = [];
  iteratePropEvents:
  for(const [
    $propEventSettings, $propEventListener
  ] of Object.entries($propEvents)) {
    const propEventSettings = $propEventSettings.split(' ');
    let path, type, listener, options;
    if(propEventSettings.length === 1) {
      path = ':scope';
      type = propEventSettings[0];
    }
    else if(propEventSettings.length > 1) {
      path = propEventSettings[0];
      type = propEventSettings[1];
    }
    if(Array.isArray($propEventListener)) {
      listener = $propEventListener[0];
      options = $propEventListener[1];
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
    iterateObjectProperties: 
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

const typeOf$4 = ($data) => Object
  .prototype
  .toString
  .call($data).slice(8, -1).toLowerCase();

function recursiveAssign$8($target, ...$sources) {
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    if(!$source) continue iterateSources
    iterateSourceEntries: 
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfTargetPropertyValue = typeOf$4($target[$sourcePropertyKey]);
      const typeOfSourcePropertyValue = typeOf$4($sourcePropertyValue);
      if(
        typeOfTargetPropertyValue === 'object' &&
        typeOfSourcePropertyValue === 'object'
      ) {
        $target[$sourcePropertyKey] = recursiveAssign$8($target[$sourcePropertyKey], $sourcePropertyValue);
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
    iterateSourceEntries: 
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfTargetPropertyValue = typeOf$4($target[$sourcePropertyKey]);
      const typeOfSourcePropertyValue = typeOf$4($sourcePropertyValue);
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

function recursiveFreeze($target) {
  for(const [$propertyKey, $propertyValue] of Object.entries($target)) {
    if($propertyValue && typeof $propertyValue === 'object') {
      recursiveFreeze($propertyValue);
    }
  }
  return Object.freeze($target)
}

function typedObjectLiteral$7($value) {
  let _typedObjectLiteral;
  const typeOfValue = typeOf$4($value);
  if(typeOfValue === 'object') { _typedObjectLiteral = {}; }
  else if(typeOfValue === 'array') { _typedObjectLiteral = []; }
  else if(typeOfValue === 'string') {
    if($value === 'object') { _typedObjectLiteral = {}; }
    else if($value === 'array') { _typedObjectLiteral = []; }
  }
  else { _typedObjectLiteral = undefined; }
  return _typedObjectLiteral
}

const Primitives = {
  'string': String, 
  'number': Number, 
  'boolean': Boolean, 
  'bigint': BigInt, 
  'undefined': undefined,
  'null': null,
};
const PrimitiveKeys$1 = Object.keys(Primitives);
const PrimitiveValues$1 = Object.values(Primitives);
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

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ObjectKeys: ObjectKeys,
  ObjectValues: ObjectValues,
  Objects: Objects,
  PrimitiveKeys: PrimitiveKeys$1,
  PrimitiveValues: PrimitiveValues$1,
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
  impandEvents: impandEvents,
  isPropertyDefinition: isPropertyDefinition$1,
  propertyDirectory: propertyDirectory,
  recursiveAssign: recursiveAssign$8,
  recursiveAssignConcat: recursiveAssignConcat,
  recursiveFreeze: recursiveFreeze,
  regularExpressions: index$2,
  typeOf: typeOf$4,
  typedObjectLiteral: typedObjectLiteral$7,
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
    propertyDirectory: { scopeKey: ':scope', maxDepth: 10 },
    assign: 'addEventListener', deassign: 'removeEventListener',
    bindListener: true,
    scopeKey: ':scope',
    methods: {
      assign: {
        // Event Target Add Event Listener
        addEventListener: function addEventListener($eventDefinition, $target) {
          const { type, listener, settings } = $eventDefinition;
          const { options, useCapture } = settings;
          return $target['addEventListener'](type, listener, options || useCapture)
        },
        // Event Emitter On
        on: function on($eventDefinition, $target) {
          const { type, listener } = $eventDefinition;
          return $target['on'](type, listener)
        },
        // Event Emitter Once
        once: function once($eventDefinition, $target) {
          const { type, listener } = $eventDefinition;
          return $target['once'](type, listener)
        },
      },  
      deassign: {
        // Event Target Remove Event Listener
        removeEventListener: function removeEventListener($eventDefinition, $target) {
          const { type, listener, settings } = $eventDefinition;
          const { options, useCapture } = settings;
          return $target['removeEventListener'](type, listener, options || useCapture)
        },
        // Event Emitter Off
        off: function off($eventDefinition, $target) {
          const { type, listener } = $eventDefinition;
          return $target['off'](type, listener)
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
        Settings[$settingKey] = recursiveAssign$8(Settings[$settingKey], $settingValue);
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
  #_targets = []
  #_assign
  #_deassign
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
      const settings = this.settings;
      if(enable === $enable) { continue iterateTargetElements }
      if($enable === true) {
        try {
          this.#assign(target);
          $targetElement.enable = $enable;
          assigned.push($targetElement);
          
        }
        catch($err) { console.error($err); }
      }
      else if($enable === false) {
        try {
          this.#deassign(target);
          $targetElement.enable = $enable;
          deassigned.push($targetElement);
        }
        catch($err) { console.error($err); }
      }
    }
    this.#enable = $enable;
  }
  get assigned() { return this.#assigned }
  get deassigned() { return this.#deassigned }
  get #target() { return this.settings.target }
  get #targets() {
    const pretargets = this.#_targets;
    const targetPaths = [];
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
    else if(typeOf$4(this.path) === 'string') {
      const propertyPathMatcher = outmatch(this.path, {
        separator: '.',
      });
      const propertyDirectory = this.#propertyDirectory;
      iteratePropertyPaths: 
      for(const $propertyPath of propertyDirectory) {
        const propertyPathMatch = propertyPathMatcher($propertyPath);
        if(propertyPathMatch === true) { targetPaths.push($propertyPath); }
      }
      if(this.path.charAt(0) === this.#scopeKey) { targetPaths.unshift(this.#scopeKey); }
      iterateTargetPaths: 
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
            target = $targetAccessor(target, pathKey);
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
        console.log("targetElement", targetElement);
        if(targetElement !== undefined) { targets.push(targetElement); }
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
  get #methods() { return this.settings.methods }
  get #propertyDirectory() {
    const propertyDirectorySettings = ({
      accessors: this.settings.accessors
    }, this.settings.propertyDirectory);
    return propertyDirectory(this.#context, propertyDirectorySettings)
  }
}

class Core extends EventTarget {
  static implement = function ($target, $settings) {
    if(!$target || !$settings) { return undefined }
    const settings = Settings$1($settings);
    const events = [];
    Object.defineProperties($target, {
      // Get Events
      [settings.propertyDefinitions.getEvents]: {
        enumerable: false, writable: false, 
        value: function getEvents() {
          if(!arguments[0]) { return events }
          const getEvents = [];
          const $filterEvents = [].concat(arguments[0]);
          iterateFilterEvents: 
          for(const $filterEvent of $filterEvents) {
            iterateEvents: 
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
      // Add Events
      [settings.propertyDefinitions.addEvents]: {
        enumerable: false, writable: false, 
        value: function addEvents() {
          if(!arguments.length) { return $target }
          let $addEvents = expandEvents(arguments[0]);
          iterateAddEvents: 
          for(let $addEvent of $addEvents) {
            const event = {};
            for(const $settingKey of [
              'accessors', 'assign', 'deassign', 'propertyDirectory'
            ]) {
              const settingValue = settings[$settingKey];
              if(settingValue !== undefined) { event[$settingKey] = settingValue; }
            }
            recursiveAssign$8(event, $addEvent);
            const eventDefinition = new EventDefinition(event, $target);
            events.push(eventDefinition);
          }
          return $target
        },
      },
      // Remove Events
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
      // Enable Events
      [settings.propertyDefinitions.enableEvents]: {
        enumerable: false, writable: false, 
        value: function enableEvents() {
          const $events = $target[settings.propertyDefinitions.getEvents](arguments[0]);
          if($events.length === 0) return $target
          iterateEvents: for(const $event of $events) { $event.enable = true; }
          return $target
        },
      },
      // Disable Events
      [settings.propertyDefinitions.disableEvents]: {
        enumerable: false, writable: false, 
        value: function disableEvents() {
          const $events = $target[settings.propertyDefinitions.getEvents](arguments[0]);
          if($events.length === 0) return $target
          iterateEvents: for(const $event of $events) { $event.enable = false; }
          return $target
        },
      },
      // Reenable Events
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

const { recursiveAssign: recursiveAssign$7 } = index;
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
        messages: recursiveAssign$7({}, this.messages, definition.messages),
      });
      verification.pass = definition.validate(...arguments);
      return verification
    }
    this.#boundValidate = validate.bind(this);
    return this.#boundValidate
  }
}

const { recursiveAssign: recursiveAssign$6, typedObjectLiteral: typedObjectLiteral$6 } = index;
class RequiredValidator extends Validator {
  constructor($definition, $schema) {
    super(Object.assign($definition, {
      type: 'required',
      validate: ($key, $value, $source, $target) => {
        const definition = this.definition;
        let pass;
        const { requiredProperties, requiredPropertiesSize, type } = this.schema;
        if(requiredPropertiesSize === 0/* || definition.value === false*/) { pass = true; }
        else if(type === 'object') {
          const corequiredContextProperties = typedObjectLiteral$6(type);
          const corequiredModelProperties = typedObjectLiteral$6(type);
          iterateRequiredProperties: 
          for(const [
            $requiredPropertyName, $requiredProperty
          ] of Object.entries(requiredProperties)) {
            const requiredProperty = recursiveAssign$6({}, $requiredProperty);
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

const {
  typeOf: typeOf$3, variables: variables$1
} = index;
const { PrimitiveKeys, PrimitiveValues } = variables$1;
class TypeValidator extends Validator {
  constructor($definition = {}, $schema) {
    super(Object.assign($definition, {
      type: 'type',
      validate: ($key, $value) => {
        const definition = this.definition;
        let pass;
        let typeOfDefinitionValue = typeOf$3(definition.value);
        typeOfDefinitionValue = (typeOfDefinitionValue === 'function')
          ? typeOf$3(definition.value())
          : typeOfDefinitionValue;
        const typeOfModelValue = typeOf$3($value);
        if(typeOfModelValue === 'undefined') { pass = false; }
        else if(typeOfDefinitionValue === 'undefined') { pass = true; }
        else { pass = (typeOfDefinitionValue === typeOfModelValue); }
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
          const valueMatch = (match.value.exec($value) !== null);
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
  expandTree, isPropertyDefinition, typedObjectLiteral: typedObjectLiteral$5, typeOf: typeOf$2, variables
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
    this.#type = typeOf$2(typedObjectLiteral$5(this.#properties));
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
    const target = typedObjectLiteral$5(this.type);
    if(this.type === 'array') {
      properties = this.#properties.slice(0, 1);
    }
    else if(this.type === 'object') {
      properties = this.#properties;
    }
    iterateProperties: 
    for(const [
      $propertyKey, $propertyDefinition
    ] of Object.entries(properties)) {
      const typeOfPropertyDefinition = typeOf$2($propertyDefinition);
      let propertyDefinition;
      // Property Definition: Schema
      if($propertyDefinition instanceof Schema) {
        propertyDefinition = $propertyDefinition;
      }
      // Property Definition: String, Number, Boolean, Object, Array, null, undefined
      else if(Variables.TypeValues.includes($propertyDefinition)) {
        propertyDefinition = expandTree($propertyDefinition, 'type.value');
      }
      // Property Definition: 'string', 'number', 'bigint', 'boolean', 'object', 'array', 'null', 'undefined'
      else if(Variables.TypeKeys.includes($propertyDefinition)) {
        propertyDefinition = expandTree(Variables.TypeValues[
          Variables.TypeKeys.indexOf($propertyDefinition)
        ], 'type.value');
      }
      // Property Definition: Object Literal
      else if(
        typeOfPropertyDefinition === 'object' || 
        typeOfPropertyDefinition === 'array'
      ) {
        let propertyDefinitionIsPropertyDefinition = isPropertyDefinition($propertyDefinition);
        if(propertyDefinitionIsPropertyDefinition === false) {
          const { path } = this.schema;
          const schemaPath = (path)
            ? [path, $propertyKey].join('.')
            : String($propertyKey);
          const parent = this.schema;
          propertyDefinition = new Schema($propertyDefinition, Object.assign({}, this.schema.options, {
            path: schemaPath,
            parent: parent,
          }));
        }
        else if(propertyDefinitionIsPropertyDefinition === true) {
          propertyDefinition = { validators: [] };
          // Property Definition: 
          iteratePropertyValidators: 
          for(const [
            $propertyValidatorName, $propertyValidator
          ] of Object.entries($propertyDefinition)) {
            if($propertyValidatorName === 'validators') { continue iteratePropertyValidators }
            const typeOfPropertyValidator = typeOf$2($propertyValidator);
            let propertyValidator;
            if(typeOfPropertyValidator && typeOfPropertyValidator === 'object') {
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
          iterateAlterPropertyValidators: 
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
    // Required
    if(contextRequired === true) { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: true, validator: RequiredValidator 
    })); }
    else if(required?.value === true) { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: true, validator: RequiredValidator  }));
    }
    else { validators.set('required', Object.assign({}, propertyDefinition.required, {
      type: 'required', value: false, validator: RequiredValidator 
    })); }
    // Type
    if(type) { validators.set('type', Object.assign({}, type, {
      type: 'type', validator: TypeValidator
    })); }
    else { validators.set('type', Object.assign({}, type, {
      type: 'type', value: undefined, validator: TypeValidator
    })); }
    // Range
    if(range) { validators.set('range', Object.assign({}, range, {
      type: 'range', validator: RangeValidator
    })); }
    else if(min || max) { validators.set('range', Object.assign({}, {
      type: 'range', min, max, validator: RangeValidator
    })); }
    // Length
    if(length) { validators.set('length', Object.assign({}, length, {
      type: 'length', validator: LengthValidator
    })); }
    else if(minLength || maxLength) { validators.set('length', Object.assign({}, {
      type: 'length', min: minLength, max: maxLength, validator: LengthValidator
    })); }
    // Enum
    if(propertyDefinition.enum) { validators.set('enum', Object.assign({}, propertyDefinition.enum, {
      type: 'enum', validator: EnumValidator
    })); }
    // Match
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

const { typedObjectLiteral: typedObjectLiteral$4, typeOf: typeOf$1 } = index;

class Schema extends EventTarget{
  #properties
  options
  #type
  #context
  #parent
  #key
  #path
  #requiredProperties
  #requiredPropertiesSize
  constructor($properties = {}, $options = {}) {
    super();
    this.#properties = $properties;
    this.options = Options$1($options);
  }
  get type() {
    if(this.#type !== undefined) return this.#type
    this.#type = typeOf$1(this.#properties);
    return this.#type
  }
  get parent() {
    if(this.#parent !== undefined)  return this.#parent
    this.#parent = (this.options.parent) ? this.options.parent : null;
    return this.#parent
  }
  get root() {
    let root = this;
    iterateParents: 
    while(root) {
      if([undefined, null].includes(root.parent)) { break iterateParents }
      root = root.parent;
    }
    return root
  }
  get key() {
    if(this.#key !== undefined) { return this.#key }
    if(this.path) { this.#key = this.path.split('.').pop(); }
    else { this.#key = null; }
    return this.#key
  }
  get path() {
    if(this.#path !== undefined)  return this.#path
    this.#path = (this.options.path)
      ? String(this.options.path)
      : null;
    return this.#path
  }
  get required() { return this.options.required }
  get requiredProperties() {
    if(this.#requiredProperties !== undefined) return this.#requiredProperties
    let requiredProperties = typedObjectLiteral$4(this.type);
    iterateContextEntries: 
    for(const [$propertyKey, $propertyDefinition] of Object.entries(this.context)) {
      if($propertyDefinition.required?.value === true) { requiredProperties[$propertyKey] = $propertyDefinition; }
    }
    this.#requiredProperties = requiredProperties;
    return this.#requiredProperties
  }
  get requiredPropertiesSize() {
    if(this.#requiredPropertiesSize !== undefined) return this.#requiredPropertiesSize
    this.#requiredPropertiesSize = Object.keys(this.requiredProperties).length;
    return this.#requiredPropertiesSize
  }
  get verificationType() { return this.options.verificationType }
  get context() {
    if(this.#context !== undefined) return this.#context
    this.#context = new Context(this.#properties, this);
    return this.#context
  }
  #parseValidateArguments() {
    let $arguments = [...arguments];
    let $sourceName, $source, $target;
    if($arguments.length === 1) {
      $sourceName = null; $source = $arguments.shift(); $target = null;
    }
    else if($arguments.length === 2 && typeof $arguments[0] === 'string') {
      $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = null;
    }
    else if($arguments.length === 2 && typeof $arguments[0] === 'object') {
      $sourceName = null; $source = $arguments.shift(); $target = $arguments.shift();
    }
    else if($arguments.length === 3 && typeof $arguments[0] === 'string') {
      $sourceName = $arguments.shift(); $source = $arguments.shift(); $target = $arguments.shift();
    }
    return { $sourceName, $source, $target }
  }
  validate() {
    const { $sourceName, $source, $target } = this.#parseValidateArguments(...arguments);
    const validation = new Validation({
      definition: this.context,
      path: this.path,
      key: $sourceName, 
      value: $source,
      properties: typedObjectLiteral$4(this.type),
    });
    const sourceProperties = Object.entries($source);
    let sourcePropertyIndex = 0;
    let deadvancedRequiredProperties = [];
    // Iterate Model Properties 
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
  }
  #parseValidatePropertyArguments() {
    let $arguments = [...arguments];
    let [$key, $value, $source, $target] = $arguments;
    // const ModelClassString = Model.toString()
    const sourceIsModelClassInstance = ($source instanceof Model);
    $source = (sourceIsModelClassInstance) ? $source.valueOf() : $source;
    const $targetIsModelClassInstance = ($target instanceof Model);
    $target = ($targetIsModelClassInstance) ? $target.valueOf() : $target;
    return { $key, $value, $source, $target }
  }
  validateProperty() {
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
    // Context Value: Undefined
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
    // Context Value: Object
    else if(propertyDefinition instanceof Schema) {
      let validation;
      if($target && $target[$key]) { validation = propertyDefinition.validate($key, $value, $target[$key]); }
      else { validation = propertyDefinition.validate($key, $value); }
      if(validation.valid === true) { propertyValidation.advance.push(validation); }
      else if(validation.valid === false) { propertyValidation.deadvance.push(validation); }
      else if(validation.valid === undefined) { propertyValidation.unadvance.push(validation); }
    }
    // Context Value: Primitive
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
  }
}

const { recursiveAssign: recursiveAssign$5 } = index;
var Options = ($options) => recursiveAssign$5({
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
  assignmentMethod: 'set',
  methods: {
    accessor: {
      get: {
        events: {
          'get': true,
          'getProperty': true,
          'getProperty:$key': true,
        },
      },
      set: {
        recursive: true,
        events: {
          'set': true,
          'setProperty': true,
          'setProperty:$key': true,
        },
      },
      delete: {
        events: {
          'delete': true,
          'deleteProperty': true,
          'deleteProperty:$key': true,
        },
      },
    },
    array: {
      concat: {
        events: {
          'concatValue:$index': true,
          'concatValue': true,
          'concat': true,
        }
      },
      copyWithin: {
        events: {
          'copyWithinIndex:$index': true,
          'copyWithinIndex': true,
          'copyWithin': true,
        }
      },
      fill: {
        events: {
          'fillIndex:$index': true,
          'fillIndex': true,
          'fill': true,
        }
      },
      pop: {
        events: { 'pop': true  },
      },
      push: {
        events: {
          'pushProp:$index': true,
          'pushProp': true,
          'push': true,
        }
      },
      reverse: {
        events: { 'reverse': true  },
      },
      shift: {
        events: { 'shift': true  },
      },
      splice: {
        events: {
          'spliceDelete:$index': true,
          'spliceDelete': true,
          'spliceAdd:$index': true,
          'spliceAdd': true,
          'splice': true,
        }
      },
      unshift: {
        events: {
          'unshiftProp:$index': true,
          'unshiftProp': true,
          'unshift': true,
        }
      },
    },
    object: {
      assign: {
        sourceTree: true,
        events: {
          'assignSourceProperty:$key': true,
          'assignSourceProperty': true,
          'assignSource': true,
          'assign': true,
        },
      },
      defineProperties: {
        descriptorTree: true,
        events: { 'defineProperties': true },
      },
      defineProperty: {
        descriptorTree: true,
        events: {
          'defineProperty': true,
          'defineProperty:$key': true,
        },
      },
      freeze: {
        recursive: true,
        events: {
          'freezeProperty': true,
          'freeze': true,
        },
      },
      seal: {
        recursive: true,
        events: {
          'sealProperty': true,
          'seal': true,
        },
      },
    },
  },
}, $options);

class ModelEvent extends CustomEvent {
  #settings
  #model
  #key
  constructor($type, $settings, $model) {
    super($type, $settings);
    this.#settings = $settings;
    this.#model = $model;
    if(!this.model.parent) return this
  }
  get model() { return this.#model }
  get key() {
    if(this.#key !== undefined) { return this.#key }
    if(this.path) { this.#key = this.path.split('.').pop(); }
    else { this.#key = null; }
    return this.#key
  }
  get change() { return this.#settings.change }
  get value() { return this.#settings.value }
  get path() { return this.#settings.path }
  get detail() { return this.#settings.detail }
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
    if($preter instanceof Model) { this.#preter = $preter.valueOf(); }
    else { this.#preter = $preter; }
    this.#_preter = true;
  }
  get anter() { return this.#anter }
  set anter($anter) {
    if(this.#_anter === true) { return this.#anter }
    if($anter instanceof Model) { this.#anter = $anter.valueOf(); }
    else { this.#anter = $anter; }
    this.#_anter = true;
  }
  get conter() {
    if(
      this.#_conter === true ||
      [this.#_preter, this.#_anter].includes(false)
    ) { return this.#conter }
    const preter = JSON.stringify(this.preter);
    const anter = JSON.stringify(this.anter);
    console.log("preter",preter);
    console.log("anter",anter);
    let conter;
    if(anter !== preter) { conter = true; }
    else { conter = false; }
    this.#conter = conter;
    this.#_conter = true;
    return this.#conter
  }
}

let ValidatorEvent$1 = class ValidatorEvent extends CustomEvent {
  #settings
  #model
  #key
  #path
  #value
  #valid
  constructor($type, $settings, $model) {
    super($type);
    this.#settings = $settings;
    this.#model = $model;
  }
  get key() {
    if(this.#key !== undefined) { return this.#key }
    this.#key = this.#settings.key;
    return this.#key
  }
  get path() {
    if(this.#path !== undefined) { return this.#path }
    this.#path = this.#settings.path;
    return this.#path
  }
  get value() {
    if(this.#value !== undefined) { return this.#value }
    this.#value = this.#settings.value;
    return this.#value
  }
  get valid() {
    if(this.#valid !== undefined) { return this.#valid }
    this.#valid = this.#settings.valid;
    return this.#valid
  }
};

const { recursiveAssign: recursiveAssign$4, typedObjectLiteral: typedObjectLiteral$3 } = index;
function assign($model, $options, ...$sources) {
  const { path, target, schema } = $model;
  const { events, sourceTree, enableValidation, validationEvents } = $options;
  const assignedSources = [];
  const assignChange = new Change({ preter: $model });
  // Iterate Sources
  iterateAssignSources: 
  for(let $source of $sources) {
    let assignedSource;
    const assignSourceChange = new Change({ preter: $model });
    if(Array.isArray($source)) { assignedSource = []; }
    else if(typeof $source === 'object') { assignedSource = {}; }
    // Iterate Source Propertiess
    iterateSourceProperties:
    for(let [$sourceKey, $sourceValue] of Object.entries($source)) {
      const assignSourcePropertyChange = new Change({ preter: target[$sourceKey] });
      const assignSourcePropertyKeyChange = new Change({ preter: target[$sourceKey] });
      // Validation
      if(schema && enableValidation) {
        const validSourceProperty = schema.validateProperty(
          $sourceKey, $sourceValue, $source, $model
        );
        if(validationEvents) {
          let type, propertyType;
          const validatorEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey);
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
      // Source Prop: Object Type
      let sourceValue;
      if($sourceValue && typeof $sourceValue === 'object') {
        if($sourceValue instanceof Model) {
          sourceValue = $sourceValue.valueOf();
        }
        // Subschema
        let subschema;
        if(schema?.type === 'array') { subschema = schema.context[0]; }
        else if(schema?.type === 'object') { subschema = schema.context[$sourceKey]; }
        else { subschema = null; }
        // Model
        const modelPath = (path)
          ? [path, $sourceKey].join('.')
          : String($sourceKey);
        let modelTypedLiteral = typedObjectLiteral$3($sourceValue);
        // Assignment
        // Source Tree: False
        if(sourceTree === false) {
          sourceValue = new Model(modelTypedLiteral, subschema, 
            recursiveAssign$4({}, $model.options, {
              path: modelPath,
              parent: $model,
            })
          );
        }
        // Source Tree: true
        else {
          // Assignment: Existing Model Instance
          if(target[$sourceKey] instanceof Model) {
            sourceValue = target[$sourceKey];
          }
          // Assignment: New Model Instance
          else {
            sourceValue = new Model(modelTypedLiteral, subschema, 
              recursiveAssign$4({}, $model.options, {
                path: modelPath,
                parent: $model,
              })
            );
          }
        }
        const assignment = { [$sourceKey]: sourceValue };
        Object.assign(target, assignment);
        Object.assign(assignedSource, assignment);
        $model.retroReenableEvents();
        sourceValue.assign($sourceValue);
      }
      // Source Prop: Primitive Type
      else {
        sourceValue = $sourceValue;
        const assignment = { [$sourceKey]: sourceValue };
        Object.assign(target, assignment);
        Object.assign(assignedSource, assignment);
        $model.retroReenableEvents();
      }
      if(events) {
        const modelEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey);
        if(events['assignSourceProperty:$key']) {
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
        if(events['assignSourceProperty']) {
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
    // Model Event: Assign Source
    if(events && events['assignSource']) {
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
  // Model Event: Assign
  if(events && events['assign']) {
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

const { impandTree, typedObjectLiteral: typedObjectLiteral$2 } = index;
function defineProperties($model, $options, $propertyDescriptors) {
  const { events } = $options;
  const { path } = $model;
  const propertyDescriptorEntries = Object.entries($propertyDescriptors);
  const impandPropertyDescriptors = impandTree($propertyDescriptors, 'value');
  let properties = typedObjectLiteral$2($model.valueOf());
  const definePropertiesChange = new Change({ preter: $model });
  // Iterate Property Descriptors
  iteratePropertyDescriptors: 
  for(const [
    $propertyKey, $propertyDescriptor
  ] of propertyDescriptorEntries) {
    // Property Descriptor Value Is Direct Instance Of Array/object/Map
    $model.defineProperty($propertyKey, $propertyDescriptor, impandPropertyDescriptors);
  }
  // Define Properties Event
  if(events && events['defineProperties']) {
    // Define Properties Validator Event
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

const { typedObjectLiteral: typedObjectLiteral$1 } = index;
function defineProperty($model, $options, $propertyKey, $propertyDescriptor) {
  const { descriptorTree, events } = $options;
  const { target, path, schema } = $model;
  const { enableValidation, validationEvents } = $options;
  const propertyValue = $propertyDescriptor.value;
  const targetPropertyDescriptor = Object.getOwnPropertyDescriptor(target, $propertyKey) || {};
  const targetPropertyValue = targetPropertyDescriptor.value;
  const definePropertyChange = new Change({ preter: targetPropertyValue });
  const definePropertyKeyChange = new Change({ preter: targetPropertyValue });
  const targetPropertyValueIsModelInstance = (
    targetPropertyValue instanceof Model
  ) ? true : false;
  // Validation
  if(schema && enableValidation) {
    const validProperty = schema.validateProperty($propertyKey, propertyValue, $model);
    if(validationEvents) {
      let type, propertyType;
      const validatorPath = (path)
        ? [path, $propertyKey].join('.')
        : String($propertyKey);
      if(validProperty.valid) {
        type = 'validProperty';
        propertyType = ['validProperty', $propertyKey].join(':');
      }
      else {
        type = 'nonvalidProperty';
        propertyType = ['nonvalidProperty', $propertyKey].join(':');
      }
      for(const $eventType of [type, propertyType]) {
        // $model.enableEvents({ enable: true })
        $model.dispatchEvent(new ValidatorEvent$1($eventType, validProperty, $model));
      }
    }
    if(!validProperty.valid) { return $model }
  }
  // Property Descriptor Value: Object Type
  if(typeof propertyValue === 'object') {
    // Subschema
    let subschema;
    if(schema.type === 'array') { subschema = schema.context[0]; }
    else if(schema.type === 'object') { subschema = schema.context[$propertyKey]; }
    else { subschema = undefined;}
    // Root Property Descriptor Value: Existent Model Instance
    const modelPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey);
    if(targetPropertyValueIsModelInstance) {
      // Descriptor Tree: true
      if(descriptorTree === true) {
        // propertyValue = Object.assign(propertyValue, { path: modelPath, parent: $model })
        targetPropertyValue.defineProperties(propertyValue);
      }
      // Descriptor Tree: false
      else {
        Object.defineProperty(target, $propertyKey, $propertyDescriptor);
      }
    }
    // Root Property Descriptor Value: New Model Instance
    else {
      let _target = typedObjectLiteral$1(propertyValue);
      const modelObject = new Model(
        _target, subschema, {
          path: modelPath,
          parent: $model,
        }
      );
      modelObject.retroReenableEvents();
      // Root Define Properties, Descriptor Tree
      if(descriptorTree === true) {
        modelObject.defineProperties(propertyValue);
        target[$propertyKey] = modelObject;
      } else 
      // Root Define Properties, No Descriptor Tree
      if(descriptorTree === false) {
        Object.defineProperty(target, $propertyKey, $propertyDescriptor);
      }
    }
  }
  // Property Descriptor Value: Primitive Type
  else {
    Object.defineProperty(target, $propertyKey, $propertyDescriptor);
  }
  // $model.enableEvents({ enable: true })
  // Define Property Event
  if(events) {
    const modelEventPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey);
    if(events['defineProperty:$key']) {
      definePropertyKeyChange.anter = target[$sourceKey];
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
    if(events['defineProperty']) {
      definePropertyChange.anter = target[$sourceKey];
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
  const { recursive, events } = $options;
  const { target } = $model;
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Model) {
        $propertyValue.freeze();
        if(events && events['freezeProperty']) {
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
  if(events && events['freeze']) {
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
  const { recursive, events } = $options;
  const { target } = $model;
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Model) {
        $propertyValue.seal();
        if(events && events['sealProperty']) {
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
  if(events && events['seal']) {
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

function concat($model, $options) {
  const { target, path, schema } = $model;
  const { enableValidation, validationEvents, events } = $options;
  const $arguments = [...arguments].reduce(($arguments, $argument) => {
    if(Array.isArray($argument)) { $arguments.push(...$argument); }
    else { $arguments.push($argument); }
    return $arguments
  }, []);
  let valueIndex = target.length;
  const values = [];
  let targetConcat = [...Array.from(target)];
  let model;
  iterateValues: 
  for(const $value of $arguments) {
    // Validation: Value
    if(schema && enableValidation) {
      const validValue = schema.validateProperty(valueIndex, $subvalue, {}, $model);
      if(schema &&validationEvents) {
        let type, propertyType;
        const validatorPath = (path)
          ? [path, valueIndex].join('.')
          : String(valueIndex);
        if(validValue.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', ':', valueIndex].join('');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', ':', valueIndex].join('');
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
    // Value: Object Type
    if(typeof $value === 'object') {
      // Value: Model
      if($value instanceof Model) { $value = $value.valueOf(); }
      let subschema = schema?.context[0] || null;
      const value = new Model($value, subschema, {
        path: modelPath,
        parent: $model,
      });
      values[valueIndex] = value;
    }
    // Value: Primitive Type
    else {
      values[valueIndex] = $value;
    }
    targetConcat = Array.prototype.concat.call(targetConcat, values[valueIndex]);
    // $model.enableEvents({ enable: true })
    if(events) {
      const modelEventPath = (path)
        ? [path, valueIndex].join('.')
        : String(valueIndex);
      if(events['concatValue']) {
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
      if(events['concatValue:$index']) {
        const type = ['concatValue', ':', valueIndex].join('');
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
  model = new Model(targetConcat, schema, $model.options);
  if(events && events['concat']) {
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
  const { enableValidation, validationEvents, events } = $options;
  const $arguments = [...arguments];
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
  iterateCopyIndex: 
  while(copyIndex < end) {
    const copyItem = target[copyIndex];
    copiedItems.push(copyItem);
    Array.prototype.copyWithin.call(
      target,
      targetIndex,
      copyIndex,
      copyIndex + 1
    );
    // $model.enableEvents({ enable: true })
    // Array Copy Within Index Event Data
    if(events) {
      const modelEventPath = (path)
        ? [path, copyIndex].join('.')
        : String(copyIndex);
      if(events['copyWithinIndex']) {
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
      if(events['copyWithinIndex:$index']) {
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
  if(events && events['copyWithin']) {
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

function fill($model, $options) {
  const { target, path, schema } = $model;
  const { enableValidation, validationEvents, events } = $options;
  const $arguments = [...arguments];
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
        const validatorPath = (path)
          ? [path, fillIndex].join('.')
          : String(fillIndex);
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
    let value = $arguments[0];
    if(typeof value === 'object') {
      if(value instanceof Model) { value = value.valueOf(); }
      const subschema = schema?.context[0] || null;
      value = new Model(value, subschema, {
        path: modelPath,
        parent: $model,
      });
    }
    Array.prototype.fill.call(
      target, value, fillIndex, fillIndex + 1
    );
    // $model.enableEvents({ enable: true })
    // Array Fill Index Event
    if(events) {
      const modelEventPath = (path)
        ? [path, fillIndex].join('.')
        : String(fillIndex);
      if(events['fillIndex']) {
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
      if(events['fillIndex:$index']) {
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
  // Array Fill Event
  if(events && events['fill']) {
    $model.dispatchEvent(
      new ModelEvent('fill', {
        path,
        detail: {
          start: $start,
          end: $end,
          value,
        },
      },
      $model)
    );
  }
  return $model
}

function pop($model, $options) {
  const { events } = $options;
  const { target, path } = $model;
  const popElement = Array.prototype.pop.call(target);
  // $model.enableEvents({ enable: true })
  const popElementIndex = target.length - 1;
  // Array Pop Event
  if(events && events['pop']) {
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
  const { events } = $options;
  const { target, path, schema } = $model;
  const { enableValidation, validationEvents } = $model.options;
  const elements = [];
  let elementsIndex = 0;
  iterateElements:
  for(let $element of $elements) {
    // Validation
    if(schema && enableValidation) {
      const validElement = schema.validateProperty(elementsIndex, $element, {}, $model);
      if(validationEvents) {
        let type, propertyType;
        const validatorPath = (path)
          ? [path, elementsIndex].join('.')
          : String(elementsIndex);
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
    if(typeof $element === 'object') {
      if($element instanceof Model) { $element = $element.valueOf(); }
      const subschema = schema?.context[0] || null;
      $element = new Model($element, subschema, {
        path: modelPath,
        parent: $model,
      });
      elements.push($element);
      Array.prototype.push.call(target, $element);
    } else {
      elements.push($element);
      Array.prototype.push.call(target, $element);
    }
    // $model.enableEvents({ enable: true })
    if(events) {
      const modelEventPath = (path)
        ? [path, '.', elementsIndex].join('')
        : String(elementsIndex);
      if(events['pushProp']) {
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
      if(events['pushProp:$index']) {
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
  // Push Event
  if(events && events['push']) {
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
  const { events } = $options;
  const { target, path } = $model;
  Array.prototype.reverse.call(target, ...arguments);
  // $model.enableEvents({ enable: true })
  if(events && events['reverse']) {
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
  const { events } = $options;
  const { target, path } = $model;
  const shiftElement = Array.prototype.shift.call(target);
  // $model.enableEvents({ enable: true })
  const shiftElementIndex = 0;
  // Array Shift Event
  if(events && events['shift']) {
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
  const { events } = $options;
  const { target, path, schema } = $model;
  const { enableValidation, validationEvents } = $options;
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
  spliceDelete:
  while(deleteItemsIndex < $deleteCount) {
    const deleteItem = Array.prototype.splice.call(target, $start, 1)[0];
    // $model.enableEvents({ enable: true })
    deleteItems.push(deleteItem);
    // Array Splice Delete Event
    if(events) {
      const modelEventPath = (path)
        ? [path, deleteItemsIndex].join('.')
        : String(deleteItemsIndex);
      if(events['spliceDelete']) {
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
      if(events['spliceDelete:$index']) {
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
    // Validation
    if(schema && enableValidation) {
      const validAddItem = schema.validateProperty(elementIndex, element, {}, $model);
      if(validationEvents) {
        let type, propertyType;
        const validatorEventPath = (path)
          ? [path, addItemsIndex].join('.')
          : String(addItemsIndex);
        // $model.enableEvents({ enable: true })
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
    // Add Item: Object Type
    if(typeof addItem === 'object') {
      if(addItem instanceof Model) { addItem = addItem.valueOf(); }
      const subschema = schema?.context[0] || null;
      addItem = new Model(addItem, subschema, {
        path: modelPath,
        parent: $model,
      });
      Array.prototype.splice.call(target, startIndex, 0, addItem);
    }
    // Add Item: Primitive Type
    else {
      Array.prototype.splice.call(target, startIndex, 0, addItem);
    }
    // $model.enableEvents({ enable: true })
    // Array Splice Add Event
    if(events) {
      const modelEventPath = (path)
        ? [path, addItemsIndex].join('.')
        : String(addItemsIndex);
      if(events['spliceAdd']) {
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
      if(events['spliceAdd:$index']) {
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
  // Array Splice Event
  if(events && events['splice']) {
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

function unshift($model, $options, ...$elements) {
  const { events } = $options;
  const { target, path, schema } = $model;
  const { enableValidation, validationEvents } = $options;
  const elements = [];
  const elementsLength = $elements.length;
  let elementIndex = elementsLength - 1;
  let elementCoindex = 0;
  iterateElements:
  while(elementIndex > -1) {
    const elementsLength = $elements.length;
    let $element = $elements[elementIndex];
    let element;
    const targetElement = target[elementIndex];
    const targetElementIsModelInstance = (
      targetElement instanceof Model
    ) ? true : false;
    // Validation
    if(schema && enableValidation) {
      const validElement = schema.validateProperty(elementIndex, $element, {}, $model);
      if(validationEvents) {
        let type, propertyType;
        const validatorEventPath = (path)
          ? [path, '.', elementCoindex].join('')
          : elementCoindex;
        if(validElement.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', ':', elementCoindex].join('');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', ':', elementCoindex].join('');
        }
        // $model.enableEvents({ enable: true })
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(new ValidatorEvent$1($eventType, validElement, $model));
        }
      }
      if(!validElement.valid) { return $model.length }
    }
    // const change = {
    //   preter: {
    //     key: elementCoindex,
    //     value: target[elementCoindex],
    //   },
    //   anter: {
    //     key: elementCoindex,
    //     value: undefined,
    //   },
    //   conter: undefined,
    // }
    // Element: Object Type
    if(typeof $element === 'object') {
      const subschema = schema?.context[0] || null;
      const modelPath = (path)
        ? path.concat('.', elementCoindex)
        : String(elementCoindex);
      element = new Model($element, subschema, {
        path: modelPath,
        parent: $model,
      });
      elements.unshift(element);
      Array.prototype.unshift.call(target, element);
    }
    // Element: Primitive Type
    else {
      element = $element;
      elements.unshift(element);
      Array.prototype.unshift.call(target, $element);
    }
    // change.anter.value = element
    // change.conter = (targetElementIsModelInstance)
    //   ? (targetElement.toString() !== JSON.stringify(element))
    //   : (JSON.stringify(targetElement) !== JSON.stringify(element))
    // Array Unshift Prop Event
    // $model.enableEvents({ enable: true })
    if(events) {
      const type = ['unshiftProp', elementCoindex].join(':');
      const modelEventPath = (path)
        ? [path, elementCoindex].join('.')
        : String(elementCoindex);
      if(events['unshiftProp']) {
        $model.dispatchEvent(
          new ModelEvent('unshiftProp', {
            path: modelEventPath,
            value: element,
            // change,
            detail: {
              elementIndex: elementCoindex, 
              element: element,
            },
          }, $model)
        );
      }
      if(events['unshiftProp:$index']) {
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath,
            value: element,
            // change,
            detail: {
              elementIndex: elementCoindex, 
              element: element,
            },
          }, $model)
        );
      }

    }
    elementIndex--;
    elementCoindex++;
  }
  // Array Unshift Event
  if(events && events['unshift'] && elements.length) {
    $model.dispatchEvent(
      new ModelEvent('unshift', {
        path,
        detail: {
          elements,
        },
      },
      $model)
    );
  }
  return $model.length
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
  // Get Property Event
  const { path } = $model;
  const { events } = $options;
  if(events && events['get']) {
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
  // Arguments
  const { events, pathkey, subpathError } = $options;
  // Path Key: true
  if(pathkey === true) {
    const subpaths = $path.split(new RegExp(regularExpressions$2.quotationEscape));
    const propertyKey = subpaths.shift();
    let propertyValue = target[propertyKey];
    // Return: Subproperty
    if(subpaths.length) {
      // Subpath Error
      if(subpathError === false && propertyValue === undefined) { return undefined }
      return propertyValue.get(subpaths.join('.'), $options)
    }
    // Get Property Event
    if(events) {
      if(events['getProperty']) {
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
      if(events['getProperty:$key']) {
        const type = ['getProperty', ':', propertyKey].join('');
        const _path = [path, '.', propertyKey].join('');
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
  // Path Key: false
  else if(pathkey === false) {
    const propertyValue = target[propertyKey];
    return propertyValue
  }
}

const { recursiveAssign: recursiveAssign$3 } = index;
function getProperty($model, $options, ...$arguments) {
  let getProperty;
  const options = recursiveAssign$3({}, $model.options, $options);
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { recursiveAssign$3(options, $arguments[1]); }
    getProperty = getContentProperty($model, options, ...$arguments);
  }
  else {
    if($arguments.length === 1) { recursiveAssign$3(options, $arguments[0]); }
    getProperty = getContent($model, options, ...$arguments);
  }
  return getProperty
}

function setContent($model, $options, $properties) {
  iterateProperties: 
  for(const [$propertyKey, $propertyValue] of Object.entries($properties)) {
    $model.set($propertyKey, $propertyValue, $options);
  }
  // Set Property Event
  const { path } = $model;
  const { events } = $options;
  if(events && events['set']) {
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

const { recursiveAssign: recursiveAssign$2, regularExpressions: regularExpressions$1} = index;
function setContentProperty($model, $options, $path, $value) {
  const { target, path, schema } = $model;
  const { enableValidation, validationEvents, events, pathkey, subpathError, recursive, source } = $options;
  // Path Key: true
  if(pathkey === true) {
    // Subpaths
    const subpaths = $path.split(new RegExp(regularExpressions$1.quotationEscape));
    // Property Key
    const propertyKey = subpaths.shift();
    // Property Value
    let propertyValue;
    const modelPath = (path)
      ? [path, propertyKey].join('.')
      : String(propertyKey);
    // Return: Subproperty
    if(subpaths.length) {
      if(recursive && target[propertyKey] === undefined) {
        // Subschema
        let subschema;
        if(schema?.type === 'array') { subschema = schema.context[0]; }
        else if(schema?.type === 'object') { subschema = schema.context[propertyKey]; }
        else { subschema = undefined; }
        // Submodel
        let submodel;
        if(subschema?.type === 'array') { submodel = []; }
        else if(subschema?.type === 'object') { submodel = {}; }
        else {
          if(Number(propertyKey)) { submodel = []; }
          else { submodel = {}; }
        }
        propertyValue = new Model(submodel, subschema, recursiveAssign$2({}, $options, {
          path: modelPath,
          parent: $model,
        }));
      }
      else {
        propertyValue = target[propertyKey];
      }
      // Subpath Error
      if(subpathError === false && propertyValue === undefined) { return undefined }
      propertyValue.set(subpaths.join('.'), $value, $options);
      return propertyValue
    }
    // Validation
    if(schema && enableValidation) {
      const validTargetProp = schema.validateProperty(propertyKey, $value, source, $model);
      if(validationEvents) {
        let type, propertyType;
        const validatorEventPath = (path)
          ? [path, propertyKey].join('.')
          : String(propertyKey);
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
    // Return: Property
    // Value: Object Literal
    if(typeof $value === 'object') {
      // Value: Model
      if($value instanceof Model) { $value = $value.valueOf(); }
      let subschema;
      let submodel;
      if(schema?.type === 'array') {
        subschema = schema.context[0];
        submodel = [];
      }
      else if(schema?.type === 'object') {
        subschema = schema.context[propertyKey];
        submodel = {};
      }
      else { subschema = undefined; }
      propertyValue = new Model(submodel, subschema, recursiveAssign$2(
        {}, $options, {
          path: modelPath,
          parent: $model,
        }
      ));
      target[propertyKey] = propertyValue;
      $model.retroReenableEvents();
      propertyValue.set($value);
    }
    // Value: Primitive Literal
    else {
      propertyValue = $value;
      target[propertyKey] = propertyValue;
    }
    // Root Assignment
    // Set Property Event
    if(events) {
      const modelEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey);
      if(events['setProperty']) {
        $model.dispatchEvent(
          new ModelEvent('setProperty', {
            path: modelEventPath, 
            value: propertyValue,
            // change,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $model)
        );
      }
      if(events['setProperty:$key']) {
        const type = ['setProperty', ':', propertyKey].join('');
        $model.dispatchEvent(
          new ModelEvent(type, {
            path: modelEventPath, 
            value: propertyValue,
            // change,
            detail: {
              value: propertyValue,
            }
          }, $model)
        );
      }
    }
    // Return Property Value
    return propertyValue
  }
  // Path Key: false
  else if(pathkey === false) {
    let propertyKey = $path;
    // Property Value: Object
    if(typeof $value === 'object') {
      if($value instanceof Model) { $value = $value.valueOf(); }
      let subschema;
      let submodel;
      if(schema?.type === 'array') {
        subschema = schema.context[0];
        submodel = [];
      }
      if(schema?.type === 'object') {
        subschema = schema.context[propertyKey];
        submodel = {};
      }
      else { subschema = undefined; }
      const modelPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey);
      propertyValue = new Model(submodel, subschema, recursiveAssign$2(
        {}, $options, {
          path: modelPath,
          parent: $model,
        }
      ));
      target[propertyKey] = propertyValue;
      propertyValue.set($value);
    }
    // Property Value: Primitive Literal
    else {
      propertyValue = $value;
      target[propertyKey] = propertyValue;
    }
    // Root Assignment
    // Set Property Event
    if(events) {
      const modelEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey);
      if(events['setProperty']) {
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
      if(events['setProperty:$key']) {
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
    // Return Property Value
    return propertyValue
  }
}

const { recursiveAssign: recursiveAssign$1 } = index;
function setProperty($model, $options, ...$arguments) {
  let setProperty;
  const options = recursiveAssign$1({}, $model.options, $options);
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 3) { recursiveAssign$1(options, $arguments[2]); }
    setProperty = setContentProperty($model, options, ...$arguments);
  }
  else {
    if($arguments.length === 2) { recursiveAssign$1(options, $arguments[1]); }
    setProperty = setContent($model, options, ...$arguments);
  }
  return setProperty
}

function deleteContent($model, $options) {
  const { target } = $model;
  for(const [$targetPropertyKey, $targetPropertyValue] of Object.entries(target)) {
    $model.delete($targetPropertyKey, $options);
  }
  // Delete Property Event
  const { path } = $model;
  const { events } = $options;
  if(events && events['delete']) {
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
  const { events, pathkey, subpathError, enableValidation, validationEvents } = $options;
  // Path Key: true
  if(pathkey === true) {
    const subpaths = $path.split(new RegExp(regularExpressions.quotationEscape));
    const propertyKey = subpaths.shift();
    let propertyValue = target[propertyKey];

    // Return: Subproperty
    if(subpaths.length) {
      // Subpath Error
      if(subpathError === false && propertyValue === undefined) { return undefined }
      return propertyValue.delete(subpaths.join('.'), $options)
    }
    // Validation
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
          propertyType = ['validProperty', ':', propertyKey].join('');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', ':', propertyKey].join('');
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
    if(typeof propertyValue === 'object') {
      propertyValue.delete($options);
    }
    delete target[propertyKey];
    // Delete Property Event
    if(events) {
      if(events['deleteProperty']) {
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
      if(events['deleteProperty:$key']) {
        const type = ['deleteProperty', ':', propertyKey].join('');
        const _path = [path, '.', propertyKey].join('');
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
  // Path Key: false
  else if(pathkey === false) {
    const propertyKey = $path;
    const propertyValue = target[propertyKey];

    // Validation
    if(schema && enableValidation) {
      const differedPropertyProxy = $model.valueOf();
      delete differedPropertyProxy[propertyKey];
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, $model, $model);
      if(validationEvents) {
        let type, propertyType;
        const validatorEventPath = (path)
          ? [path, propertyKey].join('.')
          : String(propertyKey);
        if(validTargetProp.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', ':', propertyKey].join('');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', ':', propertyKey].join('');
        }
        for(const $eventType of [type, propertyType]) {
          $model.dispatchEvent(
            new ValidatorEvent($eventType, validTargetProp, $model)
          );
        }
      }
      if(!validTargetProp.valid) { return }
    }
  
    if(propertyValue instanceof Model) {
      propertyValue.delete($options);
    }
    delete target[propertyKey];
    // Delete Property Event
    if(events) {
      if(events['deleteProperty']) {
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
      if(events['deleteProperty:$key']) {
        const type = ['deleteProperty', ':', propertyKey].join('');
        const _path = [path, '.', propertyKey].join('');
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

const { recursiveAssign } = index;
function deleteProperty($model, $options, ...$arguments) {
  let deleteProperty;
  const options = recursiveAssign({}, $model.options, $options);
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { recursiveAssign(options, $arguments[1]); }
    deleteProperty = deleteContentProperty($model, options, ...$arguments);
  }
  else {
    if($arguments.length === 1) { recursiveAssign(options, $arguments[0]); }
    deleteProperty = deleteContent($model, options, ...$arguments);
  }
  return deleteProperty
}

var AccessorProperty = {
  get: getProperty,
  set: setProperty,
  delete: deleteProperty,
};

const Defaults = Object.freeze({
  object: [{
    keys: ['valueOf'],
    createMethod: function($methodName, $model) {
      return function valueOf() { return $model.parse({ type: 'object' }) }
    },
  }, {
    keys: ['toString'],
    createMethod: function($methodName, $model) {
      return function toString($parseSettings = {}) {
        const replacer = ($parseSettings.replacer !== undefined)
          ? $parseSettings.replacer : null;
        const space = ($parseSettings.space !== undefined)
          ? $parseSettings.space : 0;
        return $model.parse({ type: 'string', replacer, space })
      }
    }, 
  }, {
    keys: [
      'entries', 'fromEntries', 'getOwnPropertyDescriptors', 
      'getOwnPropertyDescriptor', 'getOwnPropertyNames', 
      /* 'getOwnPropertySymbols', */ 'groupBy', 'hasOwn', 'is', 
      'getPrototypeOf', 'isExtensible', 'isFrozen', 'isSealed', 
      'keys', 'preventExtensions', 'values',
    ],
    createMethod: function($methodName, $model) {
      return Object[$methodName].bind(null, $model.valueOf())
    },
  }, {
    keys: ['propertyIsEnumerable', 'hasOwnProperty'], 
    createMethod: function($methodName, $model) {
      return () => $model.parse({ type: 'object' })[$methodName]
    },
  }, {
    type: 'mutators',
    keys: Object.keys(ObjectProperty), 
    createMethod: function($methodName, $model, $options) {
      return ObjectProperty[$methodName].bind(null, $model, $options) 
    }
  }],
  array: [{
    keys: [
      'from', 'fromAsync', 'isArray', 'of', 
    ], 
    createMethod: function($methodName, $model) {
      return Array[$methodName]
    }, 
  }, {
    keys: [
      'at', 'every', 'filter', 'find', 'findIndex', 'findLast',
      'findLastIndex', 'flat', 'flatMap', 'forEach', 'includes', 
      'indexOf', 'join', 'lastIndexOf', 'map', 'reduce', 'reduceRight', 
      'slice', 'some', 'sort', 'toReversed',  'toSorted', 'toSpliced', 
      'with', 
    ], 
    createMethod: function($methodName, $model) {
      return Array.prototype[$methodName].bind(null, $model)
    }
  }, {
    type: 'mutators',
    keys: Object.keys(ArrayProperty), 
    createMethod: function($methodName, $model, $options) {
      return ArrayProperty[$methodName].bind(null, $model, $options)
    }
  }],
  accessor: [{
    type: 'mutators',
    keys: Object.keys(AccessorProperty),
    createMethod: function($methodName, $model, $options) {
      return AccessorProperty[$methodName].bind(null, $model, $options)
    }
  }]
});
function Methods($model) {
  iterateDefaultPropertyClasses: // Object, Array, Accessor
  for(const [$propertyClassName, $propertyClasses] of Object.entries(Defaults)) {
    iteratePropertyClasses: 
    for(const $propertyClass of $propertyClasses) {
      const { keys, createMethod, type } = $propertyClass;
      for(const $methodName of keys) {
        if($propertyClassName === 'accessor' || type === 'mutators') {
          const methodOptions = $model.options?.methods[$propertyClassName][$methodName] || {};
          Object.defineProperty($model, $methodName, {
            enumerable: false, writable: false, configurable: false, 
            value: createMethod($methodName, $model, methodOptions),
          });
        }
        else {
          Object.defineProperty($model, $methodName, {
            enumerable: false, writable: false, configurable: false, 
            value: createMethod($methodName,  $model),
          });
        }
      }
    }
  }
  return $model
}

const { typedObjectLiteral, typeOf } = index;

class Model extends Core {
  #_properties
  #options
  #schema
  #type
  #target
  #parent
  #key
  #path
  #_handler
  constructor($properties = {}, $schema = null, $options = {}) {
    super({
      accessors: [($target, $property) => {
        if($property === undefined) { return $target.target }
        else { return $target.get($property) }
      }, ($target, $property) => {
        if($property === undefined) { return $target }
        else { return $target[$property] }
      }],
    });
    if($options.addEvents) {
      this.addEvents($options.addEvents);
      delete $options.addEvents;
    }
    if($options.enableEvents) {
      const typeofEnableEvents = typeof $options.enableEvents;
      if(typeofEnableEvents === 'boolean') { this.enableEvents(); }
      else if(typeofEnableEvents === 'object') { this.enableEvents($options.enableEvents); }
    }
    this.#properties = $properties;
    this.schema = $schema;
    this.#options = Options($options);
    Methods(this);
    this[this.options.assignmentMethod](this.#properties);
  }
  get #properties() { return this.#_properties }
  set #properties($properties) {
    if(this.#_properties !== undefined) return
    if($properties instanceof Model) {
      this.#_properties = $properties.valueOf();
    }
    this.#_properties = $properties;
    return this.#_properties
  }
  get options() { return this.#options }
  get schema() { return this.#schema }
  set schema($schema) {
  if(this.#schema !== undefined)  { return }
    const typeOfSchema = typeOf($schema);
    if(['undefined', 'null'].includes(typeOfSchema)) { this.#schema = null; }
    else if($schema instanceof Schema) { this.#schema = $schema; }
    else if(typeOfSchema === 'array') { this.#schema = new Schema(...arguments); }
    else if(typeOfSchema === 'object') { this.#schema = new Schema($schema); }
  }
  get classToString() { return Model.toString() }
  get type() {
    if(this.#type !== undefined) return this.#type
    this.#type = typeOf(this.#properties);
    return this.#type
  }
  get parent() {
    if(this.#parent !== undefined)  return this.#parent
    this.#parent = (this.options.parent) ? this.options.parent : null;
    return this.#parent
  }
  get root() {
    let root = this;
    iterateParents: 
    while(root) {
      if([undefined, null].includes(root.parent)) { break iterateParents }
      root = root.parent;
    }
    return root
  }
  get key() {
    if(this.#key !== undefined) { return this.#key }
    if(this.path) { this.#key = this.path.split('.').pop(); }
    else { this.#key = null; }
    return this.#key
  }
  get path() {
    if(this.#path !== undefined)  return this.#path
    this.#path = (this.options.path)
      ? String(this.options.path)
      : null;
    return this.#path
  }
  get target() {
    if(this.#target !== undefined) return this.#target
    this.#target = typedObjectLiteral(this.#properties);
    return this.#target
  }
  retroReenableEvents() {
    let model = this;
    while(model) {
      model.reenableEvents({ enable: true });
      model = model.parent;
    }
    return this
  }
  parse($settings = {
    type: 'object', // string
    replacer: null,
    space: 0,
  }) {
    let parsement = typedObjectLiteral(this.type);
    for(const [
      $propertyDescriptorName, $propertyDescriptor
    ] of Object.entries(
      Object.getOwnPropertyDescriptors(this.target))
    ) {
      const { enumerable, value, writable, configurable } = $propertyDescriptor;
      if($propertyDescriptor.value instanceof Model) {
        Object.defineProperty(parsement, $propertyDescriptorName, {
          enumerable, value: value.parse({ type: 'object' }), writable, configurable
        });
      }
      else {
        Object.defineProperty(parsement, $propertyDescriptorName, {
          enumerable, value, writable, configurable
        });
      }
    }
    const { type, replacer, space } = $settings;
    if(type === 'object') { return parsement }
    else if(type === 'string') { return JSON.stringify(parsement, replacer, space) }
    else { return undefined }
  }
}

export { Model, Schema, Validation, Validator, Verification };
//# sourceMappingURL=objecture.js.map
