import webpack from 'webpack';
import path from 'path';
import { SRC, DIST } from './constants';

module.exports = {
    devtool: 'source-map',
    entry: [
        'webpack-hot-middleware/client',
        'babel-polyfill',
        path.join(SRC, 'js/main.js')
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    output: {
        filename: 'main.js',
        path: path.join(DIST, 'js')
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            PRODUCTION: false,
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
};
