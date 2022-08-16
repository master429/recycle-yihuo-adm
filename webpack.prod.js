'use strict';

const path = require('path');
const webpack = require('webpack');
// 产出html模板
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 单独样式文件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const node_modules = path.resolve(__dirname, 'node_modules');
const minimist = require('minimist');
const args = minimist(process.argv.slice(2));
const env = args.env;

const fs = require('fs');
const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './app/assets/css/ant-theme-vars.less'), 'utf8'));

console.log('this is a ..................' + args.env + '.........environment');


module.exports = {
    entry: [
        'babel-polyfill',
        path.resolve(__dirname, 'app/main.jsx')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "[name].[hash:8].js",
        publicPath: './'
    },

    resolve: {
        mainFiles: ["index.web", "index"],
        extensions: [
            '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx',
            '.js',
            '.jsx',
            '.react.js',
            '.less', '.scss', '.css'
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
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
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
            })
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader']
            })
        }, {
            test: /\.(png|jpg|gif|md)$/,
            use: ['url-loader?limit=8192']
        }, /*{
         test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9=&.]+)?$/,
         use: ['file-loader']
         }, */ {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {autoprefixer: true, sourceMap: true, importLoaders: 1}
                },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: () => [autoprefixer({overrideBrowserslist: ["last 2 version", "ie 9"]})],
                        },
                    }, {
                        loader: "less-loader",
                        options: {
                            modifyVars: themeVariables, javascriptEnabled: true
                        }
                    }]
            })
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
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
                'API_ENV': JSON.stringify(env),
            }
        }),
        new ExtractTextPlugin({filename: 'main.[hash:8].css', disable: false, allChunks: true}),
        new OptimizeCssAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: {
                discardComments: {removeAll: true},
                safe: true, // crucial in order not to break anything
                autoprefixer: {
                    overrideBrowserslist: [
                        "last 2 version",
                        "ie 9",
                    ],
                    cascade: true,
                    remove: false
                }
            },
            canPrint: true
        }),
        new HtmlWebpackPlugin({
            title: 'your app title',
            template: './app/index.production.html',
            favicon: path.resolve('./app/favicon.ico'),
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        warnings: false,
                        drop_debugger: true,
                        drop_console: true
                    }
                }
            }),
        ]
    }
};
