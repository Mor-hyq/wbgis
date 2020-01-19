<template>
  <div class="union-wrapper">
    <el-dialog
      :title="dialogTitle"
      custom-class="custom-dialog-class"
      append-to-body
      :visible.sync="isShowTree"
      :close-on-click-modal="false"
      @closed="resetChecked"
    >
      <div v-if="canSearch" style="padding-bottom:10px;">
        <el-input
          v-model="filterText"
          placeholder="输入关键字进行搜索"
          clearable
        />
      </div>
      <div class="choose_union">
        <el-tree
          ref="tree"
          class="tree"
          style="height:420px;overflow-y:auto;"
          node-key="id"
          :data="treeData"
          :show-checkbox="true"
          :props="defaultProps"
          :check-strictly="true"
          :highlight-current="true"
          :expand-on-click-node="false"
          :default-checked-keys="checkedId"
          :default-expand-all="expandAll"
          :default-expanded-keys="expandCheckedId"
          :filter-node-method="filterNode"
          @check="checkChange"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span @click="setItemChecked(data,node)">{{ node.label }}</span>
          </span>
        </el-tree>
        <div style="text-align:center;margin-top:20px">
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUnionTree, getAccountUnionTree } from '@/api/common'
import { getAccountDetail } from '@/api/member'
import { mapGetters } from 'vuex'
import { transformTozTreeFormat } from '@/utils/transformTree'
import { cloneDeep } from 'lodash'
export default {
  // 选择工会的组件
  name: 'UnionTree',
  props: {
    isAccountTree: { // 1.是否取当前账号下的工会结构
      type: Boolean,
      default: false
    },
    isConfirmRequest: { // 2.点击确定时是否要请求特殊接口判断是否可用
      type: Boolean,
      default: false
    },
    moduleIds: { // 默认接收字段 选中id值
      type: [String, Number],
      default: ''
    },
    moduleName: { // 选中工会的name值
      type: String,
      default: ''
    },
    dialogTitle: { // 弹窗显示title
      type: String,
      default: '选择工会'
    },
    isMultiple: { // 是否可多选 当选择单选时 isLinkToParent isLinkOnlyBrother isLinkOnly 设置无效
      type: Boolean,
      default: true
    },
    isRead: { // 是否读取状态
      type: Boolean,
      default: false
    },
    isLinkToParent: { // 勾选时是否向上级关联 与isLinkOnlyBrother互斥
      type: Boolean,
      default: true
    },
    isLinkOnlyBrother: { // 勾选时是否只关联兄弟级 与isLinkToParent互斥
      type: Boolean,
      default: false
    },
    isLinkOnly: { // 勾选时是否只勾选本级 与isLinkOnlyBrother、isLinkToParent互斥
      type: Boolean,
      default: false
    },
    canSearch: { // 树形结构是否可支持搜索
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 单项数据流的原则，组件内不能修改props的属性
      inputValue: String(this.moduleIds),
      isShowTree: false, // 是否显示弹窗
      treeData: [], // 树形数据
      treeSearchData: {}, // 树形查询数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      checkedId: [], // 树形结构选中id
      expandCheckedId: [], // 树形结构默认展开的路由
      expandAll: false, // 是否全部展开所有节点
      filterText: ''
    }
  },
  computed: {
    ...mapGetters([
      'unionTreeData',
      'unionSearchTreeData',
      'accountUnionTreeData',
      'accountUnionSearchTreeData'
    ]),
    showInputVal() {
      if (this.checkedId.length > 0 && Object.keys(this.treeSearchData).length > 0) {
        let names = ''
        this.checkedId.forEach(v => {
          const item = v.trim()
          if (this.treeSearchData[item]) {
            names += this.treeSearchData[item]['name'] + ','
          }
        })
        return names.replace(/\,$/, '')
      }
      return ''
    }
  },
  watch: {
    moduleIds(newVal) {
      this.inputValue = String(newVal)
    },
    inputValue(newVal) {
      const arr = newVal.split(',')
      this.checkedId = arr
      // 当选中长度大于1000条时，默认只展开第一条
      this.expandCheckedId = arr.length > 1000 ? [arr[0]] : arr
    },
    showInputVal(newVal) {
      this.$emit('update:moduleName', newVal)
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    if (!this.isAccountTree) {
      // 获取全部工会结构
      this.getAllUnionTree()
    } else {
      // 获取当前账号下的工会结构
      this.getAccountUnionTree()
    }
  },
  methods: {
    getAllUnionTree() {
      // 当已经获取过权限数据 组件复用不再重新获取
      if (this.unionSearchTreeData) {
        this.treeData = this.unionTreeData
        this.treeSearchData = this.unionSearchTreeData
        this.setTreeDisabled(this.treeData, this.isRead)
        this.expandAllNodes(this.treeSearchData)
      } else {
        this.getUnionTree()
      }
    },
    getAccountUnionTree() {
      // 当已经获取过权限数据 组件复用不再重新获取
      if (this.accountUnionSearchTreeData) {
        this.treeData = this.accountUnionTreeData
        this.treeSearchData = this.accountUnionSearchTreeData
        this.setTreeDisabled(this.treeData, this.isRead)
        this.expandAllNodes(this.treeSearchData)
      } else {
        this.getUnionTreeById()
      }
    },
    async getUnionTree() {
      // 获取全部工会结构
      try {
        const { code, data } = await getUnionTree()
        if (code === 200) {
          this.treeData = transformTozTreeFormat({ sNodes: cloneDeep(data) })
          const obj = {}
          data.forEach(v => {
            obj[v.id] = v
          })
          this.treeSearchData = obj
          this.setTreeDisabled(this.treeData, this.isRead)
          this.expandAllNodes(this.treeSearchData)
          // 存储权限数据
          this.$store.commit('user/SET_UNIONTREE', this.treeData)
          this.$store.commit('user/SET_UNIONSEARCHTREE', this.treeSearchData)
        }
      } catch (error) {
        this.treeData = []
        this.treeSearchData = {}
      }
    },
    async getUnionTreeById() {
      // 通过ids获取工会结构
      try {
        const { code, data } = await getAccountUnionTree()
        if (code === 200) {
          this.treeData = transformTozTreeFormat({ sNodes: cloneDeep(data) })
          const obj = {}
          data.forEach(v => {
            obj[v.id] = v
          })
          this.treeSearchData = obj
          this.setTreeDisabled(this.treeData, this.isRead)
          this.expandAllNodes(this.treeSearchData)
          // 存储权限数据
          this.$store.commit('user/SET_ACCOUNT_UNIONTREE', this.treeData)
          this.$store.commit('user/SET_ACCOUNT_UNIONSEARCHTREE', this.treeSearchData)
        }
      } catch (error) {
        this.treeData = []
        this.treeSearchData = {}
      }
    },
    checkChange(currentObj, treeStatus) {
      // 单选
      if (!this.isMultiple) {
        this.resetChecked()
        this.$refs.tree.setChecked(currentObj.id, true)
        return
      }
      // 多选
      // 前提是el-tree树中的check-strictly = true 严格的遵循父子不互相关联的做法
      const selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
      // 是否只勾选本级
      if (this.isLinkOnly) {
        return
      }
      // 是否只关联兄弟级
      if (this.isLinkOnlyBrother) {
        this.selectedBrother(currentObj, selected >= 0)
      } else {
        // 子级选择时关联父级状态
        if (this.isLinkToParent) {
          this.selectedParent(currentObj)
        }
      }
      if (currentObj.children && currentObj.children.length > 0) {
        // 父级选择时关联子级状态
        this.uniteChildSame(currentObj.children, selected >= 0)
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(treeList, isSelected) {
      treeList.forEach(v => {
        this.$refs.tree.setChecked(v.id, isSelected)
        if (v.children && v.children.length > 0) {
          this.uniteChildSame(v.children, isSelected)
        }
      })
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      const currentNode = this.$refs.tree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    },
    // 统一处理兄弟级节点
    selectedBrother(currentObj, isSelected) {
      this.resetChecked()
      this.$refs.tree.setChecked(currentObj, isSelected)
    },
    setItemChecked(currentObj, currentNode) {
      if (this.isRead || this.isLinkOnlyBrother) {
        return
      }
      if (!this.isMultiple) {
        this.resetChecked()
        this.$refs.tree.setChecked(currentObj.id, true)
        return
      }
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      const index = checkedKeys.findIndex(v => v === currentObj.id)
      if (index >= 0) {
        // 已经勾选了就设为未勾选状态
        this.$refs.tree.setChecked(currentNode, false)
      } else {
        // 没有勾选过就设为勾选状态
        this.$refs.tree.setChecked(currentNode, true)
      }
    },
    setTreeDisabled(routes, disabled) {
      // 设置禁止选中
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
    async selectedCanPass(keys) {
      // 判断选择的范围是否可用
      const { code, data } = await getAccountDetail({
        type: 'admin',
        top_union_id: keys[0]
      })
      if (code === 200) {
        this.inputValue = keys.join(',')
        const userUnionInfo = data || {}
        this.hideTree()
        this.$emit('confirm', { value: this.inputValue, userUnionInfo })
      }
    },
    confirm() {
      let checkedKeys = []
      if (this.$refs.tree.getCheckedKeys()) {
        checkedKeys = this.$refs.tree.getCheckedKeys()
        // this.checkedId = checkedKeys
      }
      if (checkedKeys.length < 1) {
        this.$message({
          type: 'warning',
          message: '请至少选择一个工会'
        })
        return
      }
      if (!this.isConfirmRequest) {
        this.inputValue = checkedKeys.join(',')
        this.hideTree()
        this.$emit('confirm', { value: this.inputValue })
      } else {
        this.selectedCanPass(checkedKeys)
      }
    },
    showTree() {
      this.isShowTree = true
      // this.inputValue = this.moduleIds
      this.checkedId = this.inputValue.split(',')
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
    },
    hideTree() {
      this.isShowTree = false
    },
    expandAllNodes(data) {
      // 当节点数据量小于300条时 默认展开全部节点
      if (Object.keys(data).length < 300) {
        this.expandAll = true
      }
    },
    filterNode(value, data) {
      // 搜索树节点
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getTreeData() {
      // 获取当前树形结构数据
      return this.treeData
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
/deep/ .custom-dialog-class {
  .el-dialog__body {
    padding-top: 10px;
  }
  width: 550px;
}
</style>
