const Config = require('@/config')

const mode = Config.mode

const formApiMap = {
  // 创建活动模板接口
  createForm: 'admin/actTemplate?target=save',
  // 根据模板id获取模板具体表单信息
  getFormData: 'admin/actTemplate/:id?target=read',
  // 修改活动模板信息接口
  updateForm: 'admin/actTemplate/:id?target=update',
  // 删除模板接口
  deleteForm: '/admin/actTemplate/1?target=del'
}

if (mode === 'local') {
  for (const k in formApiMap) {
    if (formApiMap[k].indexOf('?') < 0) {
      formApiMap[k] = `${formApiMap[k]}?debug=cross`
    } else {
      formApiMap[k] = `${formApiMap[k]}&debug=cross`
    }
  }
}

export default formApiMap
