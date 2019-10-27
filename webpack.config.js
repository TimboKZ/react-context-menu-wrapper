const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|lib)/,
                loader: 'babel-loader',
            },
            {
                test: /\.tsx?$/,
                use: [
                    { loader: require.resolve('awesome-typescript-loader') },
                    { loader: require.resolve('eslint-loader') },
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx'],
        alias: {
            react: path.resolve(__dirname, 'node_modules', 'react'),
            'react-context-menu-wrapper': path.resolve(__dirname, 'src'),
        },
    },
};
