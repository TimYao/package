/*
  完成将新的AST转为程序

*/
const generator = (node) => {
  if (node.type === 'Program') {
    return node.body.map(n => generator(n)).join('/n');
  } else if (node.type === 'CallExpression') {
    return generator(node.callee) + '(' + (node.arguments.map((n) => generator(n)).join(',')) + ')';
  } else if (node.type === 'NumberLiteral') {
    return node.value;
  } else if (node.type === 'Identifier') {
    return node.name;
  }
};

module.exports = generator;