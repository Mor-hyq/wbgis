import request from '@/utils/request'
import api from './api'
// 替换请求链接中的占位符的方法
import { replacePlaceHolder } from '@/utils/index'

// 单位管理
// 获取单位管理列表
export function getCompanyList({
  page = 1,
  paginate = 10,
  name,
  contact
} = {}) {
  return request({
    url: api.getCompanyList,
    method: 'get',
    params: {
      contact,
      name,
      page,
      paginate
    }
  })
}
// 获取单位下拉列表
export function getCompanySelet() {
  return request({
    url: api.getCompanyList,
    method: 'get',
    params: {
      page: 1
    }
  })
}
// 获取部门下拉列表
export function getDepartmentSelet({
  company_id
} = {}) {
  return request({
    url: api.getDepartMentList,
    method: 'get',
    params: {
      page: 1,
      company_id
    }
  })
}
// 获取单位管理详情
export function getCompanyDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getCompanyDetail, { id }),
    method: 'get'
  })
}
// 增加单位管理
export function addCompany({
  code,
  name,
  contact,
  addr,
  remark
} = {}) {
  return request({
    url: api.addCompany,
    method: 'post',
    data: {
      code,
      name,
      contact,
      addr,
      remark
    }
  })
}
// 编辑单位管理
export function editCompany({
  id,
  code,
  name,
  contact,
  addr,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editCompany, { id }),
    method: 'put',
    data: {
      code,
      name,
      contact,
      addr,
      remark
    }
  })
}
// 删除单位管理
export function deleteCompany({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteCompany, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}

// 部门管理
// 获取部门管理列表
export function getDepartMentList({
  page = 1,
  paginate = 10,
  name
} = {}) {
  return request({
    url: api.getDepartMentList,
    method: 'get',
    params: {
      page,
      paginate,
      name
    }
  })
}
// 增加部门管理
export function addDepartMent({
  code,
  company_id,
  name
} = {}) {
  return request({
    url: api.addDepartMent,
    method: 'post',
    data: {
      code,
      company_id,
      name
    }
  })
}
// 获取部门管理详情
export function getDepartMentDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getDepartMentDetail, { id }),
    method: 'get'
  })
}
// 编辑部门管理
export function editDepartMent({
  id,
  code,
  company_id,
  name
} = {}) {
  return request({
    url: replacePlaceHolder(api.editDepartMent, { id }),
    method: 'put',
    data: {
      code,
      company_id,
      name
    }
  })
}
// 删除部门管理
export function deleteDepartMent({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteDepartMent, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}

// 角色管理
// 获取角色列表
export function getRoleList({
  page = 1,
  paginate = 10,
  name = ''
} = {}) {
  return request({
    url: api.getRoleList,
    method: 'get',
    params: {
      page,
      paginate,
      name
    }
  })
}
// 获取角色详情
export function getRoleDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getRoleDetail, { id }),
    method: 'get'
  })
}
// 新建角色信息
export function addRole({
  name,
  remark
} = {}) {
  return request({
    url: api.addRole,
    method: 'post',
    data: {
      name,
      remark
    }
  })
}
// 编辑角色信息
export function editRole({
  id,
  name,
  remark
} = {}) {
  return request({
    url: replacePlaceHolder(api.editRole, { id }),
    method: 'put',
    data: {
      name,
      remark
    }
  })
}
// 删除角色信息
export function deleteRole({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteRole, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}
// 授权角色权限
export function giveRole({
  id,
  rules
} = {}) {
  return request({
    url: replacePlaceHolder(api.giveRole, { id }),
    method: 'put',
    data: {
      rules
    }
  })
}

// 用户管理
// 获取用户列表
export function getUserList({
  page = 1,
  paginate = 10,
  username,
  nickname,
  mobile,
  status
} = {}) {
  const params = {
    page,
    paginate
  }
  username && (params.username = username)
  nickname && (params.nickname = nickname)
  mobile && (params.mobile = mobile)
  status !== '' && (params.status = status)
  return request({
    url: api.getUserList,
    method: 'get',
    params
  })
}
// 获取用户详情
export function getUserDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getUserDetail, { id }),
    method: 'get'
  })
}
// 新建用户信息
export function addUser({
  username,
  password,
  password_confirm,
  nickname,
  department_id,
  company_id,
  mobile,
  sex,
  position
} = {}) {
  return request({
    url: api.addUser,
    method: 'post',
    data: {
      username,
      password,
      password_confirm,
      nickname,
      department_id,
      company_id,
      mobile,
      sex,
      position
    }
  })
}
// 编辑用户信息
export function editUser({
  id,
  username,
  nickname,
  department_id,
  company_id,
  mobile,
  sex,
  position,
  status
} = {}) {
  const data = {}
  username && (data.username = username)
  nickname && (data.nickname = nickname)
  company_id && (data.company_id = company_id)
  department_id && (data.department_id = department_id)
  mobile && (data.mobile = mobile);
  (sex || +sex === 0) && (data.sex = +sex)
  position && (data.position = position);
  (status || +status === 0) && (data.status = +status)
  return request({
    url: replacePlaceHolder(api.editUser, { id }),
    method: 'put',
    data
  })
}
// 删除用户信息
export function deleteUser({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteUser, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}
// 修改用户密码
export function updatePassword({
  id,
  type = 'password',
  password,
  old_password
} = {}) {
  return request({
    url: replacePlaceHolder(api.updatePassword, { id }),
    method: 'put',
    params: {
      type
    },
    data: {
      password,
      old_password
    }
  })
}
// 授权用户权限
export function giveUser({
  id,
  type = 'auth',
  role_id
} = {}) {
  return request({
    url: replacePlaceHolder(api.giveUser, { id }),
    method: 'put',
    params: {
      type
    },
    data: {
      role_id
    }
  })
}

// 日志管理
// 获取日志列表
export function getLogList({
  page = 1,
  paginate = 10,
  department_name = ''
} = {}) {
  return request({
    url: api.getLogList,
    method: 'get',
    params: {
      page,
      paginate,
      department_name
    }
  })
}

// 风险管理
// 列表
export function getRiskList({
  page = 1,
  paginate = 10,
  name = ''
} = {}) {
  return request({
    url: api.getRiskList,
    method: 'get',
    params: {
      page,
      paginate,
      name
    }
  })
}
// 详情
export function getRiskDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getRiskDetail, { id }),
    method: 'get'
  })
}
// 创建
export function addRisk({
  name,
  level,
  mileage
} = {}) {
  return request({
    url: api.addRisk,
    method: 'post',
    data: {
      name,
      level,
      mileage
    }
  })
}
// 更新
export function editRisk({
  id,
  name,
  level,
  mileage
} = {}) {
  return request({
    url: replacePlaceHolder(api.editRisk, { id }),
    method: 'put',
    data: {
      name,
      level,
      mileage
    }
  })
}
// 删除
export function deleteRisk({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteRisk, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}

// 风险路由管理
// 列表
export function getRiskRouteList({
  page = 1,
  paginate = 10,
  risk_id = ''
} = {}) {
  return request({
    url: api.getRiskRouteList,
    method: 'get',
    params: {
      page,
      paginate,
      risk_id
    }
  })
}
// 详情
export function getRiskRouteDetail({
  id
} = {}) {
  return request({
    url: replacePlaceHolder(api.getRiskRouteDetail, { id }),
    method: 'get'
  })
}
// 创建
export function addRiskRoute({
  risk_id,
  sort,
  lng,
  lat
} = {}) {
  return request({
    url: api.addRiskRoute,
    method: 'post',
    data: {
      risk_id,
      sort,
      lng,
      lat
    }
  })
}
// 更新
export function editRiskRoute({
  id,
  risk_id,
  sort,
  lng,
  lat
} = {}) {
  return request({
    url: replacePlaceHolder(api.editRiskRoute, { id }),
    method: 'put',
    data: {
      risk_id,
      sort,
      lng,
      lat
    }
  })
}
// 删除
export function deleteRiskRoute({
  id = 1,
  ids
} = {}) {
  return request({
    url: replacePlaceHolder(api.deleteRiskRoute, { id }),
    method: 'delete',
    params: {
      ids
    }
  })
}
