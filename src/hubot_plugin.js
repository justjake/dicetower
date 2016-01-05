/*
# Description:
#   Advanced dice rolling calculator for Huuuuuboooot
#
# Dependencies:
#   managed by NPM
#
# Configuration:
#   None
#
# Commands:
#   hubot roll (die|one) - Roll one six-sided dice
#   hubot roll dice - Roll two six-sided dice
#   hubot roll [-v verbose] [-e expected]  DICE_EXPRESSION - roll a bunch of dice and sum them up. Eg `!roll (2d(3d8) + 5d[1 5 7 9]) / 12`
#   hubot expected DICE_EXPRESSION - get the expected value of a dice expression
#
# Author:
#   jake teton-landis <just.1.jake@gmail.com>
*/

import { report, contains } from './'

const dont_parse = ['die', 'one', 'dice'];

module.exports = function DiceRollingScript(robot) {
  robot.respond(/roll (die|one)/i, (msg) => msg.reply(report('1d6')));

  robot.respond(/roll dice/i, (msg) => msg.reply(report('2d6')))

  robot.respond(/adv/i, (msg) => msg.reply(report('2d20')))

  robot.respond(/rng (\d+|\d*\.\d+)/, (msg) => {
    const num = praseFloat(msg.match[1]);
    let reply;
    if (num <= Math.random()) {
      msg.reply("you live by the rng");
    } else {
      msg.reply("you die by the rng");
    }
  });

  robot.respond(/roll (.+)$/i, (msg) => {
    // make sure this isn't roll die|one|dice
    if (contains(msg.match[1], dont_parse)) return;
    msg.reply(report(msg.match[1]));
  });

  robot.respond(/expected (.+)/i, (msg) => msg.reply(report(msg.match[1], true)))
}
