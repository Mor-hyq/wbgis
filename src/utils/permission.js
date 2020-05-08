// import store from '@/store'

// /**
//  * @param {Array} value
//  * @returns {Boolean}
//  * @example see @/views/permission/directive.vue
//  */
// export default function checkPermission(value) {
//   if (value && value instanceof Array && value.length > 0) {
//     const roles = store.getters && store.getters.roles
//     const permissionRoles = value

//     const hasPermission = roles.some(role => {
//       return permissionRoles.includes(role)
//     })

//     if (!hasPermission) {
//       return false
//     }
//     return true
//   } else {
//     console.error(`need roles! Like v-permission="['admin','editor']"`)
//     return false
//   }
// }

/**
 *
 * @param  {Array} userRoutes 后台返回的用户权限json
 * @param  {Array} allRoutes  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes 过滤后的路由
 */

// for test start
// 下划线转小驼峰
// function toHump(name) {
//   return name.replace(/\_(\w)/g, function(all, letter) {
//     return letter.toUpperCase()
//   })
// }
// // 获取协议及域名信息
// function getDomain() {
//   return window.location.protocol + '//' + window.location.host
// }
// const domain = getDomain()
// export function recursionRouter(userRoutes = [], allRoutes = [], includeName = []) {
//   var realRoutes = []
//   userRoutes.forEach((v, i) => {
//     if (v.is_hide) {
//       return
//     }
//     if (!v.name && !v.path) {
//       return
//     }
//     let name
//     if (v.name) {
//       const new_name = toHump(v.name)
//       name = new_name.substr(0, 1).toUpperCase() + new_name.substr(1)
//     } else {
//       name = v.path
//     }
//     allRoutes.forEach((item, index) => {
//       if (name === item.name) {
//         includeName.push(name)
//         // 本地写的meta与后台传入的进行合并
//         if (item.meta) {
//           item.meta.title = v.title || item.meta.title || ''
//           item.meta.icon = v.icon || item.meta.icon || ''
//           item.meta.permission = v.permission || []
//           item.meta.fields = v.fields || []
//         } else {
//           item.meta = {
//             title: v.name || '',
//             icon: v.icon || ''
//             // permission: v.permission || [],
//             // fields: v.fields || []
//           }
//         }
//         // 匹配到本地路由后 把children,path,name外的其他字段也写到前端路由表中
//         for (const k in v) {
//           if (k !== 'children' && k !== 'path' && k !== 'name') {
//             item[k] = v[k]
//           }
//         }
//         if (v.children && v.children.length > 0) {
//           item.children = recursionRouter(v.children, item.children, includeName)
//         } else {
//           // 如果还有子路由但是都没配置权限 父级路由也不显示
//           if (item.children && item.children.length > 0) {
//             return
//           }
//         }
//         realRoutes.push(item)
//       }
//     })
//     // 循环结束 没有存入v.name说明没匹配上
//     // 如果此时有v.path说明可能是外链地址
//     // 这种情况也加入到路由中去
//     if (!includeName.includes(name)) {
//       if (v.path) {
//         includeName.push(name)
//         v.meta = {
//           title: v.title || '',
//           permission: v.permission || [],
//           fields: v.fields || []
//         }
//         v.path = /^\//.test(v.path) ? `${domain}${v.path}` : `${domain}/${v.path}`
//         realRoutes.push(v)
//       }
//     }
//   })
//   return realRoutes
// }
// for test end

// 按传递的权限路由顺序
export function recursionRouter(userRoutes = [], allRoutes = [], includeName = []) {
  var realRoutes = []
  userRoutes.forEach((v, i) => {
    if (v.is_hide) {
      return
    }
    // if (!v.name && !v.path) {
    //   return
    // }
    // real start
    // if (!v.url) {
    //   return
    // }
    // const name = v.url
    // real end
    // test start
    const name = v.name
    // test end

    // let name
    // if (v.name) {
    //   const new_name = toHump(v.name)
    //   name = new_name.substr(0, 1).toUpperCase() + new_name.substr(1)
    // } else {
    //   name = v.path
    // }
    allRoutes.forEach((item, index) => {
      if (name === item.name) {
        includeName.push(name)
        // 本地写的meta与后台传入的进行合并
        if (item.meta) {
          // item.meta.title = v.title || item.meta.title || ''
          // item.meta.icon = v.icon || item.meta.icon || ''
          // item.meta.permission = v.permission || []
          // item.meta.fields = v.fields || []
          item.meta.title = v.name || item.meta.title
          item.meta.icon = v.icon || item.meta.icon
        } else {
          item.meta = {
            title: v.name || '',
            icon: v.icon || ''
            // permission: v.permission || [],
            // fields: v.fields || []
          }
        }
        // 匹配到本地路由后 把children,path,name外的其他字段也写到前端路由表中
        for (const k in v) {
          // if (k !== 'children' && k !== 'path' && k !== 'name') {
          //   item[k] = v[k]
          // }
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
    // 循环结束 没有存入v.name说明没匹配上
    // 如果此时有v.path说明可能是外链地址
    // 这种情况也加入到路由中去
    // if (!includeName.includes(name)) {
    //   if (v.path) {
    //     includeName.push(name)
    //     v.meta = {
    //       title: v.title || '',
    //       permission: v.permission || [],
    //       fields: v.fields || []
    //     }
    //     v.path = /^\//.test(v.path) ? `${domain}${v.path}` : `${domain}/${v.path}`
    //     realRoutes.push(v)
    //   }
    // }
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
