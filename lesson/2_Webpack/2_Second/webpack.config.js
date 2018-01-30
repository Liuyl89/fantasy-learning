const path = require('path')
module.exports = {
    entry: {
        app: [path.resolve(__dirname, 'js/main.js')],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }]
        }, {
            test: /\.css$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }],
        }, {
            test: /\.(png|gif|jpg)$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 20000
                },
            }],
        }]
    },
}