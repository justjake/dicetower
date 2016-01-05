#!/usr/bin/env node

/*
 * dice rolling using a nearley parser
 */

import nearley from 'nearley';
import grammar from './grammar';

const OPEN_PAREN = '('
const CLOSE_PAREN = ')'

// returns a syntax tree from a string like "(1d4 + 2)^10"
export function parse(string) {
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  parser.feed(string);
  return parser.results;
}

function sum(array) {
  return array.reduce((prev, next) => prev + next, 0);
}

export function evaluate(almostTree) {
  const tree = unwrap(almostTree);
  if (tree.length) return tree[0];
  return tree;
}

export function contains(needle, haystack) {
  return haystack.indexOf(needle) > -1;
}

// render the annotation of a tree
export function render(almostTree, rolls = true, expected = true, expectedOnly = false) {
  const tree = unwrap(almostTree);
  //console.log('render', tree)
  if (tree === null) return 'NULL';
  if (tree.src) return render(tree.src, rolls, expected);
  // special handling for dice rolls
  if (tree.rolls) {
    let diceRender = expectedOnly ?
      `${sum(tree.expectedRolls)}` :
      `${sum(tree.rolls)}`
    if (rolls || expected) diceRender += ' (';
    if (rolls) diceRender += `rolled ${tree.request}: ${tree.rolls.join('+')}`;
    if (rolls && expected) diceRender += ', ';
    if (expected && !expectedOnly) diceRender += `expected ${sum(tree.expectedRolls)}: `
    if (expected) diceRender += `${tree.rolls.length}*${tree.expectedRolls[0]}`;
    if (rolls || expected) diceRender += ')';
    return diceRender;
  }
  if (Array.isArray(tree)) {
    // handle paren arrays
    if (tree[0] === OPEN_PAREN && tree[tree.length - 1] === CLOSE_PAREN) {
      return '(' + render(tree.slice(1, -1), rolls, expected, expectedOnly) + ')';
    }
    return tree.map(x => render(x, rolls, expected, expectedOnly)).join(' ');
  }

  return tree;
}


function unwrap(array) {
  if (!Array.isArray(array)) return array;
  const noNulls = array.filter(Boolean);
  const reduced = noNulls.map(unwrap);
  if (noNulls.length === 1) return unwrap(noNulls[0]);
  return reduced;
}

export function run(input) {
  console.log(`input: ${input}`)
  const tree = evaluate(parse(input));
  console.log('--- tree ---')
  console.log(JSON.stringify(tree, null, "  ")) // unwrap(unwrap(tree).src), null, "  "))
  console.log('--- report ---')
  console.log(report(input));
  console.log(report(input, true));
}

export function report(input, useExpectedValue = false) {
  const MAX_LEN = 70
  const tree = evaluate(parse(input));
  const asRolled = useExpectedValue ? render(tree, false, true, true) : render(tree, true, false, false);
  const seperator = asRolled.length < MAX_LEN ? ' ' : '\n';
  return `*${useExpectedValue ? tree.expected : tree.value}*${seperator}(${asRolled})`;
}

function main() {
  const input = process.argv[2];
  run(input);
}

main();
