const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry:{
        main:'./src/browser/index.ts',
        send:'./src/browser/send.ts',
        register:'./src/browser/register.ts',
        login:'./src/browser/login.ts'
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