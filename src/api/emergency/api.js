const Config = require('@/config')
const mode = Config.mode

const api = {
// 应急人员
// 添加应急人员接口
  addStaff: 'admin/emergeWorker?target=save',
  // 获取应急人员列表接口
  getStaffList: 'admin/emergeWorker?target=list',
  // 删除应急人员接口
  deleteStaff: 'admin/emergeWorker/1?target=delete',
  // 修改应急人员接口
  editStaff: 'admin/emergeWorker/:id?target=edit',
  // 获取应急人员详情接口
  getStaffDetail: 'admin/emergeWorker/:id?target=detail',

  // 消防队伍
  // 获取消防队伍列表接口
  getFireTeamList: 'admin/fireTeam?target=list',
  // 添加消防队伍接口
  addFireTeam: 'admin/fireTeam?target=save',
  // 修改消防队伍信息接口
  editFireTeam: 'admin/fireTeam/:id?target=edit',
  // 删除消防队伍接口
  deleteFireTeam: 'admin/fireTeam/1?target=delete',
  // 获取消防队伍详情接口
  getFireTeamDetail: 'admin/fireTeam/:id?target=detail',

  // 应急车辆信息
  // 添加应急车辆接口
  addCar: 'admin/car?target=save',
  // 获取应急车辆列表
  getCarList: 'admin/car?target=list',
  // 修改应急车辆信息接口
  editCar: 'admin/car/:id?target=edit',
  // 删除应急车辆接口
  deleteCar: 'admin/car/1?target=delete',
  // 获取应急车辆详情接口
  getCarDetail: 'admin/car/:id?target=detail',

  // 应急物资信息
  // 添加应急物资接口
  addSupply: 'admin/material?target=save',
  // 获取应急物资列表接口
  getSupplyList: 'admin/material?target=list',
  // 修改应急物资信息
  editSupply: 'admin/material/:id?target=edit',
  // 删除应急物资接口
  deleteSupply: 'admin/material/1?target=delete',
  // 获取应急物资详情接口
  getSupplyDetail: 'admin/material/:id?target=detail',

  // 外协单位信息
  // 添加外协单位接口
  addCooperation: 'admin/assistUnit?target=save',
  // 修改外协单位接口
  editCooperation: 'admin/assistUnit/:id?target=edit',
  // 获取外协单位列表接口
  getCooperationList: 'admin/assistUnit?target=list',
  // 删除外协单位接口
  deleteCooperation: 'admin/assistUnit/1?target=delete',
  // 获取外协单位详情接口
  getCooperationDetail: 'admin/assistUnit/:id?target=detail',

  // 处置措施管理
  // 添加处置措施接口
  addMeasure: 'admin/dealMeasure?target=save',
  // 获取处置措施列表接口
  getMeasureList: 'admin/dealMeasure?target=list',
  // 修改处置措施接口
  editMeasure: 'admin/dealMeasure?target=edit',
  // 删除处置措施接口
  deleteMeasure: 'admin/dealMeasure/1?target=delete',
  // 获取处置措施详情接口
  getMeasureDetail: 'admin/dealMeasure/:id?target=detail',

  // 应急预案管理
  // 添加应急预案接口
  addPlan: 'admin/accident?target=save',
  // 获取应急预案列表接口
  getPlanList: 'admin/accident?target=list',
  // 修改应急预案
  editPlan: 'admin/accident/:id?target=edit',
  // 获取应急详情接口
  getPlanDetail: 'admin/accident/:id?target=detail',
  // 删除应急预案接口
  deletePlan: 'admin/accident/1?target=delete',

  // 处理结果管理
  // 新增事故接口
  addResult: 'admin/fault?target=save',
  // 获取事故处理列表接口
  getResultList: 'admin/fault?target=list',
  // 处理事故接口
  editResult: 'admin/fault/:id?target=edit',
  // 删除事故接口
  deleteResult: 'admin/fault/1?target=delete',
  // 获取事故详情接口
  getResultDetail: 'admin/fault/:id?target=detail',

  // 应急演练
  // 添加应急演练接口
  addExercise: 'admin/drill?target=save',
  // 获取应急演练管理列表
  getExerciseList: 'admin/drill?target=list',
  // 修改应急演练接口
  editExercise: 'admin/drill/:id?target=edit',
  // 删除应急演练接口
  deleteExercise: 'admin/drill/1?target=delete',

  // 应急演练计划
  // 添加计划接口
  addExercisePlan: 'admin/drillPlan?target=save',
  // 获取列表接口
  getExercisePlanList: 'admin/drillPlan?target=list',
  // 修改接口
  editExercisePlan: 'admin/drillPlan/:id?target=edit',
  // 删除接口
  deleteExercisePlan: 'admin/drillPlan/1?target=delete',

  // 事故等级管理
  // 列表
  getAccidentLevelList: 'admin/accidentLevel',
  // 详情
  getAccidentLevelDetail: 'admin/accidentLevel/:id',
  // 创建
  addAccidentLevel: 'admin/accidentLevel',
  // 编辑
  editAccidentLevel: 'admin/accidentLevel/:id',
  // 删除
  deleteAccidentLevel: 'admin/accidentLevel/:id',

  // 事故类型管理
  // 列表
  getAccidentTypeList: 'admin/accidentType',
  // 详情
  getAccidentTypeDetail: 'admin/accidentType/:id',
  // 创建
  addAccidentType: 'admin/accidentType',
  // 编辑
  editAccidentType: 'admin/accidentType/:id',
  // 删除
  deleteAccidentType: 'admin/accidentType/:id'
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
