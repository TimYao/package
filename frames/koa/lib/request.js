// request getter setter

const url = require('url');

module.export = {
  // 返回原始nodejs上的请求头
  /*
    {
      host: 'localhost:3000',
      connection: 'keep-alive',
      'cache-control': 'max-age=0',
      'upgrade-insecure-requests': '1',
      'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
      accept:
        'text/html,
        application/xhtml+xml,
        application/xml;q=0.9,
        image/webp,image/apng,
        *///*;
        //q=0.8,application/signed-exchange;v=b3;q=0.9',
      //'sec-fetch-site': 'none',
      //'sec-fetch-mode': 'navigate',
      //'sec-fetch-user': '?1',
      //'sec-fetch-dest': 'document',
      //'accept-encoding': 'gzip, deflate, br',
      //'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7,ja;q=0.6,da;q=0.5',
    //cookie:
      //'Hm_lvt_e9e114d958ea263de46e080563e254c4=1587013622; Hm_lpvt_e9e114d958ea263de46e080563e254c4=1587013633'
    //}

  get header() {
    return this.req.headers;
  },
  set header(val) {
    this.req.headers = val;
  },

  get headers() {
    return this.req.headers;
  },
  set headers(val) {
    this.req.headers = val;
  },

  get url() {
    return this.req.url;
  },
  set url(val) {
    this.req.url = val;
  },

  get origin() {
    // 协议+主机 host = hostname+port
    return `${this.protocol}://${host}`
  },

  get href() {
    if (/^https?:\/\//i.test(this.originalUrl)) {
      return this.originalUrl;
    }
    return this.origin + this.originalUrl;
  },

  get method() {
    return this.req.method;
  },
  set method(val) {
    this.req.method = val;
  },

  get path() {
    // parse(this.req).pathname; 源码内部使用
    return url.parse(this.req.url).pathname;
  },
  set path(path) {
    const url = url.parse(this.req.url);
    const {pathname} = url;
    if (path === pathname) return;
    url.pathname = path;
    url.path = null;
    this.url = url.format(url);
  }
}


// test
const http = require('http');
const { stringify } = require('querystring');
const server = http.createServer((req, res) => {
  console.log(url.parse(req.url));
})
server.listen('3000')