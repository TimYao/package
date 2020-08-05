const http = require('http');
const EventEmitter = require('events');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const { Stream } = require('stream');

class Application extends EventEmitter {
  constructor(options) {
    // options
    // proxy false|true 是否相信代理
    // env development 默认环境为development
    // submainoffset 默认偏移量
    // maxIpCount

    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);

    // 存放中间件
    this.middleWare = [];
  }
  use(fn) {
    if (typeof fn !== 'function') {
      console.error('use fn must be function');
      return;
    }
    this.middleWare.push(fn);
  }
  listen(...arg) {
    // 其实这里可以领到导入https方式结合到koa里
    const server = http.createServer(this.callback());
    server.listen(...arg);
  }
  callback() {
    // fn 为包裹中间函数的外层函数
    const fn = this.compose(this.middleWare);

    return (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handlerRequest(ctx, fn);
    }
  }
  compose(middleWare) {
    if (!Array.isArray(middleWare)) {
      throw new TypeError('middleWare must be array');
    } else {
      for (const fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
      }
    }
    // 中间件写法，即一个函数
    return (context, next) => {
      let index = -1;
      const dispatch = (i) => {
        if (i<=index) {
          return Promise.reject('多次调用next');
        }
        index = i;
        let fn = middleWare[i];
        if (i === middleWare.length) {
          fn = next;
        }
        if (!fn) {
          return Promise.resolve();
        }
        try{
          return Promise.resolve(fn(context, dispatch.bind(null, i+1)))
        }catch(e){
          return Promise.reject(e);
        }
      };
      return dispatch(0);
    }
  }
  createContext(req, res) {
    const context = Object.create(this.context);
    const request = Object.create(this.request);
    const response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    context.request = request;
    context.response = response;
    context.originalUrl = request.originalUrl = req.url;

    return context;
  }
  handlerRequest(ctx, fn) {
    const res = ctx.res;
    res.statusCode = 404;
    return fn(ctx).then(() => respond(ctx)).catch((e) => {
      res.statusCode = 400;
      console.log(e);
    });

  }
}
const respond = (ctx) => {
  // 处理ctx.body ctx.status
  const {body, res} = ctx;
  if (typeof body === 'string' || Buffer.isBuffer(body)) {
    res.statusCode = 200;
    return res.end(body);
  }
  if (body instanceof Stream) {
    res.statusCode = 200
    return body.pipe(res);
  }
  res.statusCode = 200;
  return res.end(JSON.stringify(body));
}

module.exports = Application;