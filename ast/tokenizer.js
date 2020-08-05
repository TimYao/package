/*
  简单的词法切割
  [ { type: 'paren', value: '(' },
  { type: 'name', value: 'add' },
  { type: 'number', value: '1' },
  { type: 'paren', value: '(' },
  { type: 'name', value: 'sub' },
  { type: 'number', value: '4' },
  { type: 'number', value: '3' },
  { type: 'paren', value: ')' },
  { type: 'paren', value: ')' } ]
*/

const regexpNum = /\d+/;
const regexpLetter = /[a-zA-Z]/;
const kh = /(?:\(|\))/
const regexpSpace = /\s+/;

const tokenizer = (code) => {
  const tokens = [];
  let token;
  let current = 0;
  while(current < code.length) {
    token = code[current];
    if (kh.test(token) && token === '(') {
      tokens.push({type: 'paren', value: '('});
      current++;
      continue;
    } else if (regexpLetter.test(token)) {
      let value = '';
      while (regexpLetter.test(token)) {
        value += token;
        token = code[++current];
      }
      tokens.push({type: 'name', value});
      continue;
    } else if (regexpSpace.test(token)) {
      current++;
      continue;
    } else if (regexpNum.test(token)) {
      let value = '';
      while (regexpNum.test(token)) {
        value += token;
        token = code[++current];
      }
      tokens.push({type: 'number', value});
      continue;
    } else if (kh.test(token) && token === ')') {
      tokens.push({type: 'paren', value: ')'});
      current++;
      continue;
    }
  }
  return tokens;
};

module.exports = tokenizer;