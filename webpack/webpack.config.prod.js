import webpack           from 'webpack';
import path              from 'path';
import constants         from './constants';

module.exports = {
    entry: path.join(constants.SRC_DIR, 'js/main.js'),
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
        filename: 'js/main.js',
        path: path.join(constants.DIST_DIR)
    },
    plugins: [
        new webpack.DefinePlugin({
            'PRODUCTION': true,
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};