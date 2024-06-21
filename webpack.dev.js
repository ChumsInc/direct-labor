const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const path = require('path');

const localProxy = {
    target: 'http://localhost:8081',
    // ignorePath: false,
    changeOrigin: true,
    secure: false,
};

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        allowedHosts: 'auto',
        static: [
            {directory: path.join(__dirname, 'public'), watch: false},
            {directory: path.join(__dirname), watch: false}
        ],
        hot: true,
        proxy: [
            {context: ['/api', '/node_modules'], ...localProxy}
        ],
        historyApiFallback: {
            rewrites: [
                {from: /^apps\/direct-labor/, to: '/'}
            ]
        },
        watchFiles: 'src/**/*',
    },
    plugins: []
});
