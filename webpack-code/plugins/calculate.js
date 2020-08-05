const babel = require('@babel/core');
const t = require('babel-types');
const transformClassesPlugin = require('babel-plugin-transform-es2015-classes');

const codeCalculate = `let delay = (2+5)*4`;
const codeClass = `
class Person {
  constructor(name) {
    this.name = name;
  }
  getName() {
    console.log('aa');
  }
}
`;

/*
function Person(name) {
  this.name = name;
}
Person.prototype.getName=function(){
  console.log('aa');
}
*/

// 访问器方式 完成计算替换
const preCalculatePlugin = {
  visitor: {
    BinaryExpression(path) {
      let node = path.node;
      let left = node.left;
      let right = node.right;
      let operator = node.operator;

      if (!isNaN(left.value) && !isNaN(right.value)) {
        let result = eval(left.value + operator + right.value);
        path.replaceWith(t.numericLiteral(result));
        if (path.parent && path.parent.type === 'BinaryExpression') {
          preCalculatePlugin.visitor.BinaryExpression(path.parentPath);
        }
      }
    }
  }
};

// 转换类
const classPlugin = {
  visitor: {
    ClassDeclaration(path) {
      const node = path.node;
      // Person
      const id = node.id;
      // methods
      const methods = node.body.body;
      const statements = [];
      // console.log(methods);
      methods.forEach((method) => {
        if (method.kind === 'constructor') {
          const functionDeclaration = t.functionDeclaration(id, method.params, method.body, false, false);
          statements.push(functionDeclaration);
        } else if (method.kind === 'method') {
          const operator = '=';
          const left = t.memberExpression(t.memberExpression(id, t.identifier('prototype')), method.key);
          const right = t.functionExpression(null, method.params, method.body, false, false);
          const assignmentExpression = t.assignmentExpression(operator, left, right);
          const expressionStatement = t.expressionStatement(assignmentExpression);
          statements.push(expressionStatement);
        }
      })
      path.replaceWithMultiple(statements);
    }
  }
};

const result = babel.transform(codeClass, {
  plugins: [classPlugin]
})
console.log(result.code);