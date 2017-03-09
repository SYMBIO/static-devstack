import webpack from 'webpack';
import path from 'path';
import constants from './constants';

module.exports = {
    devtool: 'source-map',
    entry: [
        'webpack-hot-middleware/client',
        'babel-polyfill',
        path.join(constants.SRC_DIR, 'js/main.js')
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'webpack-module-hot-accept']
            }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.join(constants.DIST_DIR, 'js')
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            PRODUCTION: false,
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
};
