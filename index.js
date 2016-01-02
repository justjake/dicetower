#!/usr/bin/env node

/*
 * dice rolling using a nearley parser
 */

nearley = require('nearley');
grammar = require('./grammar');

// returns a syntax tree from a string like "(1d4 + 2)^10"
function parse(string) {
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  parser.feed(string);
  return parser.results;
}

// takes a syntax tree and evaluate it, producing a result object like
// {
//   result :: Number,
//   explanation :: MarkdownString
// }
function evaluate(tree) {
  return tree.value;
}

// render the annotation of a tree
function render(almostTree) {
  const tree = unwrap(almostTree);
  if (tree === null) return null;
  if (tree.src) return render(tree.src);
  if (Array.isArray(tree)) return '(' + tree.filter(Boolean).map(render).join(' ') + ')';
  return tree;
}

function unwrap(array) {
  if (Array.isArray(array) && array.length === 1) return unwrap(array[0]);
  return array;
}

function main() {
  const input = process.argv[2]
  console.log(`input: ${input}`)
  const tree = parse(input)
  console.log('--- tree ---')
  console.log(JSON.stringify(tree, null, "  "))
  console.log('--- result ---')
  console.log(evaluate(tree))
  console.log('--- annotation ---')
  console.log(render(tree));
}

main();
