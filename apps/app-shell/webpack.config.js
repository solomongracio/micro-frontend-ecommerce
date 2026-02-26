const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    // Remote URLs — env vars in production, localhost in dev
    const PRODUCT_APP_URL = process.env.PRODUCT_APP_URL || 'http://localhost:3001';
    const CART_APP_URL = process.env.CART_APP_URL || 'http://localhost:3002';

    return {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: isProduction ? 'auto' : 'http://localhost:3000/',
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
                name: 'app_shell',
                remotes: {
                    product_app: `product_app@${PRODUCT_APP_URL}/remoteEntry.js`,
                    cart_app: `cart_app@${CART_APP_URL}/remoteEntry.js`,
                },
                shared: {
                    react: { singleton: true, requiredVersion: '^18.0.0', eager: true },
                    'react-dom': { singleton: true, requiredVersion: '^18.0.0', eager: true },
                    'react-router-dom': { singleton: true, requiredVersion: '^6.0.0', eager: true },
                },
            }),
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
        ],
        devServer: {
            port: 3000,
            historyApiFallback: true,
            hot: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        },
    };
};
