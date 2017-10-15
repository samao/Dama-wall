const webpack = require('webpack');
const path = require('path');
const { entry } = require('./webpack/conf')

module.exports = {
    entry,
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
            output:{
                comments:false,
                'ascii_only':true,
                beautify:false,
            },
            compress:{
                warnings:false,
            },
        }),
        new webpack.DefinePlugin({
            __VERSION__:`"${require('./package').version}"`
        })
    ],
    externals: {
        'jquery':'jQuery'
    }
}