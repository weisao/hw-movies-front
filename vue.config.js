module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  },
  devServer: {
    port: 8080, // 端口号
    // https: false, // https:{type:Boolean}
    // 配置多个代理
    proxy: {
      '/font': {
        target: 'http://localhost:8000/', // 要访问的接口域名
        ws: true, // 是否启用websockets
        changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          '^/font': '/', // 这里理解成用'/api'代替target里面的地址,比如我要调用'http://localhost:8088/user/list'，直接写'/api/user/list'即可
        },
      },
    },
  },
}
