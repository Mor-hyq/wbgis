<template>
  <div>
    <el-tree
      ref="roleTree"
      class="tree"
      :data="authorityModule"
      :default-checked-keys="checkedId"
      :default-expanded-keys="checkedId"
      :props="defaultProps"
      :highlight-current="true"
      :show-checkbox="true"
      :check-strictly="checkStrictly"
      :filter-node-method="filterNode"
      :default-expand-all="expandAll"
      node-key="id"
      @check="checkChange"
    />
  </div>
</template>

<script>
import { fetchPermission } from '@/api/login'
import { mapGetters } from 'vuex'
import { asyncRoutes } from '@/router'
import { cloneDeep, upperFirst } from 'lodash'
import comLang from '@/lang'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isRead: {
      type: Boolean,
      default: false
    },
    moduleIds: {
      type: String,
      default: ''
    },
    isHideMember: { // 节点树默认不显示权限管理模块
      type: Boolean,
      default: true
    },
    expandAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      commonLang: comLang.common,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      authorityModule: [],
      checkedAll: '', // 全选
      checkStrictly: true
    }
  },
  computed: {
    ...mapGetters([
      'authority'
    ]),
    checkedId() {
      return this.moduleIds.split(',')
    },
    routerName() {
      const obj = {}
      asyncRoutes.forEach(v => {
        obj[v.name] = v
      })
      return obj
    }
  },
  watch: {
    moduleIds() {
      this.resetChecked()
    }
  },
  created() {
    // 当已经获取过权限数据 组件复用不再重新获取
    if (this.authority.length > 0) {
      this.authorityModule = cloneDeep(this.authority)
      this.setTreeDisabled(this.authorityModule, this.isRead)
      this.$nextTick(() => {
        this.$refs.roleTree.filter()
      })
    } else {
      this.getAuthorityModule()
    }
  },
  methods: {
    async getAuthorityModule() {
      // 获取权限数据
      const { code, data } = await fetchPermission()
      if (code === 200) {
        data[0].children.forEach((v, index) => {
          // 若后台数据和前端路由名称相同 只判断第一级的name
          // 为后台数据添加meta.level字段 并按level生成相应树形结构
          const name = upperFirst(v.url)
          if (this.routerName[name]) {
            if (v.meta) {
              v.meta.level = this.routerName[name].meta.level
            } else {
              v.meta = {
                level: this.routerName[name].meta.level
              }
            }
            if (v.children && v.children.length > 0) {
              const origin = this.routerName[name].children || []
              this.addMetaProperty(v.children, origin)
            }
            // 数据结构转换
            const itemRoute = this.generateRoutes([v])
            const itemTree = this.generateTreeFormat(itemRoute)
            // 替换转换后的数据
            data.splice(index, 1, itemTree[0])
          }
        })
        this.authorityModule = cloneDeep(data)
        this.setTreeDisabled(this.authorityModule, this.isRead)
        // 存储权限数据
        this.$store.commit('member/SET_AUTHORITY', data)
        this.$nextTick(() => {
          this.$refs.roleTree.filter()
        })
      }
    },
    addMetaProperty(target = [], origin = []) {
      // 为后台数据添加meta.level字段
      if (target.length < 1 || origin.length < 1) {
        return
      }
      target.forEach(v => {
        const name = upperFirst(v.url)
        const originItem = origin.find(item => item.name === name)
        if (originItem) {
          if (v.meta) {
            v.meta.level = originItem.meta.level
          } else {
            v.meta = {
              level: originItem.meta.level
            }
          }
          if (v.children && originItem.children) {
            this.addMetaProperty(v.children, originItem.children)
          }
        }
      })
    },
    generateRoutes(routes) {
      // 依据level字段生成对应的key-value
      if (!routes) {
        return []
      }
      if (Array.isArray(routes)) {
        const arr = []
        routes.forEach(v => {
          const tmpMap = {}
          const level = v.meta && v.meta.level
          if (level) {
            const item = cloneDeep(v)
            delete item.children
            tmpMap[level] = item
            if (v.children && v.children.length > 0) {
              Object.assign(tmpMap, ...this.generateRoutes(v.children))
            }
            arr.push(tmpMap)
          } else {
            const obj = {
              [v.id + v.name]: v
            }
            arr.push(obj)
          }
        })
        return arr
      }
    },
    generateTreeFormat(routes) {
      // 依据level生成权限中的树形结构
      if (!routes) {
        return []
      }
      if (Array.isArray(routes)) {
        const arr = []
        const compObj = {}
        routes.forEach(v => {
          // level == 1
          if (v['1']) {
            for (const k in v) {
              const keyArr = k.split('-')
              const keyLength = keyArr.length
              if (keyLength === 1) {
                if (Number(keyArr[0])) {
                  arr.push(v[k])
                } else {
                  // 若后端数据还包含旧后台权限数据时
                  compObj[k] = v[k]
                }
              } else {
                // 上一级的level值
                const tmpKey = keyArr.slice(0, keyLength - 1).join('-')
                const p = v[tmpKey]
                if (p) {
                  let children = this.nodeChildren(p)
                  if (!children) {
                    children = this.nodeChildren(p, [])
                  }
                  // 在上一级中插入当前子级
                  children.push(v[k])
                }
              }
            }
          } else {
            arr.push(v)
          }
        })
        if (Object.keys(compObj).length > 0) {
          const compObjArr = []
          for (const j in compObj) {
            compObjArr.push(compObj[j])
          }
          if (arr[0].children) {
            arr[0].children = arr[0].children.concat(compObjArr)
          }
        }
        return arr
      }
      return [routes]
    },
    nodeChildren(node, newChildren) {
      if (!node) {
        return null
      }
      if (typeof newChildren !== 'undefined') {
        node.children = newChildren
      }
      return node.children
    },
    filterNode(value, data, node) {
      return true
    },
    checkChange(currentObj, treeStatus) {
      // 前提是el-tree树中的check-strictly = true 严格的遵循父子不互相关联的做法
      const selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
      // 子级选择时关联父级状态
      this.selectedParent(currentObj)
      if (currentObj.children && currentObj.children.length > 0) {
        // 父级选择时关联子级状态
        this.uniteChildSame(currentObj.children, selected >= 0)
      }
    },
    setTreeDisabled(routes, disabled) {
      if (!routes) {
        return []
      }
      if (Array.isArray(routes)) {
        routes.forEach(v => {
          v.disabled = disabled
          if (v.children && v.children.length > 0) {
            this.setTreeDisabled(v.children, disabled)
          }
        })
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      treeList.forEach(v => {
        this.$refs.roleTree.setChecked(v.id, isSelected)
        if (v.children && v.children.length > 0) {
          this.uniteChildSame(v.children, isSelected)
        }
      })
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      const currentNode = this.$refs.roleTree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.roleTree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    },
    // 点击确认提交权限数据
    confirmRole() {
      const checkedKeys = this.$refs.roleTree.getCheckedKeys()
      // 默认将首页权限1也加上
      checkedKeys.push(1)
      return checkedKeys.join(',')
    },
    handleChange(val) {
      this.checkedAll = val
      if (val === 1) {
        this.setAllKeys()
      } else {
        this.resetChecked()
      }
    },
    setAllKeys() {
      // 全选
      this.checkStrictly = false
      this.$nextTick(() => {
        this.$refs.roleTree.setCheckedNodes(this.authorityModule)
        this.checkStrictly = true
      })
    },
    resetChecked() {
      // 反选
      this.$refs.roleTree.setCheckedKeys([])
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="scss" scoped>
.tree {
  /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #409EFF;
    border-color: #409EFF;
  }
  /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
    border-color: #fff;
  }
}
</style>
