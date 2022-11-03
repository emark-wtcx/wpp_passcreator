const PACKAGE = require('../../package.json');
const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = function(env, argv) {
    const prod = argv.mode === 'production';
    return {
        mode: prod ? 'production' : 'development',
        devtool: 'cheap-source-map',
        entry: path.resolve(__dirname, './src/index.js'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'pass_creator-activity.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
            ]
        },
        plugins: [
            new CopyPlugin([
                {
                    // you may want to bundle SLDS SASS files with webpack,
                    // we'll keep things simple for this example and just copy SLDS into dist
                    from: path.resolve(__dirname, '../../node_modules/@salesforce-ux/pass_creator/assets'),
                    to: path.resolve(__dirname, 'dist/pass_creator')
                },
            ]),
            new webpack.BannerPlugin(
                `${PACKAGE.author} - ${PACKAGE.description} - pass_creator`
            ),
        ]
    };
};
