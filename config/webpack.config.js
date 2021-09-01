//用于修改webpack默认配置
const {
  override,
  addWebpackAlias,
  fixBabelImports,
  overrideDevServer
} = require('customize-cra')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const webpack = require('webpack')
const path = require('path')
const { configs } = require('eslint-plugin-prettier')

// 分析打包大小
const addAnalyze = () => (config) => {
  let plugins = [new BundleAnalyzerPlugin({ analyzerPort: 7777 })]

  config.plugins = [...config.plugins, ...plugins]
  return config
}

// 打包体积优化
const addOptimization = () => (config) => {
  if (process.env.NODE_ENV === 'production') {
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          },
          default: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true
          }
        }
      }
    }

    // 关闭sourceMap
    config.devtool = false
    // 添加js打包gzip配置
    config.plugins.push(
      new CompressionWebpackPlugin({
        test: /\.js$|\.css$/,
        threshold: 1024
      }),
      new webpack.optimize.AggressiveMergingPlugin(), //合并块
      new webpack.optimize.ModuleConcatenationPlugin()
    )
  }

  return config
}

// server
const passConfig = () => (config) => {
  return {
    ...config,
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/api': {
        target: 'http://www.ylcx.shop',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}

module.exports = {
  webpack: override(
    // addAnalyze(),
    // 配置路径别名
    addWebpackAlias({
      '@': path.resolve('src')
    }),
    addOptimization(),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css'
    })
  ),
  devServer: overrideDevServer(passConfig())
}
