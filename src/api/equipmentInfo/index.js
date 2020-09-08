import request from '@/utils/request'
import api from './api'
import { replacePlaceHolder } from '@/utils/index'

// 管道管理页面->
// 新增管道接口
export function addPipe({
  order,
  name,
  length,
  diameter,
  thick,
  pressure,
  delivery_pressure,
  design_temp,
  use_temp,
  state,
  medium,
  material,
  level,
  data_source,
  location_prime,
  update_instruction,
  start_location,
  specification,
  layer_material,
  use_limit,
  pipe_unit,
  design_unit,
  construct_unit,
  header,
  phone,
  remark
} = {}) {
  return request({
    url: api.addPipe,
    method: 'post',
    data: {
      order,
      name,
      length,
      diameter,
      thick,
      pressure,
      delivery_pressure,
      design_temp,
      use_temp,
      state,
      medium,
      material,
      level,
      data_source,
      location_prime,
      update_instruction,
      start_location,
      specification,
      layer_material,
      use_limit,
      pipe_unit,
      design_unit,
      construct_unit,
      header,
      phone,
      remark
    }
  })
}
// 获取管道信息列表接口
export function getPipeList({
  order,
  name,
  state,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getPipeList,
    method: 'get',
    params: {
      order,
      name,
      state,
      page,
      paginate
    }
  })
}
// 获取管道详情接口
export function getPipeDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getPipeDetail, { id }),
    method: 'get'
  })
}
// 删除管道信息接口
export function deletePipe({
  delete_ids
} = {}) {
  return request({
    url: api.deletePipe,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}
// 编辑管道信息
export function editPipe({
  id,
  order,
  name,
  length,
  diameter,
  thick,
  pressure,
  delivery_pressure,
  design_temp,
  use_temp,
  state,
  medium,
  material,
  level,
  data_source,
  location_prime,
  update_instruction,
  start_location,
  specification,
  layer_material,
  use_limit,
  pipe_unit,
  design_unit,
  construct_unit,
  header,
  phone,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editPipe, { id }),
    method: 'put',
    data: {
      order,
      name,
      length,
      diameter,
      thick,
      pressure,
      delivery_pressure,
      design_temp,
      use_temp,
      state,
      medium,
      material,
      level,
      data_source,
      location_prime,
      update_instruction,
      start_location,
      specification,
      layer_material,
      use_limit,
      pipe_unit,
      design_unit,
      construct_unit,
      header,
      phone,
      remark
    }
  })
}
// 获取管道关联设备列表
export function getPipeLinkList({
  pipe_id,
  equipment_id,
  field_id_2 = '',
  field_value_id_2,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getPipeLinkList,
    method: 'get',
    params: {
      pipe_id,
      equipment_id,
      field_id_2,
      field_value_id_2,
      page,
      paginate
    }
  })
}
// 关联设备接口
export function linkAsset({
  pipe_id,
  asset_id
} = {}) {
  return request({
    url: api.linkAsset,
    method: 'post',
    data: {
      pipe_id,
      asset_id
    }
  })
}
// 取消关联
export function unlinkAsset({
  pipe_id,
  asset_ids
} = {}) {
  return request({
    url: api.unlinkAsset,
    method: 'delete',
    params: {
      pipe_id,
      asset_ids
    }
  })
}

// 管道路由管理页面->
// 新增管道路由接口
export function addPipeRoute({
  pipe_id,
  order,
  name,
  mileage,
  length,
  latitude_longtitude,
  ground_elevation,
  pipe_depth,
  turn_angle,
  location,
  region,
  date,
  thumb,
  remark
} = {}) {
  return request({
    url: api.addPipeRoute,
    method: 'post',
    data: {
      pipe_id,
      order,
      name,
      mileage,
      length,
      latitude_longtitude,
      ground_elevation,
      pipe_depth,
      turn_angle,
      location,
      region,
      date,
      thumb,
      remark
    }
  })
}
// 获取管道路由列表接口
export function getPipeRouteList({
  name,
  state,
  order,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getPipeRouteList,
    method: 'get',
    params: {
      name,
      state,
      order,
      page,
      paginate
    }
  })
}
// 删除管道路由接口
export function deletePipeRoute({
  delete_ids
} = {}) {
  return request({
    url: api.deletePipeRoute,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}
// 修改管道路由接口
export function editPipeRoute({
  id,
  pipe_id,
  order,
  name,
  mileage,
  length,
  latitude_longtitude,
  ground_elevation,
  pipe_depth,
  turn_angle,
  location,
  region,
  date,
  thumb,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editPipeRoute, { id }),
    method: 'put',
    data: {
      pipe_id,
      order,
      name,
      mileage,
      length,
      latitude_longtitude,
      ground_elevation,
      pipe_depth,
      turn_angle,
      location,
      region,
      date,
      thumb,
      remark
    }
  })
}
// 获取管道路由详情接口
export function getPipeDRouteDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getPipeDRouteDetail, { id }),
    method: 'get'
  })
}
// 修改排序接口
export function updatePipeSort({
  id,
  sort
} = {}) {
  return request({
    url: replacePlaceHolder(api.updatePipeSort, { id }),
    method: 'put',
    data: {
      sort
    }
  })
}
// 导入管道路由信息
export function importPipeRoute(data) {
  return request({
    url: api.importPipeRoute,
    method: 'post',
    data
  })
}
// 设备基础信息
// 设备类型
// 获取设备列表
export function getEquipmentTypeList({
  page = 1,
  paginate = 10,
  name
} = {}) {
  return request({
    url: api.getEquipmentTypeList,
    method: 'get',
    params: {
      page,
      paginate,
      name
    }
  })
}
// 获取全部设备列表
export function getEquipmentTypeAll() {
  return request({
    url: api.getEquipmentTypeList,
    method: 'get'
  })
}
// 获取设备类型详情
export function getEquipmentTypeDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getEquipmentTypeDetail, { id }),
    method: 'get'
  })
}
// 创建设备类型
export function addEquipmentType({
  code,
  name
} = {}) {
  return request({
    url: api.addEquipmentType,
    method: 'post',
    data: {
      code,
      name
    }
  })
}
// 编辑设备类型
export function editEquipmentType({
  id,
  code,
  name
} = {}) {
  return request({
    url: replacePlaceHolder(api.editEquipmentType, { id }),
    method: 'put',
    data: {
      code,
      name
    }
  })
}
// 删除设备类型
export function deleteEquipmentType({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteEquipmentType, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}
// 字段
// 获取字段列表
export function getFieldList({
  page = 1,
  paginate = 10,
  name,
  type,
  equipment_id
} = {}) {
  return request({
    url: api.getFieldList,
    method: 'get',
    params: {
      page,
      paginate,
      name,
      type,
      equipment_id
    }
  })
}

// 设备资产
// 获取设备资产列表
export function getAssetList({
  page = 1,
  paginate = 10,
  equipment_id,
  field_value_id_2,
  type
} = {}) {
  const params = {
    page,
    paginate,
    equipment_id,
    field_value_id_2,
    field_id_2: ''
  }
  type && (params.type = type)
  return request({
    url: api.getAssetList,
    method: 'get',
    params
  })
}
// 获取设备资产详情
export function getAssetDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getAssetDetail, { id }),
    method: 'get'
  })
}
// 创建设备资产
export function addAsset({
  equipment_id,
  field = {}
} = {}) {
  return request({
    url: api.addAsset,
    method: 'post',
    data: {
      equipment_id,
      ...field
    }
  })
}
// 编辑设备资产
export function editAsset({
  id,
  equipment_id,
  field = {}
} = {}) {
  return request({
    url: replacePlaceHolder(api.editAsset, { id }),
    method: 'put',
    data: {
      equipment_id,
      ...field
    }
  })
}
// 删除设备资产
export function deleteAsset({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteAsset, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}
// 设备类型统计图
export function getAssetChart() {
  return request({
    url: api.getAssetChart,
    method: 'get',
    params: {
      type: 'echarts'
    }
  })
}
// 资料管理
// 列表
export function getFileList({
  page = 1,
  paginate = 10,
  title,
  file_type_id,
  remark
} = {}) {
  return request({
    url: api.getFileList,
    method: 'get',
    params: {
      page,
      paginate,
      title,
      file_type_id,
      remark
    }
  })
}
// 详情
export function getFileDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getFileDetail, { id }),
    method: 'get'
  })
}
// 创建
export function addFile({
  title,
  file_type_id,
  upload_file_ids,
  remark
} = {}) {
  return request({
    url: api.addFile,
    method: 'post',
    data: {
      title,
      file_type_id,
      upload_file_ids,
      remark
    }
  })
}
// 更新
export function editFile({
  id,
  title,
  file_type_id,
  upload_file_ids,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editFile, { id }),
    method: 'put',
    data: {
      title,
      file_type_id,
      upload_file_ids,
      remark
    }
  })
}
// 删除
export function deleteFile({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteFile, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}
// 导入模版
export function importAsset(data) {
  return request({
    url: api.getAssetList,
    method: 'post',
    data,
    params: {
      type: 'import'
    }
  })
}

// 资料类型管理
// 列表
export function getFileTypeList({
  page = 1,
  paginate = 10,
  type
} = {}) {
  return request({
    url: api.getFileTypeList,
    method: 'get',
    params: {
      page,
      paginate,
      type
    }
  })
}
// 获取资料类型下拉列表
export function getFileTypeSelect({
  type
} = {}) {
  return request({
    url: api.getFileTypeList,
    method: 'get',
    params: {
      page: 1,
      type
    }
  })
}
// 详情
export function getFileTypeDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getFileTypeDetail, { id }),
    method: 'get'
  })
}
// 创建
export function addFileType({
  pid,
  name
} = {}) {
  return request({
    url: api.addFileType,
    method: 'post',
    data: {
      pid,
      name
    }
  })
}
// 更新
export function editFileType({
  id,
  pid,
  name
} = {}) {
  return request({
    url: replacePlaceHolder(api.editFileType, { id }),
    method: 'put',
    data: {
      pid,
      name
    }
  })
}
// 删除
export function deleteFileType({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteFileType, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}
