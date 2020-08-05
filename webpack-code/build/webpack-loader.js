/*
  测试自实现loader模块功能配置

  这里有一个问题，当file-loader与url-loader都配置时，对于流程操作的控制;
  后期进行修复问题
*/

const path = require('path');
module.exports = {
  entry: {
    main: './src/index.js'
  },
  resolveLoader: {
    // 指定别名地址
    // alias: {
    //   'babel-loader': './loaders/babel-loader.js'
    // },
    // 指定查找位置
    modules: ['./loaders', path.resolve(__dirname, '../', 'node_modules')]
  },

  resolve: {
    modules: ['./loaders', path.resolve(__dirname, '../', 'node_modules')]
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader', 'babel-a', 'babel-b', 'babel-c']//, 'babel-a', 'babel-b', 'babel-c'
      },
      {
        test: /\.(png|gif|jpe?g)$/,
        loader: 'file-loader',
        options: {
          name: '[name][hash].[ext]',
          outputPath: 'images'
        }
      },
      // {
      //   test: /\.(png|gif|jpe?g)$/,
      //   loader: 'url-loader',
      //   options: {
      //     filename: '[name]_[hash].[ext]',
      //     limit: 1024*64
      //   }
      // }
    ]
  }
}