/*
  重新all方法完成并发返回所有请求结果
*/

function startRequest() {
  function promise(reqUlList){
    const _all = Promise.all.bind(Promise);
    Promise.all = function (reqUlLists) {
      return _all(reqUlList).then((reqUlList) => {
        let result = [];
        reqUlLists.forEach((reqUrl, i) => {
          reqUrl = [reqUrl];
          let xml = startXml(reqUrl);
          let promise = Promise.race([xml])
          promise.i = i;
          result[i] = promise;
        });
        return result;
      });
    }
    return Promise.all(reqUlList)
  }
  // 创建请求
  const startXml = (url) => {
    const xml = new XMLHttpRequest();
    xml.open('get', url, true);
    xml.responseType = 'json';
    xml.send();
    return xml;
  }

  // 解析返回结果
  const resolveResult = (data) => {
    result = [];
    data.reduce((p, n) => {
      let i = n.i;
      n = n.then(resolveXmlResult);
      n.then((d) => {
        p[i] = d;
      }, (e) => {
        p[i] = e;
      });
      return p;
    }, result)
    return result;
  }
  const resolveXmlResult = (xml) => {
    return new Promise((resolve, reject) => {
      xml.onload = function() {
        if (xml.status === 200) {
          resolve(xml.response);
        } else {
          reject(xml.response);
        }
      }
      // 其他情况触发这里，直接发送失败
      xml.onerror = function(e) {
        reject({code: e.target.status, text: '请求错误'});
      }
    })
  }

  const listUrl = ['http://127.0.0.1:8000/req1', 'http://127.0.0.1:8000/req2', 'http://127.0.0.1:8000/req3'];
  promise(listUrl).then(resolveResult).then((result) => {
    console.log('result:', result);
  }).catch((err) => {
    console.log('error:', err);
  })
}