/*
  访问器遍历节点，完成访问器对应的访问执行
*/

const traverser = (ast, visitor) => {
  const traverseArray = (array, parent) => {
    array.forEach(node => traverseNode(node, parent));
  }
  const traverseNode = (node, parent) => {
    const visitorObj = visitor[node.type];
    let enter;
    let leave;
    if (typeof visitorObj === 'function') {
      enter = visitorObj;
    } else if (typeof visitorObj === 'object'){
      enter = visitorObj.enter;
      leave = visitorObj.leave;
    }
    if (enter) {
      enter(node, parent);
    }
    switch(node.type) {
      case 'Program':
        traverseArray(node.body, node);
        break;
      case 'CallExpression':
        traverseArray(node.params, node);
        break;
      case 'NumberLiteral':
        break;
    }
    if (leave) {
      leave(node, parent);
    }
  }
  traverseNode(ast, null);
}

const traverse = (ast) => {
  let newAst = {
    type:'Program',
    body:[]
  };
  ast.context = newAst.body;
  traverser(ast, {
    CallExpression(node, parent) {
      let callExpression = {
        type: 'CallExpression',
        callee: {type: 'Identifier', name: node.name},
        arguments: []
      }
      node.context = callExpression.arguments;
      parent.context.push(callExpression);
    },
    NumberLiteral(node, parent) {
      parent.context.push(node);
    }
  })
  return newAst;
};

module.exports = traverse;