import {merge} from 'webpack-merge';
import common from './webpack.common.mjs';
import path from 'node:path';
import process from 'node:process'

const localProxy = {
    target: 'http://localhost:8081',
    // ignorePath: false,
    changeOrigin: true,
    secure: false,
};

export default merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        allowedHosts: 'auto',
        static: [
            {directory: path.join(process.cwd(), 'public'), watch: false},
            {directory: path.join(process.cwd()), watch: false}
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
