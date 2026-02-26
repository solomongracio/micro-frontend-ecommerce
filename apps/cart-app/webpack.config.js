const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: isProduction ? 'auto' : 'http://localhost:3002/',
            filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
            clean: true,
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                        },
                    },
                },
                {
                    test: /\.module\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    namedExport: false,
                                    localIdentName: isProduction
                                        ? '[hash:base64:8]'
                                        : '[name]__[local]__[hash:base64:5]',
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    exclude: /\.module\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        plugins: [
            new ModuleFederationPlugin({
                name: 'cart_app',
                filename: 'remoteEntry.js',
                exposes: {
                    './CartWidget': './src/components/CartWidget',
                },
                shared: {
                    react: { singleton: true, requiredVersion: '^18.0.0', eager: true },
                    'react-dom': { singleton: true, requiredVersion: '^18.0.0', eager: true },
                },
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
        ],
        devServer: {
            port: 3002,
            hot: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
    };
};
