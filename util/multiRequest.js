/*
  并发送请求
*/

function multiRequest (urls, maxNum) {
  const urLen = urls.length;
  const reqUrlLen = Math.min(urLen, maxNum);
  const reqArr =  urls.slice(0, reqUrlLen);
  let lastReq = [];
  const result = [];
  if (reqUrlLen < urLen) {
    lastReq = urls.slice(reqUrlLen);
  }

  // 创建请求
  const startXml = (url) => {
    const xml = new XMLHttpRequest();
    xml.open('get', url, true);
    xml.responseType = 'json';
    xml.send();
    return xml;
  }

  const resolveXmlResult = (xml) => {
    return new Promise((resolve, reject) => {
      xml.onload = function () {
        if (xml.status === 200) {
          resolve(xml.response);
        } else {
          reject(xml.response);
        }
      }
      xml.onerror = function (e) {
        reject({code: e.target.status, text: '请求错误'});
      }
    })
  }

  const startRequest = () => {
    let index = 0;
    let iNow = 0;
    const start = (resolve, reject) => {
      const done = (i) => {
        delete reqArr[i];
        ++index;
        ++iNow;
        if (reqUrlLen > (reqArr.filter((n) => !!n).length) && lastReq.length > 0) {
          reqArr.push(lastReq.shift());
        }
        if (index === reqUrlLen) {
          index = 0;
          start(resolve, reject);
        }
        if (iNow >= urLen) {
          return resolve(result);
        }
      }
      reqArr.forEach((url, i) => {
        let xml = startXml(url);
        Promise.race([xml])
        .then(resolveXmlResult)
        .then((d) => {
          result[i] = d;
          done(i);
        }).catch((e) => {
          result[i] = e;
          done(i);
        })
      })
    }
    return new Promise((resolve, reject) => {
      start(resolve, reject);
    })
  }
  startRequest().then((result) => {
    console.log('result:', result);
  })
}

multiRequest(['http://127.0.0.1:8000/req1', 'http://127.0.0.1:8000/req2', 'http://127.0.0.1:8000/req3'], 2);