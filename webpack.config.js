const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry:{
        s
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js'
    },
    resolve:{
        extensions:[
            '.ts',
            '.tsx',
            '.json',
            '.js'
        ]
    },
    module:{
        loaders:[
            {test: /\.tsx?$/, loader:'ts-loader'}
        ]
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                
            },
            output:{
                
            }
        })
    ],
    externals:[]
}