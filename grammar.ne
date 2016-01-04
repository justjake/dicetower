@builtin "number.ne"
@builtin "whitespace.ne"

@{%

import { Dice, FudgeDice } from './dice';

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
    VALUE_PROPS.forEach(propName => {
      const unwrapped = data.map(item => fetch(item, prop));
      const value = evaluator(unwrapped);
      result[prop] = value;
    });
    result.src = data.map(item => fetch(item, 'src'));
    return result;
  }
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
    | NORMAL_DICE   {% id %}
    | FUDGE_DICE    {% id %}
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

DICE -> posint "d" posint {%
  // TODO dice it up for reals
  function(d) {
    return {
      value: d[0] * d[2],
      src: 'lol dice: ' + d[0] + ' ' + d[2]
    }
  }
%}
