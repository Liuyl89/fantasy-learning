const path = require('path')
module.exports = {
    entry: {
        app: [path.resolve(__dirname, 'js/main.js')],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
}