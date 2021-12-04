// 引入路径处理类
const path = require('path')
// 引入创建 HTML 的插件
const HTMLWebpackPlugin = require('html-webpack-plugin')
// 引入自动清理打包 dist 文件夹, 防止未更新
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

/** @type {import('webpack').Configuration} */
const config = {
    // 指定入口文件
    entry: './src/index.ts',
    // 指定输出文件
    output: {
        // 指定输出位置
        path: path.resolve(__dirname, 'dist'),
        // 指定输出文件名
        filename: 'bundle.js',

        environment: {
            // 告诉 webpack 别使用箭头函数, 因为生成的代码是自执行函数, 是一个箭头函数, 低版本可能不支持
            arrowFunction: false,
            // 可能不支持 const 类型
            const: false
        }
    },

    // 指定打包时要使用的各种模块
    module: {
        // 指定要加载的规则
        rules: [
            // 配置 babel
            {
                // 指定要应用的文件
                test: /\.tsx?$/,
                // 要使用的 loader, 顺序是右后向前执行
                use: [
                    {
                        // 指定加载器
                        loader: 'babel-loader',
                        // 指定选项
                        options: {
                            // 指定预定义的环境
                            presets: [
                                [
                                    // 指定环境的插件
                                    "@babel/preset-env",
                                    // 配置信息
                                    {
                                        // 要兼容的目标浏览器
                                        targets: {
                                            chrome: "58",
                                            ie: "11"
                                        },
                                        // 指定 corejs 的版本
                                        corejs: "3",
                                        // 使用 corejs 的方式, usage 表示按需加载
                                        useBuiltIns: "usage"
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader'
                ],
                // 要排除应用的文件
                exclude: /node_modules/
            },

            // 设置支持 less 文件的处理
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    // 引入 postcss, 为了让 css 支持多版本, 可以添加相应的前缀
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        'postcss-preset-env',
                                        {
                                            browsers: 'last 2 versions'
                                        }
                                    ]
                                ]
                            }
                        }
                    },
                    'less-loader'
                ]
            }
        ]
    },

    // 引入要使用的插件
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            title: '贪吃蛇游戏',
            template: './src/index.html'
        })
    ],

    // 由于 webpack 并不知道如何解析模块, 因此需要提供解析的文件类型(主要是后缀)
    resolve: {
        extensions: ['.ts', '.js']
    },

    // 指定编译的模式
    mode: 'development'
}
module.exports = config