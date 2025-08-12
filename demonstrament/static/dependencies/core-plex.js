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
function expand$1(pattern) {
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
                    alternatives.push(expand$1(span));
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
            alternatives.push(expand$1(span));
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
        patterns = flatMap(patterns, expand$1);
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

function splitPath($path, $pathParseInteger) {
  const subpathDelimiters = /([a-zA-Z_][a-zA-Z0-9_]*)|(\d+)|\["([^"]*)"\]|"([^"]*)"|\./g;
  const subpaths = [];
  let match;
  while((match = subpathDelimiters.exec($path)) !== null) {
    if(match[1]) { subpaths.push(match[1]); }
    else if(match[2]) {
      if($pathParseInteger) { subpaths.push(parseInt(match[2], 10)); }
      else { subpaths.push(match[2]); }
    }
    else if(match[3]) { subpaths.push(match[3]); }
    else if(match[4]) { subpaths.push(match[4]); }
  }
  return subpaths
}

var typeOf = ($operand) => Object
  .prototype
  .toString
  .call($operand).slice(8, -1).toLowerCase();

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
  'eventtarget': EventTarget,
  'map': Map,
  // 'set': Set, 
};
const ObjectKeys = Object.keys(Objects);
Object.values(Objects);
const Types = Object.assign({}, Primitives, Objects);
Object.values(Types);
[
 Primitives.String, Primitives.Number, Primitives.Boolean, 
 Objects.Object, Objects.Array
];

// Object Type Validator
const TypeValidator$1 = ($target) => (
    !($target instanceof Map) &&
    ['array', 'object'].includes(typeof $target)
  );
// Object Getter
function Getter$1(...$arguments) {
  if($arguments.length === 1) {
    const [$target] = $arguments;
    return $target
  }
  else {
    const [$target, $property] = $arguments;
    return $target[$property]
  }
}
// Object Setter
function Setter$1(...$arguments) {
  if(['string', 'number'].includes(typeOf($arguments[1]))) {
    const [$target, $property, $value] = $arguments;
    $target[$property] = $value;
    return $target[$property]
  }
  else {
    const [$target, $source] = $arguments;
    for(const $targetKey of Object.keys($target)) {
      delete $target[$targetKey];
    }
    for(const [$sourceKey, $sourceValue] of Object.entries($source)) {
      $target[$sourceKey] = $sourceValue;
    }
    return $target
  }
}
// Object Deleter
function Deleter$1(...$arguments) {
  const [$target, $property] = $arguments;
  if(['string', 'number'].includes(typeOf($property))) {
    return delete $target[$property]
  }
  else {
    for(const $targetKey of Object.keys($target)) {
      delete $target[$targetKey];
    }
    return undefined
  }
}

// Map Type Validator
const TypeValidator = ($target) => ($target instanceof Map);
// Map Getter
function Getter(...$arguments) {
  if($arguments.length === 1) {
    let [$receiver] = $arguments;
    return $receiver
  }
  else {
    let [$receiver, $property] = $arguments;
    return $receiver.get($property)
  }
}
// Map Setter
function Setter(...$arguments) {
  if($arguments.length === 2) {
    let [$receiver, $source] = $arguments;
    $receiver.clear();
    const sourceEntries = (typeOf($source) === 'map')
      ? $source.entries()
      : Object.entries($source);
    for(const [$sourceKey, $sourceValue] of sourceEntries) {
      $receiver.set($sourceKey, $sourceValue);
    }
    return $receiver
  }
  else {
    let [$receiver, $property, $value] = $arguments;
    $receiver.set($property, $value);
    return $receiver.get($property)
  }
}
// Map Deleter
function Deleter(...$arguments) {
  if($arguments.length === 2) {
    let [$receiver, $property] = $arguments;
    return $receiver.delete($property)
  }
  else {
    let [$receiver] = $arguments;
    return $receiver.clear()
  } 
}

// import * as SetTensors from './set/index.js'
const Getters = {
  Object: Getter$1, 
  Map: Getter, 
  // Set: SetTensors.Getter, 
};
const Setters = {
  Object: Setter$1, 
  Map: Setter, 
  // Set: SetTensors.Setter, 
};
const Deleters = {
  Object: Deleter$1, 
  Map: Deleter, 
  // Set: SetTensors.Deleter, 
};
const TypeValidators = {
  Object: TypeValidator$1, 
  Map: TypeValidator, 
  // Set: SetTensors.TypeValidator, 
};
class Tensors extends EventTarget {
  constructor($tensors, $typeValidators) {
    super();
    Object.defineProperties(this, {
      'cess': { value: function(...$arguments) {
        const [$target] = $arguments;
        let tensorIndex = 0;
        for(const $typeValidator of $typeValidators) {
          if($typeValidator($target)) {
            return $tensors[tensorIndex](...$arguments)
          }
          tensorIndex++;
          if(tensorIndex === $typeValidators.length) {
            throw new Error(null)
          }
        }
      } },
    });
  }
}

function getOwnPropertyDescriptors($source, $options = {}) {
  const options = Object.assign({}, $options);
  const propertyDescriptors = {};
  const typeOfSource = typeOf($source);
  const propertyDescriptorKeys = (['array', 'object'].includes(typeOfSource))
    ? Object.keys(Object.getOwnPropertyDescriptors($source))
    : (typeOfSource == 'map')
    ? Array.from($source.keys())
    : [];
  for(const $propertyKey of propertyDescriptorKeys) {
    const propertyDescriptor = getOwnPropertyDescriptor($source, $propertyKey, options);
    if(propertyDescriptor) {
      propertyDescriptors[$propertyKey] = propertyDescriptor;
    }
  }
  return propertyDescriptors
}

const Options$e = {
  getters: [Getters.Object, Getters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map],
  delimiter: '.',
  depth: 0,
  enumerable: true,
  frozen: false,
  maxDepth: 10,
  nonenumerable: false,
  path: false,
  pathMatch: false,
  recurse: true,
  returnValue: 'receiver',
  sealed: false,
  type: false,
};
function getOwnPropertyDescriptor($source, $propertyKey, $options = {}) {
  const options = Object.assign({}, Options$e, $options, {
    ancestors: Object.assign([], $options.ancestors),
  });
  if(options.depth >= options.maxDepth) { return }
  else { options.depth++; }
  if(!options.ancestors.includes($source)) { options.ancestors.unshift($source); }
  const getters = new Tensors(options.getters, options.typeValidators);
  const propertyValue = getters.cess($source, $propertyKey);
  if(propertyValue !== undefined) {
    if(ObjectKeys.includes(typeOf(propertyValue))) {
      if(options.ancestors.includes(propertyValue)) { return }
      else { options.ancestors.unshift(propertyValue); }
    }
    const typeOfSource = typeOf($source);
    const propertyDescriptor = (typeOfSource !== 'map')
      ? Object.getOwnPropertyDescriptor($source, $propertyKey)
      : (typeOfSource === 'map')
      ? { configurable: false, enumerable: true, value: propertyValue[1], writable: true }
      : undefined;
    if(!propertyDescriptor) return undefined
    if(!options.nonenumerable && !propertyDescriptor.enumerable) { return }
    if(options.path) {
      options.path = (
        typeOf(options.path) === 'string'
      ) ? [options.path, $propertyKey].join(options.delimiter) : $propertyKey;
      propertyDescriptor.path = options.path;
    }
    if(options.type) { propertyDescriptor.type = typeOf(propertyValue); }
    if(options.frozen) { propertyDescriptor.frozen = Object.isFrozen(propertyValue); }
    if(options.sealed) { propertyDescriptor.sealed = Object.isSealed(propertyValue); }
    if(options.recurse && ObjectKeys.includes(typeOf(propertyValue))) {
      propertyDescriptor.value = getOwnPropertyDescriptors(propertyValue, options);
    }
    else {
      propertyDescriptor.value = propertyValue;
    }
    return propertyDescriptor
  }
}

const Options$d = {
  pathParseInteger: false,
  getters: [Getters.Object, Getters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map],
  ancestors: [],
  depth: 0, maxDepth: 10,
  enumerable: true, nonenumerable: false,
  recurse: true,
};
function entities($source, $type, $options = {}) {
  const sourceEntities = [];
  const options = Object.assign({}, Options$d, $options, {
    ancestors: Object.assign([], $options.ancestors)
  });
  const { ancestors, maxDepth, enumerable, nonenumerable, recurse } = options;
  if(options.depth >= maxDepth) { return sourceEntities }
  if(!ancestors.includes($source)) { ancestors.unshift($source); }
  options.depth++;
  const getters = new Tensors(options.getters, options.typeValidators);
  const source = getters.cess($source);
  if(!source) { return sourceEntities }
  // NONENUMERABLE
  const propertyDescriptorKeys = (typeOf(source) === 'map')
    ? source.keys()
    : (nonenumerable) 
    ? Object.keys(Object.getOwnPropertyDescriptors(source))
    : Object.keys(source);
    // : Object.keys(Object.getOwnPropertyDescriptors(source))
  iterateSourcePropertyDescriptors: 
  for(let $propertyKey of propertyDescriptorKeys) {
    if(!isNaN($propertyKey) && options.pathParseInteger) {
      $propertyKey = parseInt($propertyKey, 10);
    }
    const value = getters.cess($source, $propertyKey);
    const propertyDescriptor = getOwnPropertyDescriptor(
      $source, $propertyKey, Object.assign(
        {}, options, { recurse: false }
    ));
    if(!propertyDescriptor) { continue iterateSourcePropertyDescriptors }
    if(
      (enumerable && propertyDescriptor.enumerable) ||
      (nonenumerable && !propertyDescriptor.enumerable)
    ) {
      const typeOfValue = typeOf(value);
      if(
        recurse && 
        ObjectKeys.includes(typeOfValue) && 
        !ancestors.includes(value)
      ) {
        ancestors.unshift(value);
        const subentities = entities(value, $type, options);
        if(subentities.length) {
          if($type === 'entries') { sourceEntities.push([$propertyKey, subentities]); }
          else if($type === 'values') { sourceEntities.push(subentities); }
          else if($type === 'keys') { sourceEntities.push($propertyKey, subentities); }
        }
        else {
          if($type === 'entries') { sourceEntities.push([$propertyKey, value]); }
          else if($type === 'values') { sourceEntities.push(value); }
          else if($type === 'keys') { sourceEntities.push($propertyKey); }
        }
      }
      else {
        if($type === 'entries') { sourceEntities.push([$propertyKey, value]); }
        else if($type === 'values') { sourceEntities.push(value); }
        else if($type === 'keys') { sourceEntities.push($propertyKey); }
      }
    }
  }
  return sourceEntities
}

const Options$c = {
  depth: 0, 
  getters: [Getters.Object, Getters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map],
  maxDepth: 10,
  values: false,
  returnValue: 'receiver',
};
function compand($source, $options = {}) {
  const compandEntries = [];
  const options = Object.assign({}, Options$c, $options, {
    ancestors: Object.assign([], $options.ancestors)
  });
  const { ancestors, values } = options;
  options.depth++;
  if(options.depth > options.maxDepth) { return compandEntries }
  const source = new Tensors(options.getters, options.typeValidators).cess($source);
  if(!ancestors.includes($source)) { ancestors.unshift($source); }
  const sourceEntries = entities($source, 'entries', Object.assign({}, options, {
    recurse: false
  }));
  for(const [$key, $value] of sourceEntries) {
    if(!values) { compandEntries.push($key); }
    else if(values) { compandEntries.push([$key, $value]); }
    if(
      typeof $value === 'object' &&
      $value !== null &&
      !Object.is($value, source) && 
      !ancestors.includes($value)
    ) {
      const subsources = compand($value, options);
      if(!values) {
        for(const $subsource of subsources) {
          const path = [$key, $subsource].join('.');
          compandEntries.push(path);
        }
      }
      else if(values) {
        for(const [$subsourceKey, $subsource] of subsources) {
          const path = [$key, $subsourceKey].join('.');
          compandEntries.push([path, $subsource]);
        }
      }
    }
  }
  return compandEntries
}

const Options$b = {
  pathMatch: false,
  pathMatchMaxResults: 1000,
  pathParseInteger: false,
  getters: [Getters.Object, Getters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map],
};
function getProperty() {
  const [$target, $path, $options] = [...arguments];
  const options = Object.assign ({}, Options$b, $options);
  const getters = new Tensors(options.getters, options.typeValidators);
  if($path === undefined) { return getters.cess($target, options) }
  const subpaths = splitPath($path, options.pathParseInteger);
  if(!options.pathMatch) {
    let subtarget = $target;
    iterateSubpaths: 
    for(const $subpath of subpaths) {
      try {
        subtarget = getters.cess(subtarget, $subpath);
        if(subtarget === undefined) { break iterateSubpaths } 
      }
      catch($err) { break iterateSubpaths }
    }
    return subtarget
  }
  else {
    const subtargets = [];
    const compandEntries = compand($target, Object.assign({}, options, { values: true }));
    const propertyPathMatcher = outmatch($path, { separator: '.' });
    for(const [$propertyPath, $propertyValue] of compandEntries) {
      const propertyPathMatch = propertyPathMatcher($propertyPath, );
      if(propertyPathMatch === true) { subtargets.push([$propertyPath, $propertyValue]); }
    }
    return subtargets
  }
}

({
  getters: [Getters.Object, Getters.Map], 
  setters: [Setters.Object, Setters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map],
});

({
  deleters: [Deleters.Object, Deleters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map],
});

({
  getters: [Getters.Object, Getters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map]});

({
  setters: [Setters.Object, Setters.Map],
});

const Options$4 = {
  getters: [Getters.Object, Getters.Map],
  setters: [Setters.Object, Setters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map],
};
function assignSources($target, $type, ...$sources) {
  if(!$target) { return $target}
  const options = Object.assign({}, Options$4);
  const getters = new Tensors(options.getters, options.typeValidators);
  const setters = new Tensors(options.setters, options.typeValidators);
  typeOf($target);
  iterateSources: 
  for(const $source of $sources) {
    if(!ObjectKeys.includes(typeOf($source))) continue iterateSources
    const sourceEntries = entities($source, 'entries', { recurse: false, });
    for(const [$sourcePropertyKey, $sourcePropertyValue] of sourceEntries) {
      const targetPropertyValue = getters.cess($target, $sourcePropertyKey);
      const typeOfTargetPropertyValue = typeOf(targetPropertyValue);
      const typeOfSourcePropertyValue = typeOf($sourcePropertyValue);
      if(
        ObjectKeys.includes(typeOfSourcePropertyValue) &&
        ObjectKeys.includes(typeOfTargetPropertyValue)
      ) {
        // setters.cess($target, $sourcePropertyKey, assignSources(
        //   targetPropertyValue, $type, $sourcePropertyValue
        // ))
        assignSources(targetPropertyValue, $type, $sourcePropertyValue);
      }
      else {
        setters.cess($target, $sourcePropertyKey, $sourcePropertyValue);
      }
    }
  }
  return $target
}

var assign = ($target, ...$sources) => assignSources($target, 'assign', ...$sources);

({
  getters: [Getters.Object, Getters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map]});

({
  getters: [Getters.Object, Getters.Map],
  typeValidators: [TypeValidators.Object, TypeValidators.Map]});

({
  getters: [Getters.Object, Getters.Map]});

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

var Settings$1 = ($settings = {}) => {
  const Settings = {
    events: {},
    enableEvents: false,
    compand: {
      scopeKey: ':scope', 
      maxDepth: 10,
    },
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
      case 'compand':
        Settings[$settingKey] = Object.assign(Settings[$settingKey], $settingValue);
        break
      default: 
        Settings[$settingKey] = $settingValue;
        break
    }
  }
  return Settings
};

var Settings = ($settings = {}) => {
  const Settings = {
    enable: false,
    assign: 'addEventListener', deassign: 'removeEventListener', transsign: 'dispatchEvent',
    bindListener: true,
    errorLog: false,
    scopeKey: ':scope',
    // pathMatch: false,
    pathMatch: true,
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
      case 'methods': 
        Settings[$settingKey] = assign(Settings[$settingKey], $settingValue);
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
  #context
  #enable = false
  #nontranssigned = []
  #_targets = []
  #_assign
  #_deassign
  #_transsign
  constructor($settings, $context) { 
    if(!$settings || !$context) { return this }
    const settings = Settings($settings);
    const assigned = [];
    const deassigned = [];
    const transsigned = [];
    Object.defineProperties(this, {
      'settings': { value: settings },
      'path': { value: settings.path },
      'type': { value: settings.type },
      'assigned': { value: assigned },
      'deassigned': { value: deassigned },
      'transsigned': { value: transsigned },
      'listener':  { configurable: true, get() {
        const typeOfListener = typeOf(settings.listener);
        let listener;
        if(typeOfListener === 'string') {
          let listenerTarget = $context;
          iterateListenerPathKeys: 
          for(const $pathKey of settings.listener.split('.')) {
            const value = listenerTarget[$pathKey];
            if(value !== undefined) { listenerTarget = listenerTarget[$pathKey]; }
            else { break iterateListenerPathKeys }
          }
          if(typeOf(listenerTarget) === 'function') {
            listener = listenerTarget;
          }
        }
        else { listener = settings.listener; }
        if(settings.bindListener === true) {
          listener = listener.bind(this.#context);
        }
        Object.defineProperty(this, 'listener', { value: listener });
        return listener
      } }
    });
    this.#context = $context;
    this.enable = this.settings.enable;
  }
  get enable() { return this.#enable }
  set enable($enable) {
    const targets = this.#targets;
    const assigned = this.assigned;
    const deassigned = this.deassigned;
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
        else if(pretargetElement === undefined) { targets.push({
            path: this.path,
            target: $target,
            enable: false,
          });
        }
      }
    }
    else if(typeOf(this.path) === 'string') {
      // Refactoring
      const targetPaths = [];
      if(this.settings.pathMatch) {
        targetPaths.push(...getProperty(this.#context, this.path, {
          pathMatch: this.settings.pathMatch, nonenumerable: true
        }));
      }
      else {
        targetPaths.push([
          this.path, getProperty(this.#context, this.path, {
            pathMatch: this.settings.pathMatch, nonenumerable: true
          })
        ]);
      }
        if(this.path.charAt(0) === '*') {
          targetPaths.unshift([this.#scopeKey, this.#context]);
        }
        for(const [$targetPath, $targetValue] of targetPaths) {
          const pretargetElement = pretargets.find(
            ($pretarget) => $pretarget.path === $targetPath
          );
          let target = $targetValue;
          let targetElement;
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
      // }
      if(this.path === this.#scopeKey) {
        const targetElement = {
          path: this.path,
          target: this.#context,
          enable: false,
        };
        targets.push(targetElement);
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
  emit() {
    const targets = this.#targets;
    const transsigned = this.transsigned;
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
          let $addEvents = expandEvents(arguments[0], settings.compand.scopeKey);
          let $enableEvents = arguments[1] || false;
          for(let $addEvent of $addEvents) {
            const event = {};
            for(const $settingKey of [
              'assign', 'deassign', 'transsign', 'compand', 'bindListener'
            ]) {
              const settingValue = settings[$settingKey];
              if(settingValue !== undefined) { event[$settingKey] = settingValue; }
            }
            assign(event, $addEvent);
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

export { Core as default };
//# sourceMappingURL=core-plex.js.map
