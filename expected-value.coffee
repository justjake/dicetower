# Description:
#   Allows Hubot to roll dice
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot roll (die|one) - Roll one six-sided dice
#   hubot roll dice - Roll two six-sided dice
#   hubot roll <x>d<y> - roll x dice, each of which has y sides
#   hubot expected <x>d<y>
#
# Author:
#   jake teton-landis <just.1.jake@gmail.com>
util = require('util')
# debug = (args...) -> console.log (util.inspect(t) for t in args).join(" ")
debug = (args...) -> undefined

class Roll
  constructor: (_, @count, @sides) ->
    @count = parseInt(@count, 10)
    @sides = parseInt(@sides, 10)
    if @sides < 1
      throw TypeError("I don't know how to roll a zero-sided die.")
    if @count > 100
      throw TypeError("I'm not gonna think about a zillion dice for you")

  roll: () ->
    r = roll(@count, @sides)
    return [r.reduce((x, y) -> x + y), r]
  expected: () ->
    v = expect(@count, @sides).reduce (x, y) -> x + y
    return [v, v]

class Fudge extends Roll
  constructor: (_, @count) ->
    @sides = 3
    @count ?= 1
    super(_, @count, @sides)
  roll: () ->
    [_, r] = super()
    r = r.map (v) -> v - 2
    return [r.reduce((x, y) -> x + y), r]
  expected: () -> 0


DELIM = /\s*\+\s*|\s+/
SINGLE =
  t: /^d(\d+)/i
  c: (_, sides) ->
    new Roll(_, 1, sides)
FUDGE =
  t: /^(\d+)?dF/i
  c: (p...) -> new Fudge(p...)
CONST =
  t: /^(-?\d+)$/
  c: (d) -> parseInt(d, 10)
DIE =
  t: /^(\d+)d(\d+)/i
  c: (p...) -> new Roll(p...)

lex = (token, type) ->
  match = token.match(type.t)
  if match
    return type.c(match...)
  return undefined

parse = (str) ->
  debug "parsing", str
  tokens = str.split(DELIM)
  debug "lexing", tokens
  tree = []
  for t in tokens
    if t == ''
      continue
    tree.push(lex(t, DIE) ?
              lex(t, SINGLE) ?
              lex(t, FUDGE) ?
              lex(t, CONST) ?
              throw new TypeError("bad token: #{util.inspect(t)}"))
  tree

reportTree = (tree, reducer) ->
  dingus = 0
  narrative = []
  SEP = ' + '
  for t in tree
    if typeof t == 'number'
      narrative.push("*#{t}*")
      dingus += t
    else
      [val, nar] = reducer(t)
      narrative.push(nar)
      dingus += val
  debug "narrative is", narrative
  if narrative.length > 1
    narrative.join(SEP) + " = *#{dingus}*"
  else
    "got #{narrative[0]}"

bold = (v) -> "*#{v}*"

module.exports = (robot) ->
  robot.respond /roll (die|one)/i, (msg) ->
    msg.reply report [rollOne(6)]

  robot.respond /roll dice/i, (msg) ->
    msg.reply report roll 2, 6

  robot.respond /adv/i, (msg) ->
    msg.reply report roll 2, 20

  robot.respond /roll ([\s\d+df]+)$/i, (msg) ->
    try
      tree = parse(msg.match[1])
      msg.reply reportTree tree, (r) ->
        [val, nar] = r.roll()
        if nar.length > 1
          [val, "*#{val}* (rolled #{rollList(nar)})"]
        else [val, bold(val)]
    catch error
      msg.reply error.message

  robot.respond /expected (.+)/i, (msg) ->
    try
      tree = parse(msg.match[1])
      msg.reply reportTree tree, (r) -> r.expected()
    catch error
      msg.reply error.message

  robot.respond /rng (\d+|\d*\.\d+)/, (msg) ->
    [_, f] = msg.match
    f = parseFloat(f)
    reply = if f <= Math.random()
      "you live by the rng"
    else
      "you die by the rng"
    msg.reply reply


report = (results) ->
  if results?
    switch results.length
      when 0
        "I didn't roll any dice."
      when 1
        "I rolled a #{results[0]}."
      else
        total = results.reduce (x, y) -> x + y
        "I rolled #{rollList(results)}, making #{total}."

rollList = (results) ->
  finalComma = if (results.length > 2) then "," else ""
  last = results.pop()
  "#{results.join(", ")}#{finalComma} and #{last}"

reportE = (results) ->
  if results?
    if results.length == 0
        "The expectation of zero dice is zero, dummy."
    else
        total = results.reduce (x, y) -> x + y
        "Probably #{total}"

expect = (dice, sides) ->
  expectOne(sides) for i in [0...dice]

expectOne = (sides) ->
  sides = sides
  (sides + 1) / 2

roll = (dice, sides) ->
  rollOne(sides) for i in [0...dice]

rollOne = (sides) ->
  1 + Math.floor(Math.random() * sides)
