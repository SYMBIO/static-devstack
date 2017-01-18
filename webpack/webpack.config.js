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
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader','webpack-module-hot-accept']
            }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.join(constants.DIST_DIR, 'js')
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};