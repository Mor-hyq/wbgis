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
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item
            prop="order"
            :label="`${mylang.planNumber}`"
          >
            <el-input v-model="form.order" :readonly="dialogDisabled" clearable />
          </el-form-item>
          <el-form-item
            prop="state"
            :label="`${mylang.planState}`"
          >
            <el-select v-model="form.state" clearable>
              <el-option
                v-for="type in stateOptions"
                :key="type.id"
                :value="type.id"
                :label="type.state"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="method"
            :label="`${mylang.exerciseMethod}`"
          >
            <el-input v-model="form.method" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            prop="subject"
            :label="`${mylang.exerciseSubject}`"
          >
            <el-input v-model="form.subject" clearable />
          </el-form-item>
          <el-form-item
            prop="org"
            :label="`${mylang.organize}`"
          >
            <el-input v-model="form.org" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 当计划为进行中时需要填写 -->
      <el-form-item
        v-if="form.state === 2"
        prop="time"
        :label="`${mylang.actual}${mylang.exerciseTime}`"
      >
        <el-date-picker
          v-model="form.time"
          type="datetimerange"
          clearable
        />
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
import { addExercisePlan, editExercisePlan } from '@/api/emergency'
export default {
  name: 'ExercisePlanDialogForm',
  data() {
    return {
      id: this.$route.query.id || '',
      visible: false,
      dialogTitle: '',
      dialogDisabled: false,
      editId: '',
      form: {
        order: '',
        subject: '',
        state: '',
        method: '',
        time: '',
        org: '',
        remark: ''
      },
      formRules: {
        order: [
          { required: true, message: `请输入${this.mylang.number}` }
        ],
        subject: [
          { required: true, message: `请输入${this.mylang.exerciseSubject}` }
        ],
        org: [
          { required: true, message: `请输入${this.mylang.organize}` }
        ],
        method: [
          { required: true, message: `请输入${this.mylang.exerciseMethod}` }
        ],
        time: [
          { required: true, message: `请选择${this.mylang.exerciseTime}` }
        ],
        state: [
          { required: true, message: `请选择${this.mylang.planState}` }
        ]
      },
      stateOptions: []
    }
  },
  mounted() {
    this.getStateOptions()
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
        //  编辑
        this.form = { ...option.data }
      } else {
        //  新增
        if (this.$refs.dialogForms) {
          // 清除校验信息
          this.$refs.dialogForms.resetFields()
        }
        this.form.order = ''
        this.form.subject = ''
        this.form.state = ''
        this.form.method = ''
        this.form.org = ''
        this.form.remark = ''
        this.form.time = ''
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
              this.editExercisePlan()
            } else {
              // 如果dialogDisabled=false 则为新建
              this.addExercisePlan()
            }
          })
        } else {
          return false
        }
      })
    },
    async addExercisePlan() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await addExercisePlan({ emerge_drill_id: this.id, ...this.form })
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
    async editExercisePlan() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await editExercisePlan({
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
    },
    getStateOptions() {
      if (this.$store.state.form.exercisePlanState.length < 1) {
        this.$store.dispatch('form/setExercisePlanState').then(() => {
          this.stateOptions = this.$store.state.form.exercisePlanState
        })
      } else {
        this.stateOptions = this.$store.state.form.exercisePlanState
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
