module.exports = {
  mode: process.env.VUE_APP_ENV_MODE,
  local: { // 本地测试环境配置
    url: {
      baseURL: '/', // 接口域名地址
      timeout: 60000
    }
  },
  dev: {// 开发联测环境配置
    url: {
      baseURL: 'http://api.leizikeji.top/',
      timeout: 60000
    }
  },
  prod: {// 生产环境配置
    url: {
      baseURL: window.$requestHttp,
      timeout: 60000 // 超时时间
    }
  }
}

