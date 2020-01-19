const Config = require('@/config')
const mode = Config.mode

const api = {
  // 获取管道线路所有坐标接口
  getGis: 'admin/gis/:id?target=list'
}

if (mode === 'local') {
  for (const k in api) {
    if (api[k].indexOf('?') < 0) {
      api[k] = `${api[k]}?debug=cross`
    } else {
      api[k] = `${api[k]}&debug=cross`
    }
  }
}
export default api
