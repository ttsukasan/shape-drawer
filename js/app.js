import {minify} from 'terser'
var code = "function add(first, second) { return first + second; }";
var result = await minify(code, { sourceMap: true });
console.log(result.code);  // minified output: function add(n,d){return n+d}
console.log(result.map);
