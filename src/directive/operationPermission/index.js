export default {
  inserted(el, binding, vnode) {
    const {
      value
    } = binding
    // 判断当前路由下是否有该按钮权限
    const hasPermission = vnode.context.$route.meta.permission && vnode.context.$route.meta.permission.length > 0 && vnode.context.$route.meta.permission.some(v => v.value === value)

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
