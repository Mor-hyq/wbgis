<template>
  <div class="left-asside">
    <div class="buttons">
      <el-button size="mini" type="primary" @click="handleAdd">{{ mylang.add }}</el-button>
      <el-button size="mini" style="margin-left:7px;" type="primary" @click="handleEdit">{{ mylang.modify }}</el-button>
      <el-button size="mini" plain style="margin-left:7px;" type="danger" @click="handleDelete">{{ mylang.delete }}</el-button>
    </div>
    <div class="cont">
      <el-tree
        ref="typeTree"
        :data="treeList"
        :props="defaultProps"
        show-checkbox
        :highlight-current="true"
        :expand-on-click-node="false"
        default-expand-all
        check-strictly
        node-key="id"
        @check="checkChange"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span @click="setItemChecked(data,node)">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="visible" append-to-body>
      <el-form
        ref="dialogForms"
        :rules="formRules"
        :model="form"
        label-suffix=":"
        label-width="auto"
        :size="$btnSize"
        class="custom-class"
      >
        <!-- <el-form-item
          prop="pid"
          :label="`${mylang.parentType}`"
        >
          <el-input v-model="form.pname" disabled clearable />
        </el-form-item> -->
        <el-form-item prop="pid" :label="`${mylang.parentType}`">
          <el-cascader
            v-model="form.pid"
            style="width:300px"
            :show-all-levels="true"
            :options="dialogTree"
            :props="cascaderOptions"
          />
        </el-form-item>
        <el-form-item
          prop="name"
          :label="`${mylang.typeName}`"
        >
          <el-input v-model="form.name" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">{{ mylang.cancel }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{ mylang.confirm }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFileTypeList, addFileType, editFileType, deleteFileType } from '@/api/equipmentInfo'
export default {
  name: 'DataTypeManage',
  data() {
    return {
      treeList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      listQuery: {
        page: 1,
        limit: 100
      },
      checkObj: { // 当前选中节点的数据
        id: '',
        name: ''
      },
      edtObj: { // 编辑时的父节点的数据
        pid: []
        // pname: ''
      },
      cascaderOptions: {
        label: 'name',
        value: 'id',
        children: 'children',
        checkStrictly: true
      },
      dialogTitle: '',
      visible: false,
      isEdit: false, // 是否编辑状态
      form: {
        pid: [],
        // pname: '',
        name: ''
      },
      formRules: {
        pid: [
          { required: true, type: 'array', message: `请选择${this.mylang.parentType}` }
        ],
        name: [
          { required: true, message: `请选择${this.mylang.typeName}` }
        ]
      },
      dialogTree: []
    }
  },
  created() {
    this.initTableData()
  },
  methods: {
    initTableData({
      page = 1,
      paginate = this.listQuery.limit
    } = {}) {
      this.listQuery.page = 1
      this.getList({ page, paginate })
    },
    async getList({
      page = this.listQuery.page,
      paginate = this.listQuery.limit
    } = {}) {
      try {
        const { code, data } = await getFileTypeList({
          page, paginate,
          type: 'tree'
        })
        if (code === 200) {
          this.treeList = data
          this.dialogTree = [{ id: 0, name: '根' }].concat(data)
        }
      } catch (error) {
        // console.log(error)
      }
    },
    resetChecked() {
      this.$refs.typeTree.setCheckedKeys([])
    },
    setChecked(currentObj) {
      this.resetChecked()
      if (this.checkObj.id !== currentObj.id) {
        this.checkObj.id = currentObj.id
        this.checkObj.name = currentObj.name
        const arr = []
        const curArr = currentObj.tree.split(',')
        curArr.forEach((v, i) => {
          if (i < curArr.length - 2) {
            if (v) {
              arr.push(+v)
            }
          }
        })
        this.edtObj.pid = arr
        // this.edtObj.pid = currentObj.pid
        // this.edtObj.pname = currentObj.pname
        this.$refs.typeTree.setChecked(currentObj.id, true)
      } else {
        this.checkObj.id = ''
        this.checkObj.name = ''
        this.edtObj.pid = []
        // this.edtObj.pname = ''
      }
      this.$emit('checkChange', { data: this.checkObj.id })
    },
    checkChange(currentObj, treeStatus) {
      // 单选
      this.setChecked(currentObj)
    },
    setItemChecked(currentObj, currentNode) {
      this.setChecked(currentObj)
    },
    confirmCheck() {
      const checkedKeys = this.$refs.typeTree.getCheckedKeys()
      return checkedKeys
    },
    showDialog() {
      this.visible = true
    },
    hideDialog() {
      this.visible = false
    },
    handleAdd() {
      this.showDialog()
      if (this.$refs.dialogForms) {
        // 清除校验信息
        this.$refs.dialogForms.resetFields()
      }
      if (!this.checkObj.id) {
        this.form.pid = [0]
        // this.form.pname = '根'
      } else {
        this.form.pid = this.edtObj.pid
        // this.form.pid = this.checkObj.id
        // this.form.pname = this.checkObj.name
      }
      // 新增
      this.isEdit = false
      this.dialogTitle = this.mylang.add + this.mylang.dataType
      this.form.name = ''
    },
    handleEdit() {
      if (!this.checkObj.id) {
        this.$message({
          type: 'warning',
          message: '请选择要修改的类型'
        })
        return
      }
      this.isEdit = true
      this.form.pid = this.edtObj.pid
      // this.form.pname = this.edtObj.pname
      this.form.name = this.checkObj.name
      this.dialogTitle = this.mylang.modify + this.mylang.dataType
      this.showDialog()
    },
    handleDelete() {
      if (!this.checkObj.id) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的类型'
        })
        return
      }
      this.$confirm('即将删除您选中的' + this.mylang.dataType + '，确认吗？', '删除' + this.mylang.dataType, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData({ ids: this.checkObj.id })
      })
    },
    handleConfirm() {
      this.$refs.dialogForms.validate(valid => {
        if (valid) {
          this.$confirm('确定提交吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              this.uploadEdit()
            } else {
              this.uploadCreate()
            }
          })
        }
      })
    },
    async uploadCreate() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const pid = this.form.pid[this.form.pid.length - 1]
        const { code } = await addFileType({
          // pid: this.form.pid,
          pid,
          name: this.form.name
        })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '新增成功'
          })
          this.hideDialog()
          // 重新获取当前页面数据
          this.initTableData()
          this.checkObj = {
            id: '',
            name: ''
          }
          this.edtObj = {
            pid: []
          }
          this.form = {
            pid: [],
            name: ''
          }
        }
      } catch (error) {
        loading.close()
      }
    },
    async uploadEdit() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const pid = this.form.pid[this.form.pid.length - 1]
        const { code } = await editFileType({
          id: this.checkObj.id,
          // pid: this.form.pid,
          pid,
          name: this.form.name
        })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '编辑成功'
          })
          this.hideDialog()
          // 重新获取当前页面数据
          this.initTableData()
          this.checkObj = {
            id: '',
            name: ''
          }
          this.edtObj = {
            pid: []
          }
          this.form = {
            pid: [],
            name: ''
          }
        }
      } catch (error) {
        loading.close()
      }
    },
    async deleteData({ ids } = {}) {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await deleteFileType({ ids })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          // 重新获取当前页面数据
          this.initTableData()
        }
      } catch (error) {
        loading.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.left-asside {
  border: solid 1px #e6e6e6;
  padding: 5px;
  .cont {
    height: 70vh;
    overflow: auto;
    @include scrollBar;
  }
}
.buttons {
  margin-bottom: 8px;
  >button {
    padding: 5px 10px;
  }
}
.custom-tree-node {
  font-size: 14px;
}
</style>
