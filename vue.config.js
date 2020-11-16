const path = require('path');
const fs = require('fs');
// const CompressionPlugin = require("compression-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
//   .BundleAnalyzerPlugin;

function resolve(dir) {
  return path.join(__dirname, dir);
}

const chunks = {
  libs: {
    name: 'chunk-libs',
    test: /[\\/]node_modules[\\/]/,
    priority: 10,
    chunks: 'initial', // only package third parties that are initially dependent
  },
  // iview: {
  //   name: "chunk-iview", // split elementUI into a single package
  //   priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
  //   test: /[\\/]node_modules[\\/]iview(.*)/ // in order to adapt to cnpm
  // },
  // commons: {
  //   name: "chunk-commons",
  //   test: resolve("src/components"), // can customize your rules
  //   minChunks: 2, //  minimum common number
  //   priority: 5,
  //   reuseExistingChunk: true
  // },
  // echarts: {
  //   name: "chunk-echarts",
  //   test: /[\\/]node_modules[\\/]echarts(.*)/, // can customize your rules
  //   priority: 20
  // },
  // easemob: {
  //   name: "chunk-easemob",
  //   test: /[\\/]node_modules[\\/]easemob-websdk(.*)/, // can customize your rules
  //   priority: 20
  // },
  // kindeditor: {
  //   name: "chunk-kindeditor",
  //   test: /[\\/]node_modules[\\/]kindeditor(.*)/, // can customize your rules
  //   priority: 20
  // },
  // recorder: {
  //   name: "chunk-recorder",
  //   test: /[\\/]node_modules[\\/]benz-amr-recorder(.*)/, // can customize your rules
  //   priority: 20
  // }
};

fs.readdirSync(resolve('src/views')).forEach(item => {
  const stat = fs.statSync(resolve('src/views/') + item);
  if (stat.isDirectory() === true) {
    chunks[item] = {
      name: `chunk-${item}`,
      test: resolve(`src/views/${item}`), // can customize your rules
      minChunks: 2, //  minimum common number
      priority: 6,
      reuseExistingChunk: true,
    };
  }
});

module.exports = {
  /** 区分打包环境与开发环境
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
   */
  // 项目部署的基础路径
  // 我们默认假设你的应用将会部署在域名的根部,
  // 例如 https://www.my-app.com/
  // 如果你的应用部署在一个子路径下，那么你需要在这里
  // 指定子路径。比如将你的应用部署在
  // https://www.foobar.com/my-app/
  // 那么将这个值改为 '/my-app/'
  publicPath: '/',
  outputDir: 'dist', // where to put static assets (js/css/img/font/...) // 是否在保存时使用‘eslint-loader’进行检查 // 有效值: true | false | 'error' // 当设置为‘error’时，检查出的错误会触发编译失败
  lintOnSave: true, // 使用带有浏览器内编译器的完整构建版本 // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  runtimeCompiler: true, // babel-loader默认会跳过`node_modules`依赖. // 通过这个选项可以显示转译一个依赖
  transpileDependencies: [
    /* string or regex */
  ], // 是否为生产环境构建生成sourceMap?

  productionSourceMap: false, // 调整内部的webpack配置. // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    plugins: [
      // new BundleAnalyzerPlugin()
      // new CompressionPlugin({
      //   test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
      //   threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
      //   deleteOriginalAssets: false // 是否删除原文件
      // })
    ],
  },
  chainWebpack: config => {
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test
  },

  parallel: require('os').cpus().length > 1, // PWA 插件相关配置 // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa

  pwa: {}, // configure webpack-dev-server behavior
  devServer: {
    port: 8080,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
  }, // 第三方插件配置

  pluginOptions: {
    // ...
  },
};
