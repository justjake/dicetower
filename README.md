# dicetower

- rip-off of the Nearley calculator grammar with dice rolling added in
- a hubot bot that lets you talk to the Nearley grammar

```javascript
const dicetower = require('dicetower');

dicetower.report('2d6 + 2dF + 2')
// -> *13* (12 (rolled 2d6: 6+6) + -1 (rolled 2dfudge: 1+-2) + 2)

// the number of dice or sides of the dice can be computed via dice roll
dicetower.report('(1d20)d20')
// -> *86* (86 (rolled 11d20: 6+1+3+5+9+5+17+9+11+1+19))

// you can roll custom arbirary dice
dicetower.report('2d4 * 1d[2 3 5 7 9 14]')
// -> *12* (6 (rolled 2d4: 4+2) * 2 (rolled 1d[14 2 3 5 7 9]: 2))

// you can get expected value instead of actually rolling dice
dicetower.report('2d4 * 1d[2 3 5 7 9 14]', true);
// *33.333333333333336*
// (3 (expected 5: 2*2.5) * 7 (expected 6.666666666666667: 1*6.666666666666667))

```

# ok so what's this grammar thing?

I dunno. It's cool. It parses your string and does the calculation.
