const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = (env, args) => ({
    mode: args.mode === 'development' ? 'development' : 'production',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[fullhash].js',
    },
    resolve: {
        extensions: ['.wasm', '.ts', '.tsx', '.mjs', '.cjs', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader',
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    devServer: {
        open: true,
        static: path.resolve(__dirname, 'dist'),
        port: 6969,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: 'index.html',
            filename: 'index.html',
            favicon: './src/assets/favicon.ico',
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
    },
});
