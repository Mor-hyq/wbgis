import store from '../store'

/**
 * 删除路由缓存
 * @param {Object}
 * @param {string} name 路由名称
 * @param {string} route 当前路由对象
 */

export function deleteCacheView({ name, route }) {
  const targetView = name ? store.state.tagsView.visitedViews.find(v => v.name === name) : route
  return new Promise((resolve, reject) => {
    if (targetView) {
      store.dispatch('tagsView/delView', targetView).then(({ visitedViews }) => {
        resolve({ visitedViews, targetView })
      }).catch(err => {
        reject(err)
      })
    } else {
      resolve()
    }
  })
}

/**
 * 删除其他路由缓存
 * @param {Object}
 * @param {string} route 当前要保留的路由对象
 */

export function deleteOtherCacheView(route) {
  return new Promise((resolve, reject) => {
    if (route) {
      store.dispatch('tagsView/delOthersViews', route).then(() => {
        resolve()
      }).catch(() => {
        reject()
      })
    } else {
      reject()
    }
  })
}
