/*
  通过loader方式简单替换实现懒导入
*/

let esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');


const createImportNode = (nodeObj) => {
  if (typeof nodeObj !== 'object' || nodeObj == null) {
    return nodeObj;
  }
  const obj = new (nodeObj.constructor);
  if (Array.isArray(nodeObj)) {
    nodeObj.forEach((node) => {
      const sub = createImportNode(node);
      obj.push(sub);
    })
  } else {
    for (let key in nodeObj) {
      obj[key] = createImportNode(nodeObj[key]);
    }
  }
  return obj;
}

const genNode = (node, i) => {
  node.specifiers = node.specifiers.splice(i, 1);
  let name;
  const value = node.source.value;
  node.specifiers.forEach((n) => {
    name = n.local.name;
    n.type = 'ImportDefaultSpecifier';
    delete n.imported;
  })
  node.source.value = `${value}/${name}`;
  node.source.raw = `\'${value}/${name}\'`;
  return node;
}

function loader(source){
  let module = [];
  let code = source;
  let ast = esprima.parse(code, { sourceType: 'module'});
  estraverse.traverse(ast, {
    enter(node, parent) {
      if (node.type === 'ImportDeclaration') {
        node.specifiers.forEach((subNode, i) => {
          if (subNode.type === 'ImportSpecifier') {
            const traverseNode = createImportNode(node);
            const newNode = genNode(traverseNode, i);
            module.push(newNode);
          }
        });

        let index = parent.body.findIndex((n ,i) => {
          return n.type === 'ImportDeclaration';
        })

        if (index >= 0) {
          parent.body.splice(index, 1);
          if (module.length > 0) {
            module.forEach((m) => {
              parent.body.splice(index++, 0, m);
            })
            index = -1;
          }
        }
      }
    }
  })
  let newCode = escodegen.generate(ast);
  return newCode;
}

module.exports = loader;