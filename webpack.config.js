var path = require("path");

module.exports = {
    entry: {
        app: ["./index.js"]
    },
    output: {
        path: __dirname + "/dist",
        filename: "map.js"
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
            {test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/},
            {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192
                }
            }
        ],
    },
    devtool: "cheap-eval-source-map",
};
