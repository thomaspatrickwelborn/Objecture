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

const Options$2 = {
  depth: 0,
  maxDepth: 10,
};
function propertyDirectory($object, $options) {
  const target = [];
  const options = Object.assign({}, Options$2, $options);
  options.depth++;
  if(options.depth > options.maxDepth) { return target }
  iterateObjectProperties: 
  for(const [$key, $value] of Object.entries($object)) {
    target.push($key);
    if(
      typeof $value === 'object' &&
      $value !== null &&
      $value !== $object
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
        target.push(path);
      }
    }
  }
  return target
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

function recursiveFreeze($target) {
  for(const [$propertyKey, $propertyValue] of Object.entries($target)) {
    if($propertyValue && typeof $propertyValue === 'object') {
      recursiveFreeze($propertyValue);
    }
  }
  return Object.freeze($target)
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
  expandEvents: expandEvents,
  impandEvents: impandEvents,
  propertyDirectory: propertyDirectory,
  recursiveAssign: recursiveAssign$8,
  recursiveAssignConcat: recursiveAssignConcat,
  recursiveFreeze: recursiveFreeze,
  typeOf: typeOf$4,
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
    propertyDirectory: { maxDepth: 10 },
    enable: false,
    accessors: [
      ($target, $property) => $target[$property],
    ],
    assign: 'addEventListener', deassign: 'removeEventListener', transsign: 'dispatchEvent',
    bindListener: true,
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
      transsign: {
        // Event Target Dispatch Event
        dispatchEvent: function dispatchEvent($eventDefinition, $target, $event) {
          return $target['dispatchEvent']($event)
        },
        // Event Emitter Emit
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
        Settings[$settingKey] = Settings[$settingKey].concat($settingValue);
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
  #enabled = []
  #disabled = []
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
    if(![true, false].includes($enable)) { return }
    const targets = this.#targets;
    if(targets.length === 0) { return }
    const enabled = this.#enabled;
    const disabled = this.#disabled;
    enabled.length = 0;
    disabled.length = 0;
    iterateTargetElements: 
    for(const $targetElement of targets) {
      const { path, target, enable } = $targetElement;
      const settings = this.settings;
      if(enable === $enable) { continue iterateTargetElements }
      if($enable === true) {
        try {
          this.#assign(target);
          $targetElement.enable = $enable;
          enabled.push($targetElement);
        }
        catch($err) {
          throw $err
          disabled.push($targetElement);
        }
      }
      else if($enable === false) {
        try {
          this.#deassign(target);
          $targetElement.enable = $enable;
          disabled.push($targetElement);
        }
        catch($err) { enabled.push($targetElement); }
      }
    }
    if((
      $enable === true && 
      disabled.length === 0 &&
      enabled.length > 0
    ) || (
      $enable === false && 
      enabled.length === 0 && 
      disabled.length > 0
    ) || (
      disabled.length === 0 &&
      enabled.length === 0
    )) { this.#enable = $enable; }
    else if(
      disabled.length > 0 &&
      enabled.length > 0
    ) { this.#enable = null; }
  }
  get enabled() { return this.#enabled }
  get disabled() { return this.#disabled }
  get #target() { return this.settings.target }
  get #targets() {
    const pretargets = this.#_targets;
    let propertyDirectory = this.#propertyDirectory;
    const targetPaths = [];
    const targets = [];
    if(this.path === ':scope') {
      const pretargetElement = pretargets.find(
        ($pretarget) => $pretarget?.path === this.path
      );
      if(pretargetElement !== undefined) {
        targets.push(pretargetElement);
      }
      else if(pretargetElement === undefined) {
        targets.push({
          path: this.path,
          target: this.#context,
          enable: false,
        });
      }
    }
    else if(this.#target !== undefined) {
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
      iteratePropertyPaths: 
      for(const $propertyPath of propertyDirectory) {
        const propertyPathMatch = propertyPathMatcher($propertyPath);
        if(propertyPathMatch === true) { targetPaths.push($propertyPath); }
      }
      iterateTargetPaths: 
      for(const $targetPath of targetPaths) {
        const pretargetElement = pretargets.find(
          ($pretarget) => $pretarget?.path === $targetPath
        );
        let target = this.#context;
        let targetElement;
        const pathKeys = $targetPath.split('.');
        let pathKeysIndex = 0;
        iterateTargetPathKeys: 
        while(pathKeysIndex < pathKeys.length) {
          let pathKey = pathKeys[pathKeysIndex];
          iterateTargetAccessors: 
          for(const $targetAccessor of this.settings.accessors) {
            if(target === undefined) { break iterateTargetAccessors }
            target = $targetAccessor(target, pathKey);
            if(target !== undefined) { break iterateTargetAccessors }
          }
          pathKeysIndex++;
        }
        if(target !== undefined) {
          if(target === pretargetElement?.target) {
            targetElement = pretargetElement;
          }
          else {
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
    this.#_targets = targets;
    return this.#_targets
  }
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
    return propertyDirectory(this.#context, this.settings.propertyDirectory)
  }
  emit() {
    const targets = this.#targets;
    iterateTargetElements: 
    for(const $targetElement of targets) {
      const { target } = $targetElement;
      this.#transsign(target, ...arguments);
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
      // Get Events
      [settings.propertyDefinitions.getEvents]: {
        enumerable: false, writable: false, 
        value: function getEvents() {
          if(arguments.length === 0) { return events }
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
            const event = Object.assign({}, settings, $addEvent);
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
          let $events;
          if(arguments.length === 0) { $events = $target[settings.propertyDefinitions.getEvents](); }
          else if(arguments.length === 1) {
            $events = $target[settings.propertyDefinitions.getEvents](arguments[0]);
          }
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
          let $events;
          if(arguments.length === 0) { $events = events; }
          else { $events = $target[settings.propertyDefinitions.getEvents](arguments[0]); }
          iterateEvents: for(const $event of $events) { $event.enable = true; }
          return $target
        },
      },
      // Disable Events
      [settings.propertyDefinitions.disableEvents]: {
        enumerable: false, writable: false, 
        value: function disableEvents() {
          let $events;
          if(arguments.length === 0) { $events = events; }
          else { $events = $target[settings.propertyDefinitions.getEvents](arguments[0]); }
          iterateEvents: for(const $event of $events) { $event.enable = false; }
          return $target
        },
      },
      // Reenable Events
      [settings.propertyDefinitions.reenableEvents]: {
        enumerable: false, writable: false, 
        value: function reenableEvents() {
          $target[settings.propertyDefinitions.disableEvents](arguments[0]);
          $target[settings.propertyDefinitions.enableEvents](arguments[0]);
          return $target
        },
      },
    });
    if(settings.events) { $target[settings.propertyDefinitions.addEvents](settings.events); }
    if(settings.enableEvents === true) {
      $target[settings.propertyDefinitions.enableEvents]();
    }
    else if(typeof settings.enableEvents === 'object') {
      $target[settings.propertyDefinitions.enableEvents](settings.enableEvents);
    }
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
          const corequiredContentProperties = typedObjectLiteral$6(type);
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
              corequiredContentProperties[$requiredPropertyName] = sourcePropertyDescriptor.value;
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
          const corequiredContentPropertiesSize = Object.keys(corequiredContentProperties).length;
          if(corequiredContextPropertiesSize === 0 && corequiredContentPropertiesSize === 0) { pass = true; }
          else if(corequiredContextPropertiesSize !== corequiredContentPropertiesSize) { pass = false; }
          else {
            const coschema = new Schema(corequiredContextProperties, Object.assign({}, this.schema.options, {
              required: false 
            }));
            const validations = [];
            for(const [
              $corequiredContextPropertyName, $corequiredContextProperty
            ] of Object.entries(corequiredContentProperties)) {
              const corequiredContentPropertyName = $corequiredContextPropertyName;
              const corequiredContentProperty = corequiredContentProperties[corequiredContentPropertyName];
              const coschemaPropertyValidation = coschema.validateProperty(
                $corequiredContextPropertyName, corequiredContentProperty,
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
        const typeOfContentValue = typeOf$3($value);
        if(typeOfContentValue === 'undefined') { pass = false; }
        else if(typeOfDefinitionValue === 'undefined') { pass = true; }
        else { pass = (typeOfDefinitionValue === typeOfContentValue); }
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
    // Iterate Content Properties 
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
    // const ContentClassString = Content.toString()
    const sourceIsContentClassInstance = ($source instanceof Content);
    $source = (sourceIsContentClassInstance) ? $source.valueOf() : $source;
    const $targetIsContentClassInstance = ($target instanceof Content);
    $target = ($targetIsContentClassInstance) ? $target.valueOf() : $target;
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
  contentAssignmentMethod: 'set',
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
        events: { 'freeze': true  },
      },
      seal: {
        recursive: true,
        events: { 'seal': true  },
      },
    },
  },
}, $options);

class ContentEvent extends CustomEvent {
  #settings
  #content
  #key
  constructor($type, $settings, $content) {
    super($type, $settings);
    this.#settings = $settings;
    this.#content = $content;
    if(!this.content.parent) return this
    this.content.addEventListener(
      $type, 
      ($event) => {
        const { path, value, detail, change } = $event;
        this.content.parent.dispatchEvent(
          new ContentEvent(
            this.type, 
            { path, value, detail, change },
            this.content.parent
          )
        );
      }, 
      {
        once: true
      }
    );
  }
  get content() { return this.#content }
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
    if($preter instanceof Content) { this.#preter = $preter.valueOf(); }
    else { this.#preter = $preter; }
    this.#_preter = true;
  }
  get anter() { return this.#anter }
  set anter($anter) {
    if(this.#_anter === true) { return this.#anter }
    if($anter instanceof Content) { this.#anter = $anter.valueOf(); }
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
  #content
  #key
  #path
  #value
  #valid
  constructor($type, $settings, $content) {
    super($type);
    this.#settings = $settings;
    this.#content = $content;
    this.#content.addEventListener(
      $type, 
      ($event) => {
        if(this.#content.parent !== null) {
          this.#content.parent.dispatchEvent(
            new ValidatorEvent(
              this.type, 
              {
                key: $event.key,
                path: $event.path,
                detail: $event.detail,
              },
              this.#content.parent
            )
          );
        }
      }, 
      {
        once: true
      }
    );
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
function assign($content, $options, ...$sources) {
  const { path, target, schema } = $content;
  const { events, sourceTree, enableValidation, validationEvents } = $options;
  const assignedSources = [];
  const assignChange = new Change({ preter: $content });
  // Iterate Sources
  iterateAssignSources: 
  for(let $source of $sources) {
    let assignedSource;
    const assignSourceChange = new Change({ preter: $content });
    if(Array.isArray($source)) { assignedSource = []; }
    else if(typeof $source === 'object') { assignedSource = {}; }
    // Iterate Source Props
    iterateSourceProperties:
    for(let [$sourceKey, $sourceValue] of Object.entries($source)) {
      const assignSourcePropertyChange = new Change({ preter: target[$sourceKey] });
      const assignSourcePropertyKeyChange = new Change({ preter: target[$sourceKey] });
      // Validation
      if(schema && enableValidation) {
        const validSourceProp = schema.validateProperty(
          $sourceKey, $sourceValue, $source, $content
        );
        if(validationEvents) {
          let type, propertyType;
          const validatorEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey);
          if(validSourceProp.valid) {
            type = 'validProperty';
            propertyType = ['validProperty', $sourceKey].join(':');
          }
          else {
            type = 'nonvalidProperty';
            propertyType = ['nonvalidProperty', $sourceKey].join(':');
          }
          for(const $eventType of [type, propertyType]) {
            $content.dispatchEvent(new ValidatorEvent$1($eventType, validSourceProp, $content));
          }
        }
        if(!validSourceProp.valid) { continue iterateSourceProperties }
      }
      // Source Prop: Object Type
      let sourceValue;
      let assignment;
      if($sourceValue && typeof $sourceValue === 'object') {
        if($sourceValue instanceof Content) {
          sourceValue = $sourceValue.valueOf();
        }
        // Subschema
        let subschema;
        if(schema?.type === 'array') { subschema = schema.context[0]; }
        else if(schema?.type === 'object') { subschema = schema.context[$sourceKey]; }
        else { subschema = null; }
        // Content
        const contentPath = (path)
          ? [path, $sourceKey].join('.')
          : String($sourceKey);
        let contentTypedLiteral = typedObjectLiteral$3($sourceValue);
        // Assignment
        // Source Tree: False
        if(sourceTree === false) {
          sourceValue = new Content(contentTypedLiteral, subschema, 
            recursiveAssign$4({}, $content.options, {
              path: contentPath,
              parent: $content,
            })
          );
          sourceValue.assign($sourceValue);
          assignment = { [$sourceKey]: sourceValue };
        }
        // Source Tree: true
        else {
          // Assignment: Existing Content Instance
          if(target[$sourceKey] instanceof Content) {
            target[$sourceKey].assign($sourceValue);
          }
          // Assignment: New Content Instance
          else {
            sourceValue = new Content(contentTypedLiteral, subschema, 
              recursiveAssign$4({}, $content.options, {
                path: contentPath,
                parent: $content,
              })
            );
            sourceValue.assign($sourceValue);
          }
          assignment = { [$sourceKey]: sourceValue };
        }
        // Assignment
      }
      // Source Prop: Primitive Type
      else {
        assignment = { [$sourceKey]: $sourceValue };
      }
      Object.assign(target, assignment);
      Object.assign(assignedSource, assignment);
      // Content Event: Assign Source Property
      if(events) {
        const contentEventPath = (path) ? [path, $sourceKey].join('.') : String($sourceKey);
        if(events['assignSourceProperty:$key']) {
          const type = ['assignSourceProperty', $sourceKey].join(':');
          assignSourcePropertyKeyChange.anter = target[$sourceKey];
          $content.dispatchEvent(
            new ContentEvent(type, {
              path: contentEventPath,
              value: sourceValue,
              change: assignSourcePropertyKeyChange,
              detail: {
                source: assignedSource,
              }
            }, $content)
          );
        }
        if(events['assignSourceProperty']) {
          assignSourcePropertyChange.anter = target[$sourceKey];
          $content.dispatchEvent(
            new ContentEvent('assignSourceProperty', {
              path: contentEventPath,
              value: sourceValue,
              change: assignSourcePropertyChange,
              detail: {
                source: assignedSource,
              }
            }, $content)
          );
        }
      }
    }
    assignedSources.push(assignedSource);
    // Content Event: Assign Source
    if(events && events['assignSource']) {
      assignSourceChange.anter = $content;
      $content.dispatchEvent(
        new ContentEvent('assignSource', {
          path,
          change: assignSourceChange,
          detail: {
            source: assignedSource,
          },
        }, $content)
      );
    }
  }
  // Content Event: Assign
  if(events && events['assign']) {
    assignChange.anter = $content;
    $content.dispatchEvent(
      new ContentEvent('assign', { 
        path,
        change: assignChange,
        detail: {
          sources: assignedSources,
        },
      }, $content)
    );
  }
  return $content
}

const { impandTree, typedObjectLiteral: typedObjectLiteral$2 } = index;
function defineProperties($content, $options, $propertyDescriptors) {
  const { events } = $options;
  const { path } = $content;
  const propertyDescriptorEntries = Object.entries($propertyDescriptors);
  const impandPropertyDescriptors = impandTree($propertyDescriptors, 'value');
  let properties = typedObjectLiteral$2($content.valueOf());
  const definePropertiesChange = new Change({ preter: $content });
  // Iterate Property Descriptors
  iteratePropertyDescriptors: 
  for(const [
    $propertyKey, $propertyDescriptor
  ] of propertyDescriptorEntries) {
    // Property Descriptor Value Is Direct Instance Of Array/object/Map
    $content.defineProperty($propertyKey, $propertyDescriptor, impandPropertyDescriptors);
  }
  // Define Properties Event
  if(events && events['defineProperties']) {
    // Define Properties Validator Event
    definePropertiesChange.anter = $content;
    $content.dispatchEvent(
      new ContentEvent(
        'defineProperties',
        {
          path,
          value: $content.valueOf(),
          detail: {
            descriptors: $propertyDescriptors,
          },
        },
        $content
      )
    );
  }
  return $content
}

const { typedObjectLiteral: typedObjectLiteral$1 } = index;
function defineProperty($content, $options, $propertyKey, $propertyDescriptor) {
  const { descriptorTree, events } = $options;
  const { target, path, schema } = $content;
  const { enableValidation, validationEvents } = $options;
  const propertyValue = $propertyDescriptor.value;
  const targetPropertyDescriptor = Object.getOwnPropertyDescriptor(target, $propertyKey) || {};
  const targetPropertyValue = targetPropertyDescriptor.value;
  const definePropertyChange = new Change({ preter: targetPropertyValue });
  const definePropertyKeyChange = new Change({ preter: targetPropertyValue });
  const targetPropertyValueIsContentInstance = (
    targetPropertyValue instanceof Content
  ) ? true : false;
  // Validation
  if(schema && enableValidation) {
    const validProperty = schema.validateProperty($propertyKey, propertyValue, $content);
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
        $content.dispatchEvent(new ValidatorEvent$1($eventType, validProperty, $content));
      }
    }
    if(!validProperty.valid) { return $content }
  }
  // Property Descriptor Value: Object Type
  if(typeof propertyValue === 'object') {
    // Subschema
    let subschema;
    if(schema.type === 'array') { subschema = schema.context[0]; }
    else if(schema.type === 'object') { subschema = schema.context[$propertyKey]; }
    else { subschema = undefined;}
    // Root Property Descriptor Value: Existent Content Instance
    const contentPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey);
    if(targetPropertyValueIsContentInstance) {
      // Descriptor Tree: true
      if(descriptorTree === true) {
        // propertyValue = Object.assign(propertyValue, { path: contentPath, parent: $content })
        targetPropertyValue.defineProperties(propertyValue);
      }
      // Descriptor Tree: false
      else {
        Object.defineProperty(target, $propertyKey, $propertyDescriptor);
      }
    }
    // Root Property Descriptor Value: New Content Instance
    else {
      let _target = typedObjectLiteral$1(propertyValue);
      const contentObject = new Content(
        _target, subschema, {
          path: contentPath,
          parent: $content,
        }
      );
      // Root Define Properties, Descriptor Tree
      if(descriptorTree === true) {
        contentObject.defineProperties(propertyValue);
        target[$propertyKey] = contentObject;
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
  // Define Property Event
  if(events) {
    const contentEventPath = (path)
      ? [path, $propertyKey].join('.')
      : String($propertyKey);
    if(events['defineProperty:$key']) {
      definePropertyKeyChange.anter = target[$sourceKey];
      const type = ['defineProperty', $propertyKey].join(':');
      $content.dispatchEvent(
        new ContentEvent(type, {
          path: contentEventPath,
          value: propertyValue,
          change: definePropertyKeyChange,
          detail: {
            prop: $propertyKey,
            descriptor: $propertyDescriptor,
          },
        }, $content
      ));
    }
    if(events['defineProperty']) {
      definePropertyChange.anter = target[$sourceKey];
      $content.dispatchEvent(
        new ContentEvent('defineProperty', {
          path: contentEventPath,
          value: propertyValue,
          change: definePropertyChange,
          detail: {
            prop: $propertyKey,
            descriptor: $propertyDescriptor,
          },
        }, $content
      ));
    }
  }
  return $content
}

function freeze($content, $options) {
  const { recursive, events } = $options;
  const { target, path } = $content;
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Content) {
        $propertyValue.freeze();
      }
      else { Object.freeze($propertyValue); }
      if(events && events['freeze']) {
        $content.dispatchEvent(
          new ContentEvent(
            'freeze',
            { path },
            $content
          )
        );
      }
    }
  }
  Object.freeze(target);
  return $content
}

function seal($content, $options) {
  const { recursive, events } = $options;
  const { target, path } = $content;
  if(recursive === true) {
    iterateProperties: 
    for(const [
      $propertyKey, $propertyValue
    ] of Object.entries(target)) {
      if($propertyValue instanceof Content) {
        $propertyValue.seal();
      }
      else { Object.seal($propertyValue); }
      if(events && events['seal']) {
        $content.dispatchEvent(
          new ContentEvent(
            'seal',
            { path },
            $content
          )
        );
      }
    }
  }
  Object.seal(target);
  return $content
}

var ObjectProperty = {
  assign,
  defineProperties,
  defineProperty,
  freeze,
  seal,
};

function concat($content, $options) {
  const { target, path, schema } = $content;
  const { enableValidation, validationEvents, events } = $options;
  const $arguments = [...arguments].reduce(($arguments, $argument) => {
    if(Array.isArray($argument)) { $arguments.push(...$argument); }
    else { $arguments.push($argument); }
    return $arguments
  }, []);
  let valueIndex = target.length;
  const values = [];
  let targetConcat = [...Array.from(target)];
  let content;
  iterateValues: 
  for(const $value of $arguments) {
    // Validation: Value
    if(schema && enableValidation) {
      const validValue = schema.validateProperty(valueIndex, $subvalue, {}, $content);
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
          $content.dispatchEvent(new ValidatorEvent($eventType, validValue, $content));
        }
      }
      if(!validValue.valid) { valueIndex++; continue iterateValues }
    }
    const contentPath = (path)
      ? [path, valueIndex].join('.')
      : String(valueIndex);
    // Value: Object Type
    if(typeof $value === 'object') {
      // Value: Content
      if($value instanceof Content) { $value = $value.valueOf(); }
      let subschema = schema?.context[0] || null;
      const value = new Content($value, subschema, {
        path: contentPath,
        parent: $content,
      });
      values[valueIndex] = value;
    }
    // Value: Primitive Type
    else {
      values[valueIndex] = $value;
    }
    targetConcat = Array.prototype.concat.call(targetConcat, values[valueIndex]);
    if(events) {
      const contentEventPath = (path)
        ? [path, valueIndex].join('.')
        : String(valueIndex);
      if(events['concatValue']) {
        $content.dispatchEvent(
          new ContentEvent('concatValue', {
            path: contentEventPath,
            value: values[valueIndex],
            detail: {
              valueIndex,
              value: values[valueIndex],
            },
          }, $content)
        );
      }
      if(events['concatValue:$index']) {
        const type = ['concatValue', ':', valueIndex].join('');
        $content.dispatchEvent(
          new ContentEvent('concatValue', {
            path: contentEventPath,
            value: values[valueIndex],
            detail: {
              valueIndex,
              value: values[valueIndex],
            },
          }, $content)
        );
      }
    }
    valueIndex++;
  }
  content = new Content(targetConcat, schema, $content.options);
  if(events && events['concat']) {
    $content.dispatchEvent(
      new ContentEvent('concat', {
        path,
        detail: {
          values: content,
        },
      }, $content)
    );
  }
  return content
}

function copyWithin($content, $options) {
  const { target, path } = $content;
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
    // Array Copy Within Index Event Data
    if(events) {
      const contentEventPath = (path)
        ? [path, copyIndex].join('.')
        : String(copyIndex);
      if(events['copyWithinIndex']) {
        $content.dispatchEvent(
          new ContentEvent(
            'copyWithinIndex',
            {
              path: contentEventPath,
              value: copyItem,
              detail: {
                target: targetIndex,
                start: copyIndex,
                end: copyIndex + 1,
                item: copyItem,
              },
            },
            $content
          )
        );
      }
      if(events['copyWithinIndex:$index']) {
        const type  = ['copyWithinIndex', ':', copyIndex].join('');
        $content.dispatchEvent(
          new ContentEvent(
            type,
            {
              path: contentEventPath,
              value: copyItem,
              detail: {
                target: targetIndex,
                start: copyIndex,
                end: copyIndex + 1,
                item: copyItem,
              },
            },
            $content
          )
        );
      }
    }
    copyIndex++;
    targetIndex++;
  }
  // Array Copy Within Event
  if(events && events['copyWithin']) {
    $content.dispatchEvent(
      new ContentEvent(
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
        $content
      )
    );
  }
  return $content
}

function fill($content, $options) {
  const { target, path, schema } = $content;
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
          $content.dispatchEvent(new ValidatorEvent($eventType, validValue, $content));
        }
      }
      if(!validValue.valid) { continue iterateFillIndexes }
    }
    const contentPath = (path)
      ? [path, fillIndex].join('.')
      : String(fillIndex);
    let value = $arguments[0];
    if(typeof value === 'object') {
      if(value instanceof Content) { value = value.valueOf(); }
      const subschema = schema?.context[0] || null;
      value = new Content(value, subschema, {
        path: contentPath,
        parent: $content,
      });
    }
    Array.prototype.fill.call(
      target, value, fillIndex, fillIndex + 1
    );
    // Array Fill Index Event
    if(events) {
      const contentEventPath = (path)
        ? [path, fillIndex].join('.')
        : String(fillIndex);
      if(events['fillIndex']) {
        $content.dispatchEvent(
          new ContentEvent('fillIndex', {
            path: contentEventPath, 
            value: value,
            detail: {
              start: fillIndex,
              end: fillIndex + 1,
              value,
            },
          }, $content)
        );
      }
      if(events['fillIndex:$index']) {
        const type = ['fillIndex', ':', fillIndex].join('');
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath, 
            detail: {
              start: fillIndex,
              end: fillIndex + 1,
              value,
            },
          }, $content)
        );
      }
    }
    fillIndex++;
  }
  // Array Fill Event
  if(events && events['fill']) {
    $content.dispatchEvent(
      new ContentEvent('fill', {
        path,
        detail: {
          start: $start,
          end: $end,
          value,
        },
      },
      $content)
    );
  }
  return $content
}

function pop($content, $options) {
  const { events } = $options;
  const { target, path } = $content;
  const popElement = Array.prototype.pop.call(target);
  const popElementIndex = target.length - 1;
  // Array Pop Event
  if(events && events['pop']) {
    const contentEventPath = (path)
      ? [path, popElementIndex].join('.')
      : String(popElementIndex);
    $content.dispatchEvent(
      new ContentEvent(
        'pop',
        {
          path: contentEventPath,
          value: popElement,
          detail: {
            elementIndex: popElementIndex,
            element: popElement,
          },
        },
        $content
      )
    );
  }
  return popElement
}

function push($content, $options, ...$elements) {
  const { events } = $options;
  const { target, path, schema } = $content;
  const { enableValidation, validationEvents } = $content.options;
  const elements = [];
  let elementsIndex = 0;
  iterateElements:
  for(let $element of $elements) {
    // Validation
    if(schema && enableValidation) {
      const validElement = schema.validateProperty(elementsIndex, $element, {}, $content);
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
          $content.dispatchEvent(new ValidatorEvent($eventType, validElement, $content));
        }
      }
      if(!validElement.valid) { return target.length }
    }
    const contentPath = (path)
      ? [path, elementsIndex].join('.')
      : String(elementsIndex);
    if(typeof $element === 'object') {
      if($element instanceof Content) { $element = $element.valueOf(); }
      const subschema = schema?.context[0] || null;
      $element = new Content($element, subschema, {
        path: contentPath,
        parent: $content,
      });
      elements.push($element);
      Array.prototype.push.call(target, $element);
    } else {
      elements.push($element);
      Array.prototype.push.call(target, $element);
    }
    if(events) {
      const contentEventPath = (path)
        ? [path, '.', elementsIndex].join('')
        : String(elementsIndex);
      if(events['pushProp']) {
        $content.dispatchEvent(
          new ContentEvent('pushProp', {
            path: contentEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $content)
        );
      }
      if(events['pushProp:$index']) {
        const type = ['pushProp', ':', elementsIndex].join('');
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath,
            value: elements[elementsIndex],
            detail: {
              elementsIndex,
              element: elements[elementsIndex],
            },
          }, $content)
        );
      }
    }
    elementsIndex++;
  }
  // Push Event
  if(events && events['push']) {
    $content.dispatchEvent(
      new ContentEvent('push', {
        path,
        detail: {
          elements,
        },
      }, $content)
    );
  }
  return target.length
}

function reverse($content, $options) {
  const { events } = $options;
  const { target, path } = $content;
  Array.prototype.reverse.call(target, ...arguments);
  if(events && events['reverse']) {
    $content.dispatchEvent(
      new ContentEvent(
        'reverse',
        {
          path,
          detail: {
            reference: target
          },
        },
        $content
      )
    );
  }
  return $content
}

function shift($content, $options) {
  const { events } = $options;
  const { target, path } = $content;
  const shiftElement = Array.prototype.shift.call(target);
  const shiftElementIndex = 0;
  // Array Shift Event
  if(events && events['shift']) {
    const contentEventPath = (path)
      ? [path, shiftElementIndex].join('.')
      : String(shiftElementIndex);
    $content.dispatchEvent(
      new ContentEvent(
        'shift',
        {
          path: contentEventPath,
          value: shiftElement,
          detail: {
            elementIndex: shiftElementIndex,
            element: shiftElement,
          },
        },
        $content
      )
    );
  }
  return shiftElement
}

function splice($content, $options) {
  const { events } = $options;
  const { target, path, schema } = $content;
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
    deleteItems.push(deleteItem);
    // Array Splice Delete Event
    if(events) {
      const contentEventPath = (path)
        ? [path, deleteItemsIndex].join('.')
        : String(deleteItemsIndex);
      if(events['spliceDelete']) {
        $content.dispatchEvent(
          new ContentEvent('spliceDelete', {
            path: contentEventPath,
            value: deleteItem,
            detail: {
              index: $start + deleteItemsIndex,
              deleteIndex: deleteItemsIndex,
              deleteItem: deleteItem,
            },
          }, $content)
        );
      }
      if(events['spliceDelete:$index']) {
        const type = ['spliceDelete', ':', deleteItemsIndex].join('');
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath,
            value: deleteItem,
            detail: {
              index: $start + deleteItemsIndex,
              deleteIndex: deleteItemsIndex,
              deleteItem: deleteItem,
            },
          }, $content)
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
      const validAddItem = schema.validateProperty(elementIndex, element, {}, $content);
      if(validationEvents) {
        let type, propertyType;
        const validatorEventPath = (path)
          ? [path, addItemsIndex].join('.')
          : String(addItemsIndex);
        if(validAddItem.valid) {
          type = 'validProperty';
          propertyType = ['validProperty', ':', addItemsIndex].join('');
        }
        else {
          type = 'nonvalidProperty';
          propertyType = ['nonvalidProperty', ':', addItemsIndex].join('');
        }
        for(const $eventType of [type, propertyType]) {
          $content.dispatchEvent(new ValidatorEvent($eventType, validAddItem, $content));
        }
      }
      if(!validAddItem.valid) { addItemsIndex++; continue spliceAdd }
    }
    const contentPath = (path)
      ? [path, addItemsIndex].join('.')
      : String(addItemsIndex);
    let startIndex = $start + addItemsIndex;
    // Add Item: Object Type
    if(typeof addItem === 'object') {
      if(addItem instanceof Content) { addItem = addItem.valueOf(); }
      const subschema = schema?.context[0] || null;
      addItem = new Content(addItem, subschema, {
        path: contentPath,
        parent: $content,
      });
      Array.prototype.splice.call(
        target, startIndex, 0, addItem
      );
    }
    // Add Item: Primitive Type
    else {
      Array.prototype.splice.call(
        target, startIndex, 0, addItem
      );
    }
    // Array Splice Add Event
    if(events) {
      const contentEventPath = (path)
        ? [path, addItemsIndex].join('.')
        : String(addItemsIndex);
      if(events['spliceAdd']) {
        $content.dispatchEvent(
          new ContentEvent('spliceAdd', {
            path: contentEventPath,
            value: addItem,
            detail: {
              index: $start + addItemsIndex,
              addIndex: addItemsIndex,
              addItem: addItem,
            },
          }, $content)
        );
      }
      if(events['spliceAdd:$index']) {
        const type = ['spliceAdd', ':', addItemsIndex].join('');
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath,
            value: addItem,
            detail: {
              index: $start + addItemsIndex,
              addIndex: addItemsIndex,
              addItem: addItem,
            },
          }, $content)
        );
      }
    }
    addItemsIndex++;
  }
  // Array Splice Event
  if(events && events['splice']) {
    $content.dispatchEvent(
      new ContentEvent('splice', {
        path,
        detail: {
          $start,
          deleted: deleteItems,
          added: $addItems,
          length: target.length,
        },
      },
      $content)
    );
  }
  return deleteItems
}

function unshift($content, $options, ...$elements) {
  const { events } = $options;
  const { target, path, schema } = $content;
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
    const targetElementIsContentInstance = (
      targetElement instanceof Content
    ) ? true : false;
    // Validation
    if(schema && enableValidation) {
      const validElement = schema.validateProperty(elementIndex, $element, {}, $content);
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
        for(const $eventType of [type, propertyType]) {
          $content.dispatchEvent(new ValidatorEvent$1($eventType, validElement, $content));
        }
      }
      if(!validElement.valid) { return $content.length }
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
      const contentPath = (path)
        ? path.concat('.', elementCoindex)
        : String(elementCoindex);
      element = new Content($element, subschema, {
        path: contentPath,
        parent: $content,
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
    // change.conter = (targetElementIsContentInstance)
    //   ? (targetElement.toString() !== JSON.stringify(element))
    //   : (JSON.stringify(targetElement) !== JSON.stringify(element))
    // Array Unshift Prop Event
    if(events) {
      const type = ['unshiftProp', elementCoindex].join(':');
      const contentEventPath = (path)
        ? [path, elementCoindex].join('.')
        : String(elementCoindex);
      if(events['unshiftProp']) {
        $content.dispatchEvent(
          new ContentEvent('unshiftProp', {
            path: contentEventPath,
            value: element,
            // change,
            detail: {
              elementIndex: elementCoindex, 
              element: element,
            },
          }, $content)
        );
      }
      if(events['unshiftProp:$index']) {
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath,
            value: element,
            // change,
            detail: {
              elementIndex: elementCoindex, 
              element: element,
            },
          }, $content)
        );
      }

    }
    elementIndex--;
    elementCoindex++;
  }
  // Array Unshift Event
  if(events && events['unshift'] && elements.length) {
    $content.dispatchEvent(
      new ContentEvent('unshift', {
        path,
        detail: {
          elements,
        },
      },
      $content)
    );
  }
  return $content.length
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

function getContent($content, $options) {
  // Get Property Event
  const { path } = $content;
  const { events } = $options;
  if(events && events['get']) {
    $content.dispatchEvent(
      new ContentEvent('get', {
        path,
        value: $content.valueOf(),
        detail: {
          value: $content.valueOf()
        }
      }, $content)
    );
  }
  return $content
}

const { regularExpressions: regularExpressions$2} = index;
function getContentProperty($content, $options, $path) {
  const { target, path } = $content;
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
        $content.dispatchEvent(
          new ContentEvent('getProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $content)
        );
      }
      if(events['getProperty:$key']) {
        const type = ['getProperty', ':', propertyKey].join('');
        const _path = [path, '.', propertyKey].join('');
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: _path,
            detail: {
              value: propertyValue,
            }
          }, $content)
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
function getProperty($content, $options, ...$arguments) {
  let getProperty;
  const options = recursiveAssign$3({}, $content.options, $options);
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { recursiveAssign$3(options, $arguments[1]); }
    getProperty = getContentProperty($content, options, ...$arguments);
  }
  else {
    if($arguments.length === 1) { recursiveAssign$3(options, $arguments[0]); }
    getProperty = getContent($content, options, ...$arguments);
  }
  return getProperty
}

function setContent($content, $options, $properties) {
  iterateProperties: 
  for(const [$propertyKey, $propertyValue] of Object.entries($properties)) {
    $content.set($propertyKey, $propertyValue, $options);
  }
  // Set Property Event
  const { path } = $content;
  const { events } = $options;
  if(events && events['set']) {
    $content.dispatchEvent(
      new ContentEvent('set', {
        path,
        value: $content.valueOf(),
        detail: {
          value: $content.valueOf()
        }
      }, $content)
    );
  }
  return $content
}

const { recursiveAssign: recursiveAssign$2, regularExpressions: regularExpressions$1} = index;
function setContentProperty($content, $options, $path, $value) {
  const { target, path, schema } = $content;
  const { enableValidation, validationEvents, events, pathkey, subpathError, recursive, source } = $options;
  // Path Key: true
  if(pathkey === true) {
    // Subpaths
    const subpaths = $path.split(new RegExp(regularExpressions$1.quotationEscape));
    // Property Key
    const propertyKey = subpaths.shift();
    // Property Value
    let propertyValue;
    const contentPath = (path)
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
        // Subcontent
        let subcontent;
        if(subschema?.type === 'array') { subcontent = []; }
        else if(subschema?.type === 'object') { subcontent = {}; }
        else {
          if(Number(propertyKey)) { subcontent = []; }
          else { subcontent = {}; }
        }
        propertyValue = new Content(subcontent, subschema, recursiveAssign$2({}, $options, {
          path: contentPath,
          parent: $content,
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
      const validTargetProp = schema.validateProperty(propertyKey, $value, source, $content);
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
          $content.dispatchEvent(new ValidatorEvent$1($eventType, validTargetProp, $content));
        }
      }
      if(!validTargetProp.valid) { return }
    }
    // Return: Property
    // Value: Object Literal
    if(typeof $value === 'object') {
      // Value: Content
      if($value instanceof Content) { $value = $value.valueOf(); }
      let subschema;
      if(schema?.type === 'array') { subschema = schema.context[0]; }
      else if(schema?.type === 'object') { subschema = schema.context[propertyKey]; }
      else { subschema = undefined; }
      propertyValue = new Content($value, subschema, recursiveAssign$2(
        {}, $options, {
          path: contentPath,
          parent: $content,
        }
      ));
    }
    // Value: Primitive Literal
    else {
      propertyValue = $value;
    }
    // Root Assignment
    target[propertyKey] = propertyValue;
    // Set Property Event
    if(events) {
      const contentEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey);
      if(events['setProperty']) {
        $content.dispatchEvent(
          new ContentEvent('setProperty', {
            path: contentEventPath, 
            value: propertyValue,
            // change,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $content)
        );
      }
      if(events['setProperty:$key']) {
        const type = ['setProperty', ':', propertyKey].join('');
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath, 
            value: propertyValue,
            // change,
            detail: {
              value: propertyValue,
            }
          }, $content)
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
      if($value instanceof Content) { $value = $value.valueOf(); }
      let subschema;
      if(schema?.type === 'array') { subschema = schema.context[0]; }
      if(schema?.type === 'object') { subschema = schema.context[propertyKey]; }
      else { subschema = undefined; }
      const contentPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey);
      propertyValue = new Content($value, subschema, recursiveAssign$2(
        {}, $options, {
          path: contentPath,
          parent: $content,
        }
      ));
    }
    // Property Value: Primitive Literal
    else { propertyValue = $value; }
    // Root Assignment
    target[propertyKey] = propertyValue;
    // Set Property Event
    if(events) {
      const contentEventPath = (path)
        ? [path, propertyKey].join('.')
        : String(propertyKey);
      if(events['setProperty']) {
        $content.dispatchEvent(
          new ContentEvent('setProperty', {
            path: contentEventPath, 
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $content)
        );
      }
      if(events['setProperty:$key']) {
        const type = ['setProperty', ':', propertyKey].join('');
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: contentEventPath, 
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $content)
        );
      }
    }
    // Return Property Value
    return propertyValue
  }
}

const { recursiveAssign: recursiveAssign$1 } = index;
function setProperty($content, $options, ...$arguments) {
  let setProperty;
  const options = recursiveAssign$1({}, $content.options, $options);
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 3) { recursiveAssign$1(options, $arguments[2]); }
    setProperty = setContentProperty($content, options, ...$arguments);
  }
  else {
    if($arguments.length === 2) { recursiveAssign$1(options, $arguments[1]); }
    setProperty = setContent($content, options, ...$arguments);
  }
  return setProperty
}

function deleteContent($content, $options) {
  const { target } = $content;
  for(const [$targetPropertyKey, $targetPropertyValue] of Object.entries(target)) {
    $content.delete($targetPropertyKey, $options);
  }
  // Delete Property Event
  const { path } = $content;
  const { events } = $options;
  if(events && events['delete']) {
    $content.dispatchEvent(
      new ContentEvent('delete', {
        path,
        detail: {
          value: $content.valueOf()
        }
      }, $content)
    );
  }
  return $content
}

const { regularExpressions} = index;
function deleteContentProperty($content, $options, $path) {
  const { target, path, schema } = $content;
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
      const differedPropertyProxy = $content.valueOf();
      delete differedPropertyProxy[propertyKey];
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, {}, $content);
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
          $content.dispatchEvent(
            new ValidatorEvent($eventType, Object.assign(validTargetProp, {
              path: validatorEventPath
            }), $content)
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
        $content.dispatchEvent(
          new ContentEvent('deleteProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $content)
        );
      }
      if(events['deleteProperty:$key']) {
        const type = ['deleteProperty', ':', propertyKey].join('');
        const _path = [path, '.', propertyKey].join('');
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: _path,
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $content)
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
      const differedPropertyProxy = $content.valueOf();
      delete differedPropertyProxy[propertyKey];
      const validTargetProp = schema.validate(propertyKey, differedPropertyProxy, $content, $content);
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
          $content.dispatchEvent(
            new ValidatorEvent($eventType, validTargetProp, $content)
          );
        }
      }
      if(!validTargetProp.valid) { return }
    }
  
    if(propertyValue instanceof Content) {
      propertyValue.delete($options);
    }
    delete target[propertyKey];
    // Delete Property Event
    if(events) {
      if(events['deleteProperty']) {
        $content.dispatchEvent(
          new ContentEvent('deleteProperty', {
            path,
            value: propertyValue,
            detail: {
              key: propertyKey,
              value: propertyValue,
            }
          }, $content)
        );
      }
      if(events['deleteProperty:$key']) {
        const type = ['deleteProperty', ':', propertyKey].join('');
        const _path = [path, '.', propertyKey].join('');
        $content.dispatchEvent(
          new ContentEvent(type, {
            path: _path,
            value: propertyValue,
            detail: {
              value: propertyValue,
            }
          }, $content)
        );
      }
    }
    return undefined
  }
}

const { recursiveAssign } = index;
function deleteProperty($content, $options, ...$arguments) {
  let deleteProperty;
  const options = recursiveAssign({}, $content.options, $options);
  if(typeof $arguments[0] === 'string') {
    if($arguments.length === 2) { recursiveAssign(options, $arguments[1]); }
    deleteProperty = deleteContentProperty($content, options, ...$arguments);
  }
  else {
    if($arguments.length === 1) { recursiveAssign(options, $arguments[0]); }
    deleteProperty = deleteContent($content, options, ...$arguments);
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
    createMethod: function($methodName, $content) {
      return function valueOf() { return $content.parse({ type: 'object' }) }
    },
  }, {
    keys: ['toString'],
    createMethod: function($methodName, $content) {
      return function toString($parseSettings = {}) {
        const replacer = ($parseSettings.replacer !== undefined)
          ? $parseSettings.replacer : null;
        const space = ($parseSettings.space !== undefined)
          ? $parseSettings.space : 0;
        return $content.parse({ type: 'string', replacer, space })
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
    createMethod: function($methodName, $content) {
      return Object[$methodName].bind(null, $content.valueOf())
    },
  }, {
    keys: ['propertyIsEnumerable', 'hasOwnProperty'], 
    createMethod: function($methodName, $content) {
      return () => $content.parse({ type: 'object' })[$methodName]
    },
  }, {
    type: 'mutators',
    keys: Object.keys(ObjectProperty), 
    createMethod: function($methodName, $content, $options) {
      return ObjectProperty[$methodName].bind(null, $content, $options) 
    }
  }],
  array: [{
    keys: [
      'from', 'fromAsync', 'isArray', 'of', 
    ], 
    createMethod: function($methodName, $content) {
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
    createMethod: function($methodName, $content) {
      return Array.prototype[$methodName].bind(null, $content)
    }
  }, {
    type: 'mutators',
    keys: Object.keys(ArrayProperty), 
    createMethod: function($methodName, $content, $options) {
      return ArrayProperty[$methodName].bind(null, $content, $options)
    }
  }],
  accessor: [{
    type: 'mutators',
    keys: Object.keys(AccessorProperty),
    createMethod: function($methodName, $content, $options) {
      return AccessorProperty[$methodName].bind(null, $content, $options)
    }
  }]
});
function Methods($content) {
  iterateDefaultPropertyClasses: // Object, Array, Accessor
  for(const [$propertyClassName, $propertyClasses] of Object.entries(Defaults)) {
    iteratePropertyClasses: 
    for(const $propertyClass of $propertyClasses) {
      const { keys, createMethod, type } = $propertyClass;
      for(const $methodName of keys) {
        if($propertyClassName === 'accessor' || type === 'mutators') {
          const methodOptions = $content.options?.methods[$propertyClassName][$methodName] || {};
          Object.defineProperty($content, $methodName, {
            enumerable: false, writable: false, configurable: false, 
            value: createMethod($methodName, $content, methodOptions),
          });
        }
        else {
          Object.defineProperty($content, $methodName, {
            enumerable: false, writable: false, configurable: false, 
            value: createMethod($methodName,  $content),
          });
        }
      }
    }
  }
  return $content
}

const { typedObjectLiteral, typeOf } = index;

class Content extends EventTarget {
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
    super();
    this.#properties = $properties;
    this.#options = Options($options);
    this.schema = $schema;
    Methods(this);
    const { contentAssignmentMethod } = this.options;
    this[contentAssignmentMethod](this.#properties);
  }
  get #properties() { return this.#_properties }
  set #properties($properties) {
    if(this.#_properties !== undefined) return
    if($properties instanceof Content) {
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
    else if(
      $schema instanceof Schema
    ) { this.#schema = $schema; }
    else if(typeOfSchema === 'array') { this.#schema = new Schema(...arguments); }
    else if(typeOfSchema === 'object') { this.#schema = new Schema($schema); }
  }
  get classToString() { return Content.toString() }
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
      if($propertyDescriptor.value instanceof Content) {
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

export { Content, Schema };
//# sourceMappingURL=objecture.js.map
