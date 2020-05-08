// const Config = require('@/config')

// const mode = Config.mode

const api = {
  // // 上传图片接口
  uploadImage: 'admin/common/uploadImg',
  // 获取管道状态字典列表接口
  getPipeState: 'admin/pipeState?target=list',
  // 获取管道下拉列表接口
  getBelongPipe: 'admin/pipe?target=select',
  // 获取事故类型列表
  getAccidentType: 'admin/accident?target=type',
  // 获取事故等级列表
  getAccidentLevel: 'admin/accident?target=level',
  // 应急预案下拉选择列表接口
  getResultPlanType: 'admin/accident?target=select',
  // 计划状态下拉列表
  getExercisePlanState: 'admin/drillPlan?target=select',
  // 获取维修方式列表(下拉)
  getInspectTypeState: 'admin/style?target=list',
  // 获取故障类型列表
  getFaultTypeState: 'admin/errorType?target=list',
  // 上传文件
  uploadFile: 'admin/common/upload',
  // 下载文件
  downFile: 'admin/common/download',
  // 获取维护表单下拉列表
  getMaintainSelect: 'admin/table?target=list',
  // 维护|报警弹窗提示
  getWarinig: 'admin/attention',
  // 获取风险等级下拉
  getAccidentLevelSelect: 'admin/accidentLevel'
}

// local模式接口添加 debug=cross
// if (mode === 'local') {
//   for (const k in api) {
//     if (api[k].indexOf('?') < 0) {
//       api[k] = `${api[k]}?debug=cross`
//     } else {
//       api[k] = `${api[k]}&debug=cross`
//     }
//   }
// }

export default api
