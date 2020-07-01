const Config = require('@/config')
const mode = Config.mode

const api = {
  // 检查与维修
  // 设备维护管理页面
  // 添加设备维护接口
  addAssetEgi: 'admin/assetEgi?target=save',
  // 获取设备维护列表接口
  getAssetEgiList: 'admin/assetEgi?target=list',
  // 获取设备维护详情接口
  getAssetEgiDetail: 'admin/assetEgi/:id?target=detail',
  // 修改设备维护信息
  editAssetEgi: 'admin/assetEgi/:id?target=edit',
  // 删除设备维护信息
  deleteAssetEgi: 'admin/assetEgi/1?target=delete',
  // 设备类型下拉选择
  getAssetTypeState: 'admin/pipeAsset/:id?target=pipeEquipment',
  // 设备名称下拉列表
  getAssetNameState: 'admin/pipeAsset/:id?target=pipeAsset',
  // 获取维护记录
  getMaintainRecord: 'admin/assetEgi?target=recordList',
  // 获取维护记录(新)
  getMaintainRecord2: 'admin/assetEgiPeriod?target=list',
  // 删除维护记录
  deleteMaintainRecord: 'admin/egiRecord/1?target=delete',
  // 修改维护记录
  editMaintainRecord: 'admin/egiRecord/:id?target=edit',
  // 完成维护
  finishMaintain: 'admin/assetEgi/:id?target=finish',

  // 维护记录表单项
  // 保存(低点排水查油品质量检测)
  saveMaintainTable: 'admin/table?target=save',
  // 获取维护记录表单详情
  getMaintainTableDetail: 'admin/table/:id?target=detail',
  // 表单页(全部删除|删除当前页)
  deleteMaintainTable: 'admin/table/:id?target=del',

  // 设备维修管理
  // 新增设备维修接口
  addAssetService: 'admin/assetService?target=save',
  // 获取维修单详情接口
  getAssetServiceDetail: 'admin/assetService/:id?target=detail',
  // 获取维修单列表接口
  getAssetServiceList: 'admin/assetService?target=list',
  // 修改维修单接口
  editAssetService: 'admin/assetService/:id?target=edit',
  // 完成维修接口
  completeAssetService: 'admin/assetService/:id?target=finish',
  // 删除维修单接口
  deleteAssetService: 'admin/assetService/1?target=delete',

  // 故障类型管理
  // 添加故障类型接口
  addErrorType: 'admin/errorType?target=save',
  // 获取故障类型列表接口
  getErrorTypeList: 'admin/errorType?target=list',
  // 修改故障类型接口
  editErrorType: 'admin/errorType/:id?target=edit',
  // 删除故障类型接口
  deleteErrorType: 'admin/errorType/1?target=delete',

  // 维修数据趋势分析 故障类型分类统计 设备故障统计 工单统计 设备管理分析图表
  echartsData: 'admin/assetService',
  // 设备完好率图表
  getIntactChart: 'admin/asset',
  // 设备台账
  getAssetAccount: 'admin/asset',

  // 设备维护列表（新）
  getEquipmentMatainList: 'admin/assetEgiPeriod?target=egiTableList',
  // 获取导出表单列表
  getEquipmentMatainDetail: 'admin/exportTable/:id',

  // 维护登记列表
  getMaintainRegisterList: 'admin/assetEgiPeriod/:id?target=list',
  // 根据设备类型获取对应维护表单列表
  getAssetFormList: 'admin/assetEgiPeriod?target=table',
  // 保存维护登记
  saveMaintainRegister: 'admin/assetEgiPeriod?target=egi',
  // 查看维护登记详情
  getMaintainRegisterDetail: 'admin/assetEgiPeriod/:id?target=detail'
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
