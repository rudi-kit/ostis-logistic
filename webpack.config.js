var path = require("path");
module.exports = {
    entry: {
        app: ["./map/src/map_component.js"]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/assets/",
        filename: "bundle.js",
        sourceMapFilename: "bundle.map"
    },
    devServer: {
        proxy: [
            {
                context: ["/api", "/static", "/"],
                target: "http://localhost:8000",
                secure: false
            },
            {
                context: ["/sctp"],
                target: "http://localhost:8000",
                secure: false,
                ws: true
            }

        ],
        inline: true,
        hot: true
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
            {test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/},
            {test: /\.css$/, loader: 'css-loader', exclude: /node_modules/}
        ],
    },
    devtool: "cheap-eval-source-map",
};