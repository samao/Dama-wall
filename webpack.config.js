const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry:{
        main:'./src/browser/index.ts'
    },
    output:{
        path:path.resolve(__dirname,'dist','browser'),
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
            {test: /\.tsx?$/, loader:'ts-loader?'+JSON.stringify({
                configFile:'tsconfig.browser.json'
            })}
        ]
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                
            },
            output:{
                
            }
        }),
        new webpack.DefinePlugin({
            __VERSION__:`"${require('./package').version}"`
        })
    ],
    externals:[]
}