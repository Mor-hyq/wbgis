<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="dialog-custom"
  >
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
        prop="username"
        :label="`${mylang.accountName}`"
      >
        <el-input v-model="form.username" clearable />
      </el-form-item>
      <el-form-item
        prop="nickname"
        :label="`${mylang.realName}`"
      >
        <el-input v-model="form.nickname" clearable />
      </el-form-item>
      <el-form-item
        prop="sex"
        :label="mylang.sex"
      >
        <el-radio-group v-model="form.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
          <!-- <el-radio :label="2">保密</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="company_id"
        :label="mylang.company"
      >
        <el-select v-model="form.company_id" clearable @change="companyChange">
          <el-option
            v-for="type in companyOptions"
            :key="type.id"
            :value="type.id"
            :label="type.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.company_id"
        prop="department_id"
        :label="mylang.department"
      >
        <el-select v-model="form.department_id" clearable>
          <el-option
            v-for="type in departmentOptions"
            :key="type.id"
            :value="type.id"
            :label="type.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="mobile"
        :label="`${mylang.phone}`"
      >
        <el-input v-model="form.mobile" clearable />
      </el-form-item>
      <el-form-item
        prop="position"
        :label="`${mylang.job}`"
      >
        <el-input v-model="form.position" clearable />
      </el-form-item>
      <el-form-item v-if="!editId" :label="mylang.password" prop="password">
        <!-- 避免浏览器自动填充密码 -->
        <input type="text" tabindex="-1" autocomplete="off" style="width:0;height:0;position:absolute;left:-9999px;top:-9999px;">
        <el-input
          v-model="form.password"
          type="password"
          clearable
          autocomplete="new-password"
          auto-complete="new-password"
          :maxlength="150"
        />
      </el-form-item>
      <el-form-item v-if="!editId" :label="mylang.confirmPassword" prop="password_confirm">
        <el-input
          v-model="form.password_confirm"
          type="password"
          clearable
          autocomplete="new-password"
          auto-complete="new-password"
          :maxlength="150"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hideDialog">{{ mylang.cancel }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ mylang.save }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUser, editUser, getDepartmentSelet } from '@/api/system'
export default {
  name: 'UserDialogForm',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (rule.required) {
      // 必填时的校验
        if (!this.form.password) {
          callback(new Error('请先输入密码'))
        } else if (value === '') {
          callback(new Error('请输入确认密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        // 非必填时校验
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
    return {
      visible: false,
      dialogTitle: '',
      dialogDisabled: false,
      editId: '',
      form: {
        username: '',
        password: '',
        password_confirm: '',
        nickname: '',
        company_id: '',
        department_id: '',
        mobile: '',
        sex: '',
        position: ''
      },
      formRules: {
        username: [
          { required: true, message: `请输入${this.mylang.accountName}` }
        ],
        company_id: [
          { required: true, message: `请选择${this.mylang.company}` }
        ],
        department_id: [
          { required: true, message: `请选择${this.mylang.department}` }
        ],
        password: [
          { required: true, trigger: 'blur', message: `请填写${this.mylang.password}` }
        ],
        password_confirm: [
          { required: true, trigger: 'blur', validator: validatePass2 }
        ]
      },
      companyOptions: [],
      departmentOptions: []
    }
  },
  watch: {
    'form.company_id'(val) {
      if (val !== '') {
        this.getDepartmentOptions(val)
      }
    }
  },
  created() {
    this.getCompanyOptions()
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
        this.form.username = option.data.username
        this.form.nickname = option.data.nickname
        this.form.department_id = option.data.department_id
        this.form.company_id = option.data.company_id
        this.form.mobile = option.data.mobile
        this.form.sex = +option.data.sex
        this.form.position = option.data.position
      } else {
        // 新增
        if (this.$refs.dialogForms) {
          // 清除校验信息
          this.$refs.dialogForms.resetFields()
        }
        this.form.username = ''
        this.form.nickname = ''
        this.form.department_id = ''
        this.form.company_id = ''
        this.form.mobile = ''
        this.form.sex = ''
        this.form.position = ''
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
              this.editUser()
            } else {
              // 如果dialogDisabled=false 则为新建
              this.addUser()
            }
          })
        } else {
          return false
        }
      })
    },
    async addUser() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await addUser(this.form)
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.hideDialog()
          this.$emit('confirm')
        }
      } catch (error) {
        loading.close()
      }
    },
    async editUser() {
      const loading = this.$loading({
        lock: true,
        text: '提交中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const { code } = await editUser({
          id: this.editId,
          ...this.form
        })
        loading.close()
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.hideDialog()
          this.$emit('confirm')
        }
      } catch (error) {
        loading.close()
      }
    },
    getCompanyOptions() {
      if (this.$store.state.form.companySelect.length < 1) {
        this.$store.dispatch('form/setCompanySelect').then(() => {
          this.companyOptions = this.$store.state.form.companySelect
        })
      } else {
        this.companyOptions = this.$store.state.form.companySelect
      }
    },
    async getDepartmentOptions(id) {
      try {
        const { code, data } = await getDepartmentSelet({
          company_id: id
        })
        if (code === 200) {
          this.departmentOptions = data
        }
      } catch (error) {
        //
      }
    },
    companyChange(data) {
      this.form.department_id = ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
