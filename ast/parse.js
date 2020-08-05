//词法转变为语法格式
/*
  CallExpression 函数
  NumberLiteral  数字
*/

let ast = {
  type:'Program',
  body:[]
}
const parse = (tokens) => {
  let current = 0;
  let token;
  const collect = () => {
    token = tokens[current];
    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current];
      // 创建节点
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: []
      }
      // 收集参数
      token = tokens[++current];
      while (token.type != 'paren' || (token.type == 'paren' && token.value != ')')) {
        node.params.push(collect());
        token = tokens[current];
      }
      current++;
      return node;
    } else if(token.type =='number') {
      // 收集数字
      current++;
      return {
          type:'NumberLiteral',
          value:token.value
      }
    }
  }
  while(current < tokens.length) {
    ast.body.push(collect());
  }
  return ast;
};

module.exports = parse;