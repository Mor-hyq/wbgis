import request from '@/utils/request'
import api from './api'
// 替换请求链接中的占位符的方法
import { replacePlaceHolder } from '@/utils/index'

// 应急人员
// 添加应急人员接口
export function addStaff({
  order,
  name,
  unit,
  emerge_place,
  commander,
  response,
  position,
  office_phone,
  phone,
  home_phone
} = {}) {
  return request({
    url: api.addStaff,
    method: 'post',
    data: {
      order,
      name,
      unit,
      emerge_place,
      commander,
      response,
      position,
      office_phone,
      phone,
      home_phone
    }
  })
}
// 获取应急人员列表接口
export function getStaffList({
  unit,
  name,
  order,
  commander,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getStaffList,
    method: 'get',
    params: {
      unit,
      name,
      order,
      commander,
      page,
      paginate
    }
  })
}
// 删除应急人员接口
export function deleteStaff({
  delete_ids
} = {}) {
  return request({
    url: api.deleteStaff,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}
// 修改应急人员接口
export function editStaff({
  id,
  order,
  name,
  unit,
  emerge_place,
  commander,
  response,
  position,
  office_phone,
  phone,
  home_phone,
  depart_name,
  create_time,
  register
} = {}) {
  return request({
    url: replacePlaceHolder(api.editStaff, { id }),
    method: 'put',
    data: {
      order,
      name,
      unit,
      emerge_place,
      commander,
      response,
      position,
      office_phone,
      phone,
      home_phone,
      depart_name,
      create_time,
      register
    }
  })
}
// 获取应急人员详情接口
export function getStaffDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getStaffDetail, { id }),
    method: 'get'
  })
}

// 消防队伍
// 获取消防队伍列表接口
export function getFireTeamList({
  unit,
  name,
  order,
  leader,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getFireTeamList,
    method: 'get',
    params: {
      unit,
      name,
      order,
      leader,
      page,
      paginate
    }
  })
}
// 添加消防队伍接口
export function addFireTeam({
  order,
  name,
  unit,
  team_place,
  response,
  number,
  leader,
  phone,
  duty_phone,
  remark
} = {}) {
  return request({
    url: api.addFireTeam,
    method: 'post',
    data: {
      order,
      name,
      unit,
      team_place,
      response,
      number,
      leader,
      phone,
      duty_phone,
      remark
    }
  })
}
// 修改消防队伍信息接口
export function editFireTeam({
  id,
  order,
  name,
  unit,
  team_place,
  response,
  number,
  leader,
  phone,
  duty_phone,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editFireTeam, { id }),
    method: 'put',
    data: {
      order,
      name,
      unit,
      team_place,
      response,
      number,
      leader,
      phone,
      duty_phone,
      remark
    }
  })
}
// 删除消防队伍接口
export function deleteFireTeam({
  delete_ids
} = {}) {
  return request({
    url: api.deleteFireTeam,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}
// 获取消防队伍详情接口
export function getFireTeamDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getFireTeamDetail, { id }),
    method: 'get'
  })
}

// 应急车辆信息
// 添加应急车辆接口
export function addCar({
  order,
  unit,
  store_place,
  plate_number,
  number,
  driver,
  leader,
  phone,
  car_state,
  use_time,
  scrap_time,
  remark
} = {}) {
  return request({
    url: api.addCar,
    method: 'post',
    data: {
      order,
      unit,
      store_place,
      plate_number,
      number,
      driver,
      leader,
      phone,
      car_state,
      use_time,
      scrap_time,
      remark
    }
  })
}
// 获取应急车辆列表
export function getCarList({
  unit,
  order,
  leader,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getCarList,
    method: 'get',
    params: {
      unit,
      order,
      leader,
      page,
      paginate
    }
  })
}
// 修改应急车辆信息接口
export function editCar({
  id,
  order,
  unit,
  store_place,
  plate_number,
  number,
  driver,
  leader,
  phone,
  car_state,
  use_time,
  scrap_time,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editCar, { id }),
    method: 'put',
    data: {
      order,
      unit,
      store_place,
      plate_number,
      number,
      driver,
      leader,
      phone,
      car_state,
      use_time,
      scrap_time,
      remark
    }
  })
}
// 删除应急车辆接口
export function deleteCar({
  delete_ids
} = {}) {
  return request({
    url: api.deleteCar,
    method: 'delete',
    params: { delete_ids }
  })
}
// 获取应急车辆详情接口
export function getCarDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getCarDetail, { id }),
    method: 'get'
  })
}

// 应急物资信息
// 添加应急物资接口
export function addSupply({
  order,
  unit,
  material,
  store_place,
  specificate,
  mesure,
  number,
  leader,
  phone,
  expire_time,
  check_time,
  remark
} = {}) {
  return request({
    url: api.addSupply,
    method: 'post',
    data: {
      order,
      unit,
      material,
      store_place,
      specificate,
      mesure,
      number,
      leader,
      phone,
      expire_time,
      check_time,
      remark
    }
  })
}
// 获取应急物资列表接口
export function getSupplyList({
  unit,
  order,
  material,
  leader,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getSupplyList,
    method: 'get',
    params: {
      unit,
      order,
      material,
      leader,
      page,
      paginate
    }
  })
}
// 修改应急物资信息
export function editSupply({
  id,
  order,
  unit,
  material,
  store_place,
  specificate,
  mesure,
  number,
  leader,
  phone,
  expire_time,
  check_time,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editSupply, { id }),
    method: 'put',
    data: {
      order,
      unit,
      material,
      store_place,
      specificate,
      mesure,
      number,
      leader,
      phone,
      expire_time,
      check_time,
      remark
    }
  })
}
// 删除应急物资接口
export function deleteSupply({
  delete_ids
} = {}) {
  return request({
    url: api.deleteSupply,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}
// 获取应急物资详情接口
export function getSupplyDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getSupplyDetail, { id }),
    method: 'get'
  })
}

// 外协单位信息
// 添加外协单位接口
export function addCooperation({
  order,
  institute,
  institute_type,
  name,
  response,
  leader,
  phone,
  region,
  coordinate,
  remark
} = {}) {
  return request({
    url: api.addCooperation,
    method: 'post',
    data: {
      order,
      institute,
      institute_type,
      name,
      response,
      leader,
      phone,
      region,
      coordinate,
      remark
    }
  })
}
// 修改外协单位接口
export function editCooperation({
  id,
  order,
  institute,
  institute_type,
  name,
  response,
  leader,
  phone,
  region,
  coordinate,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editCooperation, { id }),
    method: 'put',
    data: {
      order,
      institute,
      institute_type,
      name,
      response,
      leader,
      phone,
      region,
      coordinate,
      remark
    }
  })
}
// 获取外协单位列表接口
export function getCooperationList({
  name,
  institute,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getCooperationList,
    method: 'get',
    params: {
      name,
      institute,
      page,
      paginate
    }
  })
}
// 删除外协单位接口
export function deleteCooperation({
  delete_ids
} = {}) {
  return request({
    url: api.deleteCooperation,
    method: 'delete',
    params: { delete_ids }
  })
}
// 获取外协单位详情接口
export function getCooperationDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getCooperationDetail, { id }),
    method: 'get'
  })
}

// 处置措施管理
// 添加处置措施接口
export function addMeasure({
  file
} = {}) {
  return request({
    url: api.addMeasure,
    method: 'post',
    data: file
  })
}
// 获取处置措施列表接口
export function getMeasureList({
  name,
  create_time,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getMeasureList,
    method: 'get',
    params: {
      name,
      create_time,
      page,
      paginate
    }
  })
}
// 修改处置措施接口
export function editMeasure({
  file
} = {}) {
  return request({
    url: api.editMeasure,
    method: 'post',
    data: file
  })
}
// 删除处置措施接口
export function deleteMeasure({
  delete_ids
} = {}) {
  return request({
    url: api.deleteMeasure,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}
// 获取处置措施详情接口
export function getMeasureDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getMeasureDetail, { id }),
    method: 'get'
  })
}

// 应急预案管理
// 添加应急预案接口
export function addPlan({
  name,
  type,
  level,
  work_ids,
  team_ids,
  car_ids,
  material_ids,
  assist_ids,
  measure_ids,
  // emerge_worker_ids,
  push_app,
  email,
  content
} = {}) {
  const data = {
    name,
    type,
    level,
    work_ids,
    team_ids,
    car_ids,
    material_ids,
    assist_ids,
    measure_ids,
    push_app,
    email,
    content
  }
  // (+push_app === 1) && (data.emerge_worker_ids = emerge_worker_ids)
  return request({
    url: api.addPlan,
    method: 'post',
    data
  })
}
// 获取应急预案列表接口
export function getPlanList({
  name,
  type,
  level,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getPlanList,
    method: 'get',
    params: {
      name,
      type,
      level,
      page,
      paginate
    }
  })
}
// 修改应急预案
export function editPlan({
  id,
  name,
  type,
  level,
  work_ids,
  team_ids,
  car_ids,
  material_ids,
  assist_ids,
  measure_ids,
  // emerge_worker_ids,
  push_app,
  email,
  content
} = {}) {
  return request({
    url: replacePlaceHolder(api.editPlan, { id }),
    method: 'put',
    data: {
      name,
      type,
      level,
      work_ids,
      team_ids,
      car_ids,
      material_ids,
      // emerge_worker_ids,
      assist_ids,
      measure_ids,
      push_app,
      email,
      content
    }
  })
}
// 获取应急详情接口
export function getPlanDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getPlanDetail, { id }),
    method: 'get'
  })
}
// 删除应急预案接口
export function deletePlan({
  delete_ids
} = {}) {
  return request({
    url: api.deletePlan,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}

// 处理结果管理
// 新增事故接口
export function addResult({
  order,
  type,
  fault_time,
  fault_state,
  fault_describe,
  fault_coordinate,
  accident_id
} = {}) {
  return request({
    url: api.addResult,
    method: 'post',
    data: {
      order,
      type,
      fault_time,
      fault_state,
      fault_describe,
      fault_coordinate,
      accident_id
    }
  })
}
// 获取事故处理列表接口
export function getResultList({
  fault_state,
  type,
  level,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getResultList,
    method: 'get',
    params: {
      fault_state,
      type,
      level,
      page,
      paginate
    }
  })
}
// 处理事故接口
export function editResult({
  id,
  order,
  type,
  fault_time,
  fault_state,
  fault_describe,
  fault_coordinate,
  accident_id,
  deal_user,
  deal_result
} = {}) {
  return request({
    url: replacePlaceHolder(api.editResult, { id }),
    method: 'put',
    data: {
      order,
      type,
      fault_time,
      fault_state,
      fault_describe,
      fault_coordinate,
      accident_id,
      deal_user,
      deal_result
    }
  })
}
// 删除事故接口
export function deleteResult({
  delete_ids
} = {}) {
  return request({
    url: api.deleteResult,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}
// 获取事故详情接口
export function getResultDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getResultDetail, { id }),
    method: 'get'
  })
}

// 应急演练
// 添加应急演练接口
export function addExercise({
  order,
  name,
  company,
  remark
} = {}) {
  return request({
    url: api.addExercise,
    method: 'post',
    data: {
      order,
      name,
      company,
      remark
    }
  })
}
// 获取应急演练管理列表
export function getExerciseList({
  name,
  company,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getExerciseList,
    method: 'get',
    params: {
      name,
      company,
      page,
      paginate
    }
  })
}
// 修改应急演练接口
export function editExercise({
  id,
  order,
  name,
  company,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editExercise, { id }),
    method: 'put',
    data: {
      order,
      name,
      company,
      remark
    }
  })
}
// 删除应急演练接口
export function deleteExercise({
  delete_ids
} = {}) {
  return request({
    url: api.deleteExercise,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}

// 应急演练计划
// 添加计划接口
export function addExercisePlan({
  emerge_drill_id,
  order,
  subject,
  state,
  method,
  time,
  org,
  remark
} = {}) {
  return request({
    url: api.addExercisePlan,
    method: 'post',
    data: {
      emerge_drill_id,
      order,
      subject,
      state,
      method,
      time,
      org,
      remark
    }
  })
}
// 获取列表接口
export function getExercisePlanList({
  emerge_drill_id,
  state,
  subject,
  time,
  page = 1,
  paginate = 10
} = {}) {
  return request({
    url: api.getExercisePlanList,
    method: 'get',
    params: {
      emerge_drill_id,
      state,
      subject,
      time,
      page,
      paginate
    }
  })
}
// 修改接口
export function editExercisePlan({
  id,
  order,
  subject,
  state,
  method,
  time,
  org,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editExercisePlan, { id }),
    method: 'put',
    data: {
      order,
      subject,
      state,
      method,
      time,
      org,
      remark
    }
  })
}
// 删除接口
export function deleteExercisePlan({
  delete_ids
} = {}) {
  return request({
    url: api.deleteExercisePlan,
    method: 'delete',
    params: {
      delete_ids
    }
  })
}

// 事故等级管理
// 列表
export function getAccidentLevelList({
  page = 1,
  paginate = 10,
  level = ''
} = {}) {
  return request({
    url: api.getAccidentLevelList,
    method: 'get',
    params: {
      page,
      paginate,
      level
    }
  })
}
// 详情
export function getAccidentLevelDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getAccidentLevelDetail, { id }),
    method: 'get'
  })
}
// 创建
export function addAccidentLevel({
  level
} = {}) {
  return request({
    url: api.addAccidentLevel,
    method: 'post',
    data: {
      level
    }
  })
}
// 更新
export function editAccidentLevel({
  id,
  level
} = {}) {
  return request({
    url: replacePlaceHolder(api.editAccidentLevel, { id }),
    method: 'put',
    data: {
      level
    }
  })
}
// 删除
export function deleteAccidentLevel({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteAccidentLevel, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}

// 事故类型管理
// 列表
export function getAccidentTypeList({
  page = 1,
  paginate = 10,
  type = ''
} = {}) {
  return request({
    url: api.getAccidentTypeList,
    method: 'get',
    params: {
      page,
      paginate,
      type
    }
  })
}
// 详情
export function getAccidentTypeDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getAccidentTypeDetail, { id }),
    method: 'get'
  })
}
// 创建
export function addAccidentType({
  type
} = {}) {
  return request({
    url: api.addAccidentType,
    method: 'post',
    data: {
      type
    }
  })
}
// 更新
export function editAccidentType({
  id,
  type
} = {}) {
  return request({
    url: replacePlaceHolder(api.editAccidentType, { id }),
    method: 'put',
    data: {
      type
    }
  })
}
// 删除
export function deleteAccidentType({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteAccidentType, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}
