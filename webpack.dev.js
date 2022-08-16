var webpack = require('webpack');
var path = require('path');

// 编译后自动打开浏览器
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

// 单独样式文件
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var node_modules = path.resolve(__dirname, 'node_modules');

const autoprefixer = require('autoprefixer');

const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './app/assets/css/ant-theme-vars.less'), 'utf8'));

module.exports = {
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        contentBase: './app',
        host: '0.0.0.0',
        port: 2021,
        disableHostCheck: true
    },
    entry: [
        'babel-polyfill',
        'webpack-dev-server/client?http://localhost:2021',
        path.resolve(__dirname, 'app/main.jsx')
    ],
    output: {
        path: __dirname + '/build', //打包输出的路径
        publicPath: '/',  //html引用路径，在这里是本地地址。
        filename: './bundle.js' //打包后的名字
    },
    watchOptions: {
        poll: 1000,
        ignored: ["node_modules"]
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                query: {
                    plugins: [["import", {
                        libraryName: "antd",
                        style: true
                    }]]
                }
            }]
        }, {
            test: /\.scss$/,
            use: ["style-loader",
                {
                    loader: 'css-loader',
                    options: {autoprefixer: true, sourceMap: true, importLoaders: 1}
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        plugins: () => [autoprefixer({overrideBrowserslist: ["last 2 version", "ie 9"]})],
                    },
                }, "sass-loader"]
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.(png|jpg|gif|md)$/,
            use: ['url-loader?limit=8192']
        }, /* {
            test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            use: ['file-loader']
        }, */{
            test: /\.less$/,
            use: ["style-loader", {
                loader: 'css-loader',
                options: {autoprefixer: true, sourceMap: true, importLoaders: 1}
            }, {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    plugins: () => [autoprefixer({overrideBrowserslist: ["last 2 version", "ie 9"]})],
                }
            }, {
                loader: "less-loader",
                options: {
                    modifyVars: themeVariables,
                    javascriptEnabled: true
                }
            }]
        }, {
            test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
            use: ["url-loader?limit=10000&mimetype=application/font-woff"]
        }, {
            test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
            use: ["url-loader?limit=10000&mimetype=application/font-woff"]
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            use: ["url-loader?limit=10000&mimetype=application/octet-stream"]
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            use: ["file-loader"]
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            use: ["url-loader?limit=10000&mimetype=image/svg+xml"],
        }]
    },
    resolve: {
        mainFiles: ["index.web", "index"],
        extensions: [
            '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx',
            '.js',
            '.jsx',
            '.react.js',
            '.less',
            '.scss',
        ],
        mainFields: [
            'browser',
            'main',
            'jsnext:main'
        ],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.join(__dirname, './app')
        ]
    },
    devtool: 'source-map',
    externals: [],
    //插件项
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'API_ENV': JSON.stringify('dev'),
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: 'main.css',
            allChunks: true,
            disable: false
        })
    ]
}
;
