// 对css进行js一些相关操作通过一些js插件
const postcss = require("postcss");
const {stringifyRequest} = require("loader-utils");
// 解析css语法树
const Tokenizer = require("css-selector-tokenizer");
// const css = '@import "b.css";.a{color:red};.div{background: url("./img/1.png")}';

function loader(source) {
  const cssPlugin = (options) => {
    return function(cssRoot) {
      // 对规则为import导入的标签删除,并保留导入地址
      cssRoot.walkAtRules(/^import$/, (rule) => {
        // console.log(rule);
        rule.remove();
        options.imports.push(rule.params.slice(1, -1));
      })
      // 遍历样式值查找url
      cssRoot.walkDecls((decl) => {
        // 转换为css ast
        const values = Tokenizer.parseValues(decl.value);
        // ast节点下遍历查找
        values.nodes.forEach((value) => {
          value.nodes.forEach((item) => {
            if (item.type === 'url') {
              let str = stringifyRequest(this, item.url);
              str = '`+require('+str+')+`';
              item.url = str;
            }
          })
        })
        // 遍历完后重新写入语法树转换后内容
        decl.value = Tokenizer.stringifyValues(values);
        // 这里防止双引号转义
        // decl.value.replace(/[^]*require\(([^\\\(\)]+)\)[^]*/mig, (m, n) => {
        //   console.log('------',n);
        // });
        decl.value = decl.value.replace(/\\/g, '');
        //console.log('=====', decl.value);
      })
    }
  }

  const handlerImport = (result) => {
    const importCss = options.imports.map((url) => {
      return '`+require(' +
          stringifyRequest(this, '!!css-loader!' + url) +
          ')+`'
    }).join("\r\n");
    return {
      result,
      importCss
    };
  }

  //module.exports=``+require("!!css-loader!b.css")+`.a{color:red};.div{background: url("`+require(\"./img/1.png\")+`")}`
  const callback = this.async();
  const options = {imports:[]};
  const pipeline = postcss([cssPlugin(options)]);
  pipeline.process(source, {from: this.resourcePath, to: undefined}).then(handlerImport).then((result) => {
    console.log('module.exports=`'+(result.importCss)+'\n'+(result.result.css)+'`');
    callback(null, 'module.exports=`'+(result.importCss)+'\n'+(result.result.css)+'`');
  })
}

module.exports = loader