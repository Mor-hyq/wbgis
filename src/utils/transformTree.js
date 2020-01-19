/**
 * 一维树形数据转化为树形结构数据
 * @param {*setting.idKey} id字段名 默认'id'
 * @param {*setting.pIdKey} pid字段名 默认'pid'
 * @param {*setting.children} children字段名 默认'children'
 * @param {*zNodes} 传入的数组
*/

export function transformTozTreeFormat({ setting = {
  idKey: 'id',
  pIdKey: 'pid',
  children: 'children'
}, sNodes = [] } = {}) {
  let i
  let l
  const key = setting.idKey
  const parentKey = setting.pIdKey
  if (!key || key === '' || !sNodes) return []
  if (Array.isArray(sNodes)) {
    const r = []
    const tmpMap = {}
    for (i = 0, l = sNodes.length; i < l; i++) {
      tmpMap[sNodes[i][key]] = sNodes[i]
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
      const p = tmpMap[sNodes[i][parentKey]]
      if (p && sNodes[i][key] !== sNodes[i][parentKey]) {
        let children = nodeChildren(setting, p)
        if (!children) {
          children = nodeChildren(setting, p, [])
        }
        children.push(sNodes[i])
      } else {
        r.push(sNodes[i])
      }
    }
    return r
  }
  return [sNodes]
}
export function nodeChildren(setting, node, newChildren) {
  if (!node) {
    return null
  }
  const key = setting.children
  if (typeof newChildren !== 'undefined') {
    node[key] = newChildren
  }
  return node[key]
}
