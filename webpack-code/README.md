# webpack

通过对整合资源转换为js模块来处理，并对文件进行过度的需求处理，最终都以脚本模式管理统一管理；

## loader

loader可以理解为一个函数，一个转换函数，通过函数将对于的文件进行转换，转换为js模式处理；

loader的导出分为两种，一种是单纯的普通脚本；一种是直接以module.exports方式导出脚本，在webpack处理加载中会导入（模块方式，脚本的运行）

关于loader加载流程:先pitch,后loader;每一个Loader可能有自己的pitch和loader函数，对于loader处理顺序规定为，从右向左，从下向上，一个处理的结果传入下一个，由于loader的定义方式，在多个loader chain方式处理时，无法很好的约定保证在每一个loader导出方式可以友好的传入下一个，所以通过pitch方式解决了此问题，通过pitch，劫持停止后面要处理的loader,进行自行处理如何加载其他loader;对于pitch的运行与loader运行相反；

- 关于loader的编写：
 - 1. 满足loader是一个函数
 - 2. loader函数第一个参数接受上一个传入的内容
 - 3. 返回处理后的内容（选择适合的返回方式，普通方式，module.exports方式）
 - 4. 是否需要设置pitch,看需求；是否需求返回内容格式为二进制格式

- 关于loaderRunner
 如何处理和加载pitch,loader,对于entry文件的读取,loader的四种加载方式整合；

 post inline normal pre; 四种loader执行顺序，每一类别满足，从右向左，从下向上


## plugins


## webpack 使用

- 动态观测代码

1. watch 开启 webpack --config webpack.config.js --watch

无法实施刷新浏览器更新

2. webpack-dev-server 添加，配置devServer; 不产生真是文件，读取内存

3. webpack-dev-middleware 结合express或者koa来完成，webpack-dev-middleware会将内容放入到express/koa服务配置指定的目录中；不产生真是文件，读取内存


- 代码的分离

1. entry 多入口指定

2. splitChunksPlugin

配置抽离chunk，或填入入口chunk，或单独为独立chunk

3. es6方式import()或者require.ensure 动态懒加载导入；返回promise处理，可以结合async,await使用

