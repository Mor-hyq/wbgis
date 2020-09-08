import request from '@/utils/request'
import memberApi from './apiMap'

// 企业权限模块
export function getAuthorityModule() {
  return request({
    url: memberApi.enterpriseModule,
    method: 'get'
  })
}

// 角色列表
export function getRoleList({
  pageSize = 10,
  page = 1,
  name = '',
  remark = '',
  ids = '',
  type = '',
  uid = '',
  union_id = ''
} = {}) {
  const params = {
    pageSize,
    page
  }
  name && (params.name = name)
  remark && (params.remark = remark)
  ids && (params.ids = ids)
  type && (params.type = type)
  uid && (params.uid = uid)
  union_id && (params.union_id = union_id)
  return request({
    url: memberApi.userRoleList,
    method: 'get',
    params
  })
}
// 角色详情
export function getRoleDetail({
  id
} = {}) {
  return request({
    url: memberApi.userRoleRead,
    method: 'get',
    params: {
      id
    }
  })
}
// 角色更新
export function updateRole({
  id,
  name,
  union_id,
  remark,
  module_ids
} = {}) {
  const data = {
    remark
  }
  name && (data.name = name)
  module_ids && (data.module_ids = module_ids)
  union_id && (data.union_id = union_id)
  return request({
    url: memberApi.userRoleUpdate,
    method: 'put',
    params: {
      id
    },
    data
  })
}
// 角色创建，保存
export function saveRole({
  name,
  union_id,
  remark,
  module_ids
} = {}) {
  return request({
    url: memberApi.userRoleSave,
    method: 'post',
    data: {
      name,
      union_id,
      remark,
      module_ids
    }
  })
}
// 角色删除
export function deleteRole({
  ids
} = {}) {
  return request({
    url: memberApi.userRoleDelete,
    method: 'delete',
    params: {
      ids
    }
  })
}

// 账户管理
// 账户列表
export function getAccountList({
  username = '',
  phone = '',
  real_name = '',
  role_id = '',
  pageSize = 10,
  page = 1,
  is_admin = '',
  union_id = ''
} = {}) {
  const params = {
    pageSize,
    page
  }
  username && (params.username = username)
  phone && (params.phone = phone)
  real_name && (params.real_name = real_name)
  role_id && (params.role_id = role_id)
  union_id && (params.union_id = union_id)
  is_admin && (params.is_admin = is_admin)
  return request({
    url: memberApi.accountList,
    method: 'get',
    params
  })
}
// 账户详情
export function getAccountDetail({
  id,
  type = '',
  top_union_id = ''
} = {}) {
  const params = {}
  id && (params.id = id)
  type && (params.type = type)
  top_union_id && (params.top_union_id = top_union_id)
  return request({
    url: memberApi.accountDetail,
    method: 'get',
    params
  })
}
// 账户创建，保存
export function saveAccount({
  mid = '',
  username,
  password,
  confirm_password,
  phone,
  real_name,
  user_role_ids,
  union_ids,
  union_id,
  status
} = {}) {
  const data = {
    username,
    password,
    confirm_password,
    phone,
    real_name,
    user_role_ids,
    union_ids,
    union_id,
    status
  }
  mid && (data.mid = mid);
  (status || +status === 0) && (data.status = +status)
  return request({
    url: memberApi.accountSave,
    method: 'post',
    data
  })
}
// 账户更新
export function updateAccount({
  id,
  mid,
  username,
  password,
  confirm_password,
  phone,
  real_name,
  user_role_ids,
  union_ids,
  union_id,
  status,
  lock
} = {}) {
  const data = {
    union_ids
  }
  mid === '' ? (data.mid = 0) : data.mid = mid
  username && (data.username = username)
  password && (data.password = password)
  confirm_password && (data.confirm_password = confirm_password)
  phone && (data.phone = phone)
  real_name && (data.real_name = real_name)
  user_role_ids && (data.user_role_ids = user_role_ids)
  union_id && (data.union_id = union_id);
  (status || +status === 0) && (data.status = +status)
  lock !== '' && (lock || +lock === 0) && (data.lock = +lock)

  return request({
    url: memberApi.accountUpdate,
    method: 'put',
    params: {
      id
    },
    data
  })
}
// 账户删除
export function deleteAccount({
  ids
} = {}) {
  return request({
    url: memberApi.accountDelete,
    method: 'delete',
    params: {
      ids
    }
  })
}
