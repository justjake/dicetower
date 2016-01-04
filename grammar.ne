@builtin "number.ne"
@builtin "whitespace.ne"

@{%

const { roll, expect, KnownDice } = require('./dice');

const VALUE_PROPS = ['value', 'expected'];

function fetch(obj, prop) {
  if (obj && obj[prop] !== undefined) {
    return obj[prop];
  }
  return obj;
}

function normal(evaluator) {
  return function(data) {
    const result = {};
    VALUE_PROPS.forEach(prop => {
      const unwrapped = data.map(item => fetch(item, prop));
      const value = evaluator(unwrapped);
      result[prop] = value;
    });
    result.src = data.map(item => fetch(item, 'src'));
    return result;
  }
}

function sum(array) {
  return array.reduce((prev, next) => prev + next, 0);
}

function rollKnownDice(num, sides) {
  const rolls = roll(num, sides);
  const expectedRolls = expect(num, sides);
  return {
    value: sum(rolls),
    expected: sum(expectedRolls),
    src: {
      request: `${num}d${sides}`,
      rolls,
      expectedRolls,
    }
  };
}
%}

# This is a nice little grammar to familiarize yourself
# with the nearley syntax.

# It parses valid calculator input, obeying OOO and stuff.
#   ln (3 + 2*(8/e - sin(pi/5)))
# is valid input.

# This is (hopefully) pretty self-evident.

# `main` is the nonterminal that nearley tries to parse, so
# we define it first.
# The _'s are defined as whitespace below. This is a mini-
# -idiom.

main -> _ AS _ {% normal(function(d) {return d[1]; }) %}

# PEMDAS!
# We define each level of precedence as a nonterminal.

# Parentheses
P -> "(" _ AS _ ")" {% normal(function(d) { return d[2]; }) %}
    | N             {% id %}

# Exponents
E -> P _ "^" _ E    {% normal(function(d) {return Math.pow(d[0], d[4]); }) %}
    | P             {% id %}

# Multiplication and division
MD -> MD _ "*" _ E  {% normal(function(d) {return d[0]*d[4]; }) %}
    | MD _ "/" _ E  {% normal(function(d) {return d[0]/d[4]; }) %}
    | E             {% id %}

# Addition and subtraction
AS -> AS _ "+" _ MD {% normal(function(d) {return d[0]+d[4]; }) %}
    | AS _ "-" _ MD {% normal(function(d) {return d[0]-d[4]; }) %}
    | MD            {% id %}

# A number or a normal(function of a number
N -> decimal        {% id %}
    | DICE          {% id %}
    | "sin" _ P     {% normal(function(d) {return Math.sin(d[2]); }) %}
    | "cos" _ P     {% normal(function(d) {return Math.cos(d[2]); }) %}
    | "tan" _ P     {% normal(function(d) {return Math.tan(d[2]); }) %}

    | "asin" _ P    {% normal(function(d) {return Math.asin(d[2]); }) %}
    | "acos" _ P    {% normal(function(d) {return Math.acos(d[2]); }) %}
    | "atan" _ P    {% normal(function(d) {return Math.atan(d[2]); }) %}

    | "pi"          {% normal(function(d) {return Math.PI; }) %}
    | "e"           {% normal(function(d) {return Math.E; }) %}
    | "sqrt" _ P    {% normal(function(d) {return Math.sqrt(d[2]); }) %}
    | "ln" _ P      {% normal(function(d) {return Math.log(d[2]); })  %}

DICE -> NORMAL_DICE {% id %}
      | FUDGE_DICE  {% id %}
      | CUSTOM_DICE {% id %}

NORMAL_DICE -> posint "d" posint {%
  // TODO dice it up for reals
  function(d) {
    const num = d[0];
    const sides = d[2];
    return rollKnownDice(num, sides);
  }
%}

FUDGE_DICE -> posint "dF" {%
  function(d) {
    const num = d[0];
    return rollKnownDice(num, 'fudge');
  }
%}

CUSTOM_DICE -> posint "d" "[" _ LIST _ "]" {%
  function(d) {
    const count = d[0];
    const faces = d[4];
    console.log('faces', faces)
    const name = faces.sort().join('|');
    if (!KnownDice[name]) KnownDice[name] = faces;
    return rollKnownDice(count, name);
  }
%}

LIST -> posint
      | posint SEPERATOR LIST {%
  function(d) {
    return [d[0]].concat(d[2]);
  }
%}

SEPERATOR -> _ "," _ {% function() { return null } %}
           | __      {% id %}
