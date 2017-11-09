var path = require("path")
module.exports = {
    entry: {
        app: ["./map/src/map_component.js"]
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/assets/",
        filename: "bundle.js"
    },
    devServer: {
        proxy: [
            {
                context: ["/api", "/static","/"],
                target: "http://localhost:8000",
                secure: false
            },
            {
                context: ["/sctp"],
                target: "http://localhost:8000",
                secure: false,
                ws: true
            }

        ]
    }
};