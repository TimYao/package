/*
  bufferToBase64 转换为base64码

  example:
    bufferToBase64('你好', (result) => {
      console.log('编码结果为：', result);
    });
*/

const { Buffer } = require("buffer");

const bufferToBase64 = (str, callback) => {

  const getBaseCode = (n) => {
    const base64Code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    return base64Code[n];
  }

  // 转为二进制
  const translateToBuffer = (str) => {
    let bufferString = '';
    for(let i=0;i<str.length;i++){
      bufferString+=str[i].toString(2);
    }
    return bufferString;
  }

  // 按位分割
  const bufferSlice = (bufferString) => {
    let i = 0;
    let offset = 6;
    let start = 0;
    let end = start + offset;
    const l = Math.ceil((bufferString.length)/offset);
    const bufferArr = [];
    while(i<l) {
      bufferArr[i] = '00' + bufferString.slice(start, end);
      ++i;
      start = end;
      end = end + offset;
    }
    return bufferArr;
  }

  // 转为对应base64码
  const translateBase64 = (bufferArr) => {
    let base64String = '';
    for(let i=0;i<bufferArr.length;i++){
      let code = parseInt(bufferArr[i], 2);
      code = getBaseCode(code);
      base64String += code;
    }
    return base64String;
  }

  // run
  [translateToBuffer, bufferSlice, translateBase64, callback].reduce((prev, fn) => {
    return fn(prev);
  }, str = (Buffer.isBuffer(str) ? str : Buffer.from(str)))
}

module.exports = {
  bufferToBase64
}


