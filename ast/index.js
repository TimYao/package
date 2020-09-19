// 转换 (add 1 (sub 4 3))

const code = '(add 1 (sub 4 3))';
// 词法分析
const tokenizer = require('./tokenizer');
// 语法分析
const parse = require('./parse');
// 遍历
const traverse = require('./traverse');
// 重新生成
const generator = require('./generator');

const token = tokenizer(code);
const ast = parse(token);
const traverseAst = traverse(ast);
const generatorNode = generator(traverseAst);
// console.log(JSON.stringify(traverseAst, null, 2));
console.log('last result:', generatorNode);