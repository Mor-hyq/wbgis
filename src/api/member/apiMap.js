const Config = require('@/config')

const mode = Config.mode

const memberApi = {
  // 企业权限模块
  enterpriseModule: 'admin/enterpriseModule',
  // 角色管理模块
  // 角色列表
  userRoleList: 'admin/v1/userRole/index',
  // 角色详情
  userRoleRead: 'admin/v1/userRole/read',
  // 角色更新
  userRoleUpdate: 'admin/v1/userRole/update',
  // 角色创建，保存
  userRoleSave: 'admin/v1/userRole/save',
  // 角色删除
  userRoleDelete: 'admin/v1/userRole/delete',

  // 账户管理
  // 账户列表
  accountList: 'admin/v1/user/index',
  // 账户详情
  accountDetail: 'admin/v1/user/read',
  // 账户创建，保存
  accountSave: 'admin/v1/user/save',
  // 账户更新
  accountUpdate: 'admin/v1/user/update',
  // 账户删除
  accountDelete: 'admin/v1/user/delete'

}
if (mode === 'local') {
  for (const k in memberApi) {
    memberApi[k] = `${memberApi[k]}?debug=cross`
  }
}

export default memberApi
