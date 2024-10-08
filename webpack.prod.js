const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.mjs');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');


module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {ecma: 8},
                    compress: {ecma: 5, warnings: false, inline: 2},
                    mangle: {safari10: true},
                    output: {ecma: 5, comments: false, ascii_only: true}
                },
                parallel: true,
                extractComments: false,
                // cache: true,
            })
        ],
    },
    output: {
        filename: "[name].[contenthash:8].js",
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin(),
    ]
});
