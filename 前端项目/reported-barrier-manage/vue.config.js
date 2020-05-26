//配置文件别名
const path = require('path');
//引用Jquery
var webpack = require('webpack')
function resolve(dir) {
  return path.resolve(__dirname, dir)
}
module.exports = {
  configureWebpack: {
    //配置别名
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        'assets': resolve('src/assets'),
        'css': resolve('src/assets/css'),
        'images': resolve('src/assets/images'),
        'views': resolve('src/views'),
        'components': resolve('src/components'),
        'api': resolve('src/api'),
        'mixins': resolve('src/mixins'),
        'store': resolve('src/store'),
        'service': resolve('src/service'),
        'utils': resolve('src/utils'),
      }
    },
    //引用Jquery
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      }),
      // new webpack.HotModuleReplacementPlugin(),
    ]
  },
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    //固定端口
    port: 8036,
    //开启热更新
    hot: false,
    //打开固定浏览器
    open: 'Google Chrome'
  },
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
  },
  //关闭source map
  productionSourceMap: false,
  outputDir: 'dist',
  assetsDir: 'static',
  publicPath: './'
}