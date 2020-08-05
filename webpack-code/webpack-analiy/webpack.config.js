const path = require('path');
//html-webpack-plugin 可以 new多个的
module.exports = {
    context:process.cwd(),//当前工作目录
    mode:'development',
    devtool:false,
    entry:'./src/index.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js',
    },
    module:{
        rules:[
            {
                test:/\.less$/,
                use:['style-loader','less-loader']
            }
        ]
    },
    plugins:[

    ]
}