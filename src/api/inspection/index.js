import request from '@/utils/request'
import api from './api'
// 替换请求链接中的占位符的方法
import { replacePlaceHolder } from '@/utils/index'

// 检查与维修
// 设备维护管理页面
// 添加设备维护接口
export function addAssetEgi({
  pipe_id,
  equipment_id,
  asset_id,
  egi_cycle,
  next_egi_time,
  notify_person,
  phone,
  egi,
  type
} = {}) {
  return request({
    url: api.addAssetEgi,
    method: 'post',
    data: {
      pipe_id,
      equipment_id,
      // asset_id,
      egi_cycle,
      next_egi_time,
      notify_person,
      phone,
      egi,
      type
    }
  })
}
// 获取设备维护列表接口
export function getAssetEgiList({
  pipe_name,
  state,
  equipment_id,
  cycle,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getAssetEgiList,
    method: 'get',
    params: {
      pipe_name,
      state,
      equipment_id,
      cycle,
      page,
      paginate
    }
  })
}
// 获取设备维护详情接口
export function getAssetEgiDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getAssetEgiDetail, { id }),
    method: 'get'
  })
}
// 修改设备维护信息
export function editAssetEgi({
  id,
  pipe_id,
  equipment_id,
  asset_id,
  egi_cycle,
  next_egi_time,
  notify_person,
  phone,
  egi
} = {}) {
  return request({
    url: replacePlaceHolder(api.editAssetEgi, { id }),
    method: 'put',
    data: {
      pipe_id,
      equipment_id,
      // asset_id,
      egi_cycle,
      next_egi_time,
      notify_person,
      phone,
      egi
    }
  })
}
// 删除设备维护信息
export function deleteAssetEgi({
  delete_ids
} = {}) {
  return request({
    url: api.deleteAssetEgi,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}
// 设备类型下拉选择
export function getAssetTypeState({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getAssetTypeState, { id }),
    method: 'get'
  })
}
// 设备名称下拉列表
export function getAssetNameState({
  id,
  equipment_id,
  field_id_2,
  field_value_id_2
} = {}) {
  return request({
    url: replacePlaceHolder(api.getAssetNameState, { id }),
    method: 'get',
    params: {
      equipment_id,
      field_value_id_2,
      field_id_2
    }
  })
}
// 获取维护记录
export function getMaintainRecord({
  plan_time,
  egi_time,
  state,
  time,
  table_id,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getMaintainRecord,
    method: 'get',
    params: {
      plan_time,
      egi_time,
      state,
      table_id,
      page,
      paginate,
      time
    }
  })
}
// 获取维护记录（新）
export function getMaintainRecord2({
  // plan_time,
  egi_time,
  equipment_id,
  field_value_id_2,
  field_id_2 = '',
  state,
  cycle,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getMaintainRecord2,
    method: 'get',
    params: {
      // plan_time,
      egi_time,
      equipment_id,
      field_id_2,
      field_value_id_2,
      state,
      cycle,
      page,
      paginate
    }
  })
}
// 删除维护记录
export function deleteMaintainRecord({
  delete_ids
} = {}) {
  return request({
    url: api.deleteMaintainRecord,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}
// 修改维护记录
export function editMaintainRecord({
  id,
  egi_person,
  egi_time,
  egi_result,
  egi_table_id
} = {}) {
  return request({
    url: replacePlaceHolder(api.editMaintainRecord, { id }),
    method: 'put',
    data: {
      egi_person,
      egi_time,
      egi_result,
      egi_table_id
    }
  })
}
// 完成维护
export function finishMaintain({
  id,
  egi_person,
  egi_time,
  egi_result,
  table_id
} = {}) {
  return request({
    url: replacePlaceHolder(api.finishMaintain, { id }),
    method: 'put',
    data: {
      egi_person,
      egi_time,
      egi_result,
      table_id
    }
  })
}

// 维护记录表单项
// 保存(低点排水查油品质量检测)
export function saveMaintainTable({
  table_id,
  egi_record_id,
  data
} = {}) {
  return request({
    url: api.saveMaintainTable,
    method: 'post',
    data: {
      table_id,
      egi_record_id,
      data
    }
  })
}
// 获取维护记录表单详情
export function getMaintainTableDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getMaintainTableDetail, { id }),
    method: 'get'
  })
}
// 表单页(全部删除|删除当前页)
export function deleteMaintainTable({
  id,
  page
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteMaintainTable, { id }),
    method: 'delete'
  })
}
// 设备维修管理
// 新增设备维修接口
export function addAssetService({
  pipe_id,
  equipment_id,
  // style_id,
  // error_type_id,
  // title,
  asset_num,
  money,
  // plan_start_time,
  // plan_end_time,
  asset_ids,
  fault,
  start_time
  // content,
  // location
} = {}) {
  return request({
    url: api.addAssetService,
    method: 'post',
    data: {
      pipe_id,
      equipment_id,
      // style_id,
      // error_type_id,
      // title,
      asset_num,
      money,
      // plan_start_time,
      // plan_end_time,
      start_time,
      asset_ids,
      fault
      // content,
      // location
    }
  })
}
// 获取维修单详情接口
export function getAssetServiceDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getAssetServiceDetail, { id }),
    method: 'get'
  })
}
// 获取维修单列表接口
export function getAssetServiceList({
  pipe_id,
  state,
  equipment_id,
  // title,
  field_id_2 = '',
  field_value_id_2,
  start_time,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getAssetServiceList,
    method: 'get',
    params: {
      pipe_id,
      state,
      equipment_id,
      // title,
      field_id_2,
      field_value_id_2,
      start_time,
      page,
      paginate
    }
  })
}
// 修改维修单接口
export function editAssetService({
  id,
  pipe_id,
  equipment_id,
  style_id,
  error_type_id,
  title,
  asset_num,
  budget,
  plan_start_time,
  plan_end_time,
  asset_ids,
  content,
  location
} = {}) {
  return request({
    url: replacePlaceHolder(api.editAssetService, { id }),
    method: 'put',
    data: {
      pipe_id,
      equipment_id,
      style_id,
      error_type_id,
      title,
      asset_num,
      budget,
      plan_start_time,
      plan_end_time,
      asset_ids,
      content,
      location
    }
  })
}
// 完成维修接口
export function completeAssetService({
  id,
  construct_union,
  real_money,
  overhaul_mid,
  accept_mid,
  service_time,
  accept_time,
  content,
  accept
  // constracter,
  // phone,
  // workload,
  // start_time,
  // end_time,
  // result
} = {}) {
  return request({
    url: replacePlaceHolder(api.completeAssetService, { id }),
    method: 'put',
    data: {
      construct_union,
      real_money,
      overhaul_mid,
      accept_mid,
      service_time,
      accept_time,
      content,
      accept
      // constracter,
      // phone,
      // workload,
      // start_time,
      // end_time,
      // result
    }
  })
}
// 删除维修单接口
export function deleteAssetService({
  delete_ids
} = {}) {
  return request({
    url: api.deleteAssetService,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}

// 故障类型管理
// 添加故障类型接口
export function addErrorType({
  error
} = {}) {
  return request({
    url: api.addErrorType,
    method: 'post',
    data: {
      error
    }
  })
}
// 获取故障类型列表接口
export function getErrorTypeList({
  error_name,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getErrorTypeList,
    method: 'get',
    params: {
      error_name,
      page,
      paginate
    }
  })
}
// 修改故障类型接口
export function editErrorType({
  id,
  error
} = {}) {
  return request({
    url: replacePlaceHolder(api.editErrorType, { id }),
    method: 'put',
    data: {
      error
    }
  })
}
// 删除故障类型接口
export function deleteErrorType({
  delete_ids
} = {}) {
  return request({
    url: api.deleteErrorType,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}

// 维修数据趋势分析
export function getRepaireChart({
  pipe_id,
  year
} = {}) {
  return request({
    url: api.echartsData,
    method: 'get',
    params: {
      target: 'repairs',
      pipe_id,
      year
    }
  })
}
// 设备管理分析图表
export function getAssetAnalyse({
  pipe_id,
  equipment_id,
  year,
  field_value_id_2,
  field_id_2 = ''
} = {}) {
  return request({
    url: api.echartsData,
    method: 'get',
    params: {
      target: 'manage',
      pipe_id,
      equipment_id,
      year
      // field_id_2,
      // field_value_id_2
    }
  })
}
// 故障类型分类统计
export function getFaultTypeChart({
  start,
  end
} = {}) {
  const params = {}
  start && (params.start = start)
  end && (params.end = end)
  return request({
    url: api.echartsData,
    method: 'get',
    params: {
      target: 'error',
      ...params
    }
  })
}
// 设备故障统计
export function getFaultChart({
  start,
  end
} = {}) {
  const params = {}
  start && (params.start = start)
  end && (params.end = end)
  return request({
    url: api.echartsData,
    method: 'get',
    params: {
      target: 'equipment',
      ...params
    }
  })
}
// 设备维修进度统计图暨设备故障率
export function getRepaireProgressChart() {
  return request({
    url: api.echartsData,
    method: 'get',
    params: {
      target: 'equipmentRepair'
    }
  })
}
// 设备完好率图表
export function getIntactChart() {
  return request({
    url: api.getIntactChart,
    method: 'get',
    params: {
      type: 'intact'
    }
  })
}
// 工单统计
export function getWorkOrderChart({
  pipe_id,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.echartsData,
    method: 'get',
    params: {
      target: 'work_order',
      pipe_id,
      page,
      paginate
    }
  })
}
// 设备台账
export function getAssetAccount({
  page = 1,
  paginate = 10,
  pipe_id,
  equipment_id,
  field_id_2,
  field_value_id_2,
  status
} = {}) {
  return request({
    url: api.getAssetAccount,
    method: 'get',
    params: {
      page,
      paginate,
      type: 'ledger',
      pipe_id,
      equipment_id,
      field_id_2,
      field_value_id_2,
      status
    }
  })
}

// 设备维护列表（新）
export function getEquipmentMatainList({
  page = 1,
  paginate = 10,
  state,
  equipment_id,
  cycle
} = {}) {
  return request({
    url: api.getEquipmentMatainList,
    method: 'get',
    params: {
      page,
      paginate,
      state,
      equipment_id,
      cycle
    }
  })
}
// 获取导出表单列表
export function getEquipmentMatainDetail({
  id,
  period
} = {}) {
  return request({
    url: replacePlaceHolder(api.getEquipmentMatainDetail, { id }),
    method: 'get',
    params: {
      period
    }
  })
}
// 维护登记列表
export function getMaintainRegisterList({
  id,
  state,
  field_id_2 = '',
  field_value_id_2,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: replacePlaceHolder(api.getMaintainRegisterList, { id }),
    method: 'get',
    params: {
      state,
      field_id_2,
      field_value_id_2,
      page,
      paginate
    }
  })
}
// 根据设备类型获取对应维护表单列表
export function getAssetFormList({
  equipment_id
} = {}) {
  return request({
    url: api.getAssetFormList,
    method: 'get',
    params: {
      equipment_id
    }
  })
}
// 保存维护登记
export function saveMaintainRegister(data) {
  return request({
    url: api.saveMaintainRegister,
    method: 'post',
    data
  })
}
// 查看维护登记详情
export function getMaintainRegisterDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getMaintainRegisterDetail, { id }),
    method: 'get'
  })
}
