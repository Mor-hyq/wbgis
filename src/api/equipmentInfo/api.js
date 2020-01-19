const Config = require('@/config')
const mode = Config.mode

const api = {
  // 管道管理页面->
  // 新增管道接口
  addPipe: 'admin/pipe?target=save',
  // 获取管道信息列表接口
  getPipeList: 'admin/pipe?target=list',
  // 获取管道详情接口
  getPipeDetail: 'admin/pipe/:id?target=detail',
  // 删除管道信息接口
  deletePipe: 'admin/pipe/1?target=delete',
  // 编辑管道信息
  editPipe: 'admin/pipe/:id?target=update',
  // 获取管道关联设备列表
  getPipeLinkList: 'admin/pipeAsset?target=list',
  // 关联设备接口
  linkAsset: 'admin/pipeAsset?target=save',
  // 取消关联
  unlinkAsset: 'admin/pipeAsset/1?target=del',

  // 管道路由管理页面->
  // 新增管道路由接口
  addPipeRoute: 'admin/route?target=save',
  // 获取管道路由列表接口
  getPipeRouteList: 'admin/route?target=list',
  // 删除管道路由接口
  deletePipeRoute: 'admin/route/1?target=delete',
  // 修改管道路由接口
  editPipeRoute: 'admin/route/:id?target=edit',
  // 获取管道路由详情接口
  getPipeDRouteDetail: 'admin/route/:id?target=detail',
  // 修改排序接口
  updatePipeSort: 'admin/route/:id?target=sort',
  // 导入管道路由信息
  importPipeRoute: 'admin/route?target=importRoute',

  // 设备基础信息
  // 设备类型
  // 获取设备列表
  getEquipmentTypeList: 'admin/equipment',
  // 获取设备类型详情
  getEquipmentTypeDetail: 'admin/equipment/:id',
  // 创建设备类型
  addEquipmentType: 'admin/equipment',
  // 编辑设备类型
  editEquipmentType: 'admin/equipment/:id',
  // 删除设备类型
  deleteEquipmentType: 'admin/equipment/:id',

  // 字段
  // 获取字段列表
  getFieldList: 'admin/field',
  // 获取字段详情
  getFieldDetail: 'admin/field/:id',
  // 创建字段
  addField: 'admin/field',
  // 删除字段
  deleteField: 'admin/field/:id',

  // 设备资产
  // 获取设备资产列表
  getAssetList: 'admin/asset',
  // 获取设备资产详情
  getAssetDetail: 'admin/asset/:id',
  // 创建设备资产
  addAsset: 'admin/asset',
  // 编辑设备资产
  editAsset: 'admin/asset/:id',
  // 删除设备资产
  deleteAsset: 'admin/asset/:id',
  // 设备类型统计图
  getAssetChart: 'admin/asset',
  // 资料管理
  // 列表
  getFileList: 'admin/file',
  // 详情
  getFileDetail: 'admin/file/:id',
  // 创建
  addFile: 'admin/file',
  // 更新
  editFile: 'admin/file/:id',
  // 删除
  deleteFile: 'admin/file/:id',

  // 资料类型管理
  // 列表
  getFileTypeList: 'admin/fileType',
  // 详情
  getFileTypeDetail: 'admin/fileType/:id',
  // 创建
  addFileType: 'admin/fileType',
  // 更新
  editFileType: 'admin/fileType/:id',
  // 删除
  deleteFileType: 'admin/fileType/:id'

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
