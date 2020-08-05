/*
  测试自实现loader模块功能配置

  这里有一个问题，当file-loader与url-loader都配置时，对于流程操作的控制;
  后期进行修复问题
*/

const path = require('path');
module.exports = {
  entry: {

    // main: './src/index.js',

    // 测试失败
    // main: {import: './src/index.js', dependOn: 'shared'},
    // other: {import: './src/other.js', dependOn: 'shared'},
    // shared: 'lodash'

    // main: './src/index.js',
    // split: './src/split.js',
    // other: './src/other.js'

    // 测试自写import-loader
    importJs: './src/import.js'
  },

  // output: {
  //   // 动态加载模块，懒加载
  //   chunkFilename: '[name].chunk.bundle.js',
  // },

  resolve: {
    modules: [path.resolve(__dirname, '../', 'node_modules')]
  },

  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  useBuiltIns: 'usage'
                }]
              ]
            }
          },
          {
            // 自实现loader功能
            loader: path.resolve(__dirname, '../loaders/import-loader')
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|gif|jpe?g)$/,
        loader: 'file-loader',
        options: {
          name: '[name][hash].[ext]',
          outputPath: 'images'
        }
      },
      {
        test: /\.(png|gif|jpe?g)$/,
        loader: 'url-loader',
        options: {
          filename: '[name]_[hash].[ext]',
          limit: 1024*64
        }
      }
    ]
  },

  // 分离chunks
  // optimization: {
  //   splitChunks: {
  //     // chunks: 'initial',
  //     // // maxInitialRequests:3,
  //     // minChunks: 1,
  //     // name: 'ss'
  //     //chunks: 'all',
  //     cacheGroups: {
  //       defaultVendors: {
  //         filename: '[name].bundles.js',
  //         idHint: 'vendors'
  //       }
  //       // json: {
  //       //   type: 'json'
  //       // }
  //       // commons: {
  //       //   test: /[\\/]node_modules[\\/]/,
  //       //   automaticNamePrefix: 'prx',
  //       //   // name(module, chunks, cacheGroupKey) {
  //       //   //   const moduleFileName = module.identifier().split('/').reduceRight(item => item);
  //       //   //   const allChunksNames = chunks.map((item) => item.name).join('~');
  //       //   //   // console.log('========', module);
  //       //   //   console.log(cacheGroupKey, allChunksNames, moduleFileName)
  //       //   //   return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
  //       //   // },
  //       //   chunks: 'all'
  //       // }
  //       // other: {
  //       //   // test: /[\\/]node_modules[\\/]/,
  //       //   chunks: 'initial'
  //       // }
  //     }
  //   }
  // }
}