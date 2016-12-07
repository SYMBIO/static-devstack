import webpack           from 'webpack';
import path              from 'path';
import constants         from './constants';

module.exports = {
    devtool: "source-map",
    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        path.join(constants.SRC_DIR, 'js/main.js')
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader','webpack-module-hot-accept']
            },
            { test: /\.json$/, loader: 'json' }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.join(constants.DIST_DIR, 'js')
    },
    plugins: (function() {
        var plugins = [
            new webpack.HotModuleReplacementPlugin()
        ];
        return plugins;
    })(),
};