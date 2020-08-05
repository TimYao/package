const path = require('path');
const webpackMerge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
// 测试编写loader配置
const webpackLoaderConfig = require('./webpack-loader');
// 常规配置文件
const webpackOtherConfig = require('./webpack-other');
// plugin编写
const webpackPluginsConfig = require('./webpack.plugin.config');

let webpackConfig = {

  context: path.resolve(__dirname, '../'),

  mode: 'development',

  // inline-source-map 将map直接生成到文件中
  devtool: 'cheap-module-source-map',

  output: {
    path: path.resolve(__dirname, '../', 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },

  // devServe: {
  //   // contentBase: './dist'
  // },

  plugins:[
    new CleanWebpackPlugin({
      // 防止watch监测增量变化下删除index.html文件
      cleanStaleWebpackAssets: false
    }),
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    ...webpackPluginsConfig
  ]
};


// webpackConfig = webpackMerge(webpackConfig, webpackLoaderConfig)
webpackConfig = webpackMerge(webpackConfig, webpackOtherConfig)

module.exports = webpackConfig;