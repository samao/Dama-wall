const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry:{

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
    externals:[]
}