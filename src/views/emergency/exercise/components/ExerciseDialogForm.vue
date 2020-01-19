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
        prop="order"
        :label="`${mylang.planNumber}`"
      >
        <el-input v-model="form.order" :readonly="dialogDisabled" clearable />
      </el-form-item>
      <el-form-item
        prop="name"
        :label="`${mylang.exerciseName}`"
      >
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <el-form-item
        prop="company"
        :label="`${mylang.belongCompany}`"
      >
        <el-input v-model="form.company" clearable />
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
import { addExercise, editExercise } from '@/api/emergency'
export default {
  name: 'ExerciseDialogForm',
  data() {
    return {
      visible: false,
      dialogTitle: '',
      dialogDisabled: false,
      editId: '',
      form: {
        order: '',
        name: '',
        company: '',
        remark: ''
      },
      formRules: {
        order: [
          { required: true, message: `请输入${this.mylang.planNumber}` }
        ],
        name: [
          { required: true, message: `请输入${this.mylang.exerciseName}` }
        ],
        company: [
          { required: true, message: `请输入${this.mylang.belongCompany}` }
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
        this.form = { ...option.data }
      } else {
        // 新增
        if (this.$refs.dialogForms) {
          // 清除校验信息
          this.$refs.dialogForms.resetFields()
        }
        this.form.order = ''
        this.form.name = ''
        this.form.company = ''
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
              this.editExercise()
            } else {
              // 如果dialogDisabled=false 则为新建
              this.addExercise()
            }
          })
        } else {
          return false
        }
      })
    },
    async addExercise() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await addExercise(this.form)
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
    async editExercise() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await editExercise({
          id: this.editId,
          ...this.form
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
