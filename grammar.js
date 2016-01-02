// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }


function normal(evaluator) {
  return function(data) {
    var unwrapped = data.map(val);
    var value = evaluator(unwrapped);
    var annotation = data.map(src);
    return { src: annotation, value: value };
  }
}

function val(el) {
  if (el && 'value' in el) {
    return el.value || el;
  }
  return el;
}

function src(el) {
  if (el) {
    return el.src || el;
  }
  return el;
}

var grammar = {
    ParserRules: [
    {"name": "main", "symbols": ["_", "AS", "_"], "postprocess": normal(function(d) {return d[1]; })},
    {"name": "P", "symbols": [{"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": normal(function(d) {return d[2]; })},
    {"name": "P", "symbols": ["N"], "postprocess": id},
    {"name": "E", "symbols": ["P", "_", {"literal":"^"}, "_", "E"], "postprocess": normal(function(d) {return Math.pow(d[0], d[4]); })},
    {"name": "E", "symbols": ["P"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"*"}, "_", "E"], "postprocess": normal(function(d) {return d[0]*d[4]; })},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"/"}, "_", "E"], "postprocess": normal(function(d) {return d[0]/d[4]; })},
    {"name": "MD", "symbols": ["E"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"+"}, "_", "MD"], "postprocess": normal(function(d) {return d[0]+d[4]; })},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"-"}, "_", "MD"], "postprocess": normal(function(d) {return d[0]-d[4]; })},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "N", "symbols": ["float"], "postprocess": id},
    {"name": "N$string$1", "symbols": [{"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "N", "symbols": ["N$string$1", "_", "P"], "postprocess": normal(function(d) {return Math.sin(d[2]); })},
    {"name": "N$string$2", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "N", "symbols": ["N$string$2", "_", "P"], "postprocess": normal(function(d) {return Math.cos(d[2]); })},
    {"name": "N$string$3", "symbols": [{"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "N", "symbols": ["N$string$3", "_", "P"], "postprocess": normal(function(d) {return Math.tan(d[2]); })},
    {"name": "N$string$4", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "N", "symbols": ["N$string$4", "_", "P"], "postprocess": normal(function(d) {return Math.asin(d[2]); })},
    {"name": "N$string$5", "symbols": [{"literal":"a"}, {"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "N", "symbols": ["N$string$5", "_", "P"], "postprocess": normal(function(d) {return Math.acos(d[2]); })},
    {"name": "N$string$6", "symbols": [{"literal":"a"}, {"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "N", "symbols": ["N$string$6", "_", "P"], "postprocess": normal(function(d) {return Math.atan(d[2]); })},
    {"name": "N$string$7", "symbols": [{"literal":"p"}, {"literal":"i"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "N", "symbols": ["N$string$7"], "postprocess": normal(function(d) {return Math.PI; })},
    {"name": "N", "symbols": [{"literal":"e"}], "postprocess": normal(function(d) {return Math.E; })},
    {"name": "N$string$8", "symbols": [{"literal":"s"}, {"literal":"q"}, {"literal":"r"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "N", "symbols": ["N$string$8", "_", "P"], "postprocess": normal(function(d) {return Math.sqrt(d[2]); })},
    {"name": "N$string$9", "symbols": [{"literal":"l"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "N", "symbols": ["N$string$9", "_", "P"], "postprocess": normal(function(d) {return Math.log(d[2]); })},
    {"name": "N", "symbols": ["DICE"]},
    {"name": "DICE", "symbols": ["int", {"literal":"d"}, "int"], "postprocess": 
        function(d) {
          return {
            value: d[0] * d[2],
            src: 'lol dice: ' + d[0] + ' ' + d[2]
          }
        }
        },
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2])}},
    {"name": "float", "symbols": ["int"], "postprocess": function(d) {return parseInt(d[0])}},
    {"name": "int", "symbols": [/[0-9]/], "postprocess": id},
    {"name": "int", "symbols": ["int", /[0-9]/], "postprocess": function(d) {return d[0] + d[1]}},
    {"name": "_", "symbols": [], "postprocess": function(d) {return null; }},
    {"name": "_", "symbols": ["_", /[\s]/], "postprocess": function(d) {return null; }}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
