const mix = require('laravel-mix');
const HtmlWebpackPlugin = require('html-webpack-plugin');

mix.disableNotifications();

mix.webpackConfig({
    target: ['electron-main', 'electron-renderer']
});

mix.override(function (webpackConfig) {
    webpackConfig.module.rules.push({
        test: /\.pug$/,
        use: 'pug-loader'
    });
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
        filename: 'assets/index.html',
        template: 'src/pug/index.pug',
        inject: false,
        minify: false
    }));
});

mix.copyDirectory('resources/', 'assets/');
mix.js('src/js/main.js', 'assets/');
mix.js('src/js/app.js', 'assets/').vue();
mix.sass('src/css/app.scss', 'assets/');

mix.extract([
    'axios',
    'vue'
], 'assets/');

mix.dump();
