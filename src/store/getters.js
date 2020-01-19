const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  csrftoken: state => state.user.csrftoken,
  isLogin: state => state.user.isLogin,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name,
  // roles: state => state.user.roles,
  permission_routers: state => state.permission.permissionList,
  fetchPermissionList: state => state.permission.fetchPermissionList,
  asyncRoutesList: state => state.permission.asyncRoutesList,
  userInfo: state => state.user.userInfo,
  userName: state => state.user.userName,
  authority: state => state.member.authority,
  unionTreeData: state => state.user.unionTreeData,
  unionSearchTreeData: state => state.user.unionSearchTreeData,
  accountUnionTreeData: state => state.user.accountUnionTreeData,
  accountUnionSearchTreeData: state => state.user.accountUnionSearchTreeData,
  warningNum: state => state.app.warningNum
}
export default getters
