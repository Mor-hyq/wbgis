<template>
  <el-dialog :title="dialogTitle" :visible.sync="visible">
    <el-form
      ref="dialogForms"
      :rules="formRules"
      :model="form"
      label-suffix=":"
      label-width="auto"
      :size="$btnSize"
      class="custom-class"
    >
      <el-form-item
        v-if="form.id"
        prop="id"
        :label="`${mylang.roleCode}`"
      >
        <el-input v-model="form.id" disabled clearable />
      </el-form-item>
      <el-form-item
        prop="name"
        :label="`${mylang.roleName}`"
      >
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item
        prop="remark"
        :label="`${mylang.remark}`"
      >
        <el-input v-model="form.remark" type="textarea" :rows="5" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">{{ mylang.cancel }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ mylang.save }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRole, editRole } from '@/api/system'
export default {
  name: 'RoleDialogForm',
  data() {
    return {
      visible: false,
      dialogTitle: '',
      dialogDisabled: false,
      editId: '',
      form: {
        id: '',
        name: '',
        remark: ''
      },
      formRules: {
        name: [
          { required: true, message: `请输入${this.mylang.exerciseName}` }
        ]
      }
    }
  },
  methods: {
    hideDialog() {
      this.visible = false
    },
    showDialog() {
      this.visible = true
    },
    show(option) {
      this.dialogTitle = option.dialogTitle || ''
      this.dialogDisabled = option.disabled || false
      this.editId = option.editId || ''
      this.showDialog()
      if (option.disabled) {
        // 编辑
        this.form.id = option.editId
        this.form.name = option.data.name
        this.form.remark = option.data.remark
      } else {
        // 新增
        if (this.$refs.dialogForms) {
          // 清除校验信息
          this.$refs.dialogForms.resetFields()
        }
        this.form.id = ''
        this.form.name = ''
        this.form.remark = ''
      }
    },
    handleConfirm() {
      // 提交确认
      this.$refs.dialogForms.validate((valid) => {
        if (valid) {
          this.$confirm('确定保存吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 如果dialogDisabled=true 则为编辑
            if (this.dialogDisabled) {
              this.editRole()
            } else {
              // 如果dialogDisabled=false 则为新建
              this.addRole()
            }
          })
        } else {
          return false
        }
      })
    },
    async addRole() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await addRole({
          name: this.form.name,
          remark: this.form.remark
        })
        loading.close()
        this.hideDialog()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.$emit('confirm')
        }
      } catch (error) {
        loading.close()
        this.hideDialog()
      }
    },
    async editRole() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await editRole({
          id: this.editId,
          name: this.form.name,
          remark: this.form.remark
        })
        loading.close()
        this.hideDialog()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.$emit('confirm')
        }
      } catch (error) {
        loading.close()
        this.hideDialog()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
