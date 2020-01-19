export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    // 获取一级路由的name
    const name = vnode.context.$route.matched[0].name
    // 获取后端角色权限
    const arr = vnode.context.$store.state.permission.fetchPermissionList
    // 匹配到一级路由
    const findArr = arr.find(v => v.name === name)
    // 获取二级路由
    const topRoute = findArr ? findArr.children : []
    const hasPermission = topRoute.some(v => v.name === value)

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
