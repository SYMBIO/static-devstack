import webpack           from 'webpack';
import path              from 'path';
import constants         from './constants';

module.exports = {
    entry: path.join(constants.SRC_DIR, 'js/main.js'),
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            { test: /\.json$/, loader: 'json' }            
        ]
    },
    output: {
        filename: 'js/main.js',
        path: path.join(constants.DIST_DIR)
    },
    plugins: (function() {
        var plugins = [
            new webpack.DefinePlugin({
                'process.env': {
                  NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                  warnings: false
                }
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.DedupePlugin(),
        ];
        return plugins;
    })(),
};



