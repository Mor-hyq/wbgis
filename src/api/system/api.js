const Config = require('@/config')
const mode = Config.mode

const api = {
  // 单位管理
  // 获取单位管理列表
  getCompanyList: 'admin/company',
  // 获取单位管理详情
  getCompanyDetail: 'admin/company/:id',
  // 增加单位管理
  addCompany: 'admin/company',
  // 编辑单位管理
  editCompany: 'admin/company/:id',
  // 删除单位管理
  deleteCompany: 'admin/company/:id',

  // 部门管理
  // 获取部门管理列表
  getDepartMentList: 'admin/department',
  // 获取部门管理详情
  getDepartMentDetail: 'admin/department/:id',
  // 增加部门管理
  addDepartMent: 'admin/department',
  // 编辑部门管理
  editDepartMent: 'admin/department/:id',
  // 删除部门管理
  deleteDepartMent: 'admin/department/:id',

  // 角色管理
  // 获取角色列表
  getRoleList: 'admin/role',
  // 获取角色详情
  getRoleDetail: 'admin/role/:id',
  // 新建角色信息
  addRole: 'admin/role',
  // 编辑角色信息
  editRole: 'admin/role/:id',
  // 删除角色信息
  deleteRole: 'admin/role/:id',
  // 授权角色权限
  giveRole: 'admin/role/:id',

  // 用户管理
  // 获取用户列表
  getUserList: 'admin/member',
  // 获取用户详情
  getUserDetail: 'admin/member/:id',
  // 新建用户信息
  addUser: 'admin/member',
  // 编辑用户信息
  editUser: 'admin/member/:id',
  // 删除用户信息
  deleteUser: 'admin/member/:id',
  // 授权用户权限
  giveUser: 'admin/member/:id',
  // 修改用户密码
  updatePassword: 'admin/member/:id',

  // 日志管理
  // 获取日志列表
  getLogList: 'admin/log',

  // 风险管理
  // 列表
  getRiskList: 'admin/risk',
  // 详情
  getRiskDetail: 'admin/risk/:id',
  // 创建
  addRisk: 'admin/risk',
  // 更新
  editRisk: 'admin/risk/:id',
  // 删除
  deleteRisk: 'admin/risk/:id',

  // 风险路由管理
  // 列表
  getRiskRouteList: 'admin/riskRoute',
  // 详情
  getRiskRouteDetail: 'admin/riskRoute/:id',
  // 创建
  addRiskRoute: 'admin/riskRoute',
  // 更新
  editRiskRoute: 'admin/riskRoute/:id',
  // 删除
  deleteRiskRoute: 'admin/riskRoute/:id'
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
