
/**
 *
 * @param  {Array} userRoutes 后台返回的用户权限json
 * @param  {Array} allRoutes  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes 过滤后的路由
 */

const staticRoute = {
  'TunnelRiskRouter': 0,
  'TunnelRiskRouterDetail': 0,
  'TunnelRiskRouterManage': 0,
  'MaintainRecordForm': 0,
  'AccidentType': 0,
  'AccidentLevel': 0
}
export function recursionRouter(userRoutes = [], allRoutes = [], includeName = []) {
  var realRoutes = []
  userRoutes.forEach((v, i) => {
    if (v.is_hide) {
      return
    }
    if (!v.url) {
      return
    }
    const name = v.url
    allRoutes.forEach((item, index) => {
      if (name === item.name || (!staticRoute[item.name] && item.isFixed)) {
        if (item.isFixed) {
          if (!staticRoute[item.name]) {
            staticRoute[item.name] = 1
            includeName.push(item.name)
          }
        } else {
          includeName.push(name)
        }
        // 本地写的meta与后台传入的进行合并
        if (item.meta) {
          item.meta.title = item.isFixed ? item.meta.title : v.name || item.meta.title
          item.meta.icon = item.isFixed ? item.meta.icon : v.icon || item.meta.icon
        } else {
          item.meta = {
            title: v.name || '',
            icon: v.icon || ''
          }
        }
        // 匹配到本地路由后 把children,path,name外的其他字段也写到前端路由表中
        for (const k in v) {
          if (k !== 'children' && k !== 'name') {
            item[k] = v[k]
          }
        }
        if (v.children && v.children.length > 0) {
          item.children = recursionRouter(v.children, item.children, includeName)
        } else {
          // 如果还有子路由但是都没配置权限 父级路由也不显示
          if (item.children && item.children.length > 0) {
            return
          }
        }
        realRoutes.push(item)
      }
    })
  })
  return realRoutes
}
/**
 *
 * @param {Array} routes 用户过滤后的路由
 *
 * 递归为所有有子路由的路由设置第一个children.path为默认路由
 */
export function setDefaultRoute(routes) {
  routes.forEach((v, i) => {
    if (v.children && v.children.length > 0) {
      if (v.redirect !== 'noRedirect') {
        v.redirect = {
          name: v.children[0].name
        }
      }
      setDefaultRoute(v.children)
    }
  })
}
